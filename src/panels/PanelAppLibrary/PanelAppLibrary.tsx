import type { NO_PROPS } from '../../csuite/types/NO_PROPS'

import { observer } from 'mobx-react-lite'

import { AppCardUI } from '../../cards/fancycard/AppCardUI'
import { Button } from '../../csuite/button/Button'
import { InputBoolToggleButtonUI } from '../../csuite/checkbox/InputBoolToggleButtonUI'
import { InputNumberUI } from '../../csuite/input-number/InputNumberUI'
import { InputStringUI } from '../../csuite/input-string/InputStringUI'
import { PanelHeaderUI } from '../../csuite/panel/PanelHeaderUI'
import { toastSuccess } from '../../csuite/utils/toasts'
import { Panel, type PanelHeader } from '../../router/Panel'
import { useSt } from '../../state/stateContext'

export const PanelAppLibrary = new Panel({
    name: 'PanelAppLibrary',
    category: 'app',
    widget: (): React.FC<NO_PROPS> => PanelAppLibraryUI,
    header: (p): PanelHeader => ({ title: 'PanelAppLibrary' }),
    def: (): NO_PROPS => ({}),
    icon: 'mdiBookmarkBoxMultipleOutline',
})

export const PanelAppLibraryUI = observer(function PanelAppLibraryUI_(p: NO_PROPS) {
    const st = useSt()
    const library = st.library

    return (
        <div tw='relative h-full flex-grow flex flex-col'>
            <PanelHeaderUI>
                <InputStringUI
                    icon='mdiMagnify'
                    tw='csuite-basic-input'
                    getValue={() => library.query}
                    setValue={(next) => (library.query = next)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            const app = library.appsFiltered[library.selectionCursor]
                            if (app == null) return
                            app.openLastOrCreateDraft()
                        } else if (e.key === 'ArrowDown') {
                            library.selectionCursor++
                        } else if (e.key === 'ArrowUp') {
                            library.selectionCursor--
                        }
                    }}
                    autoFocus
                    placeholder='search'
                    // auto select text on focus
                    onFocus={(e) => e.target.select()}
                />
                <Button //
                    look='primary'
                    onClick={st.startupFileIndexing}
                    children='Index All Apps'
                />
                <InputBoolToggleButtonUI
                    toggleGroup='panel-app-header'
                    showToggleButtonBox
                    mode='checkbox'
                    text='Descriptions'
                    value={st.library.showDescription}
                    onValueChange={(next) => (st.library.showDescription = next)}
                />
                <InputBoolToggleButtonUI
                    toggleGroup='panel-app-header'
                    showToggleButtonBox
                    mode='checkbox'
                    text='Drafts'
                    value={st.library.showDrafts}
                    onValueChange={(next) => (st.library.showDrafts = next)}
                />
                <InputBoolToggleButtonUI
                    toggleGroup='panel-app-header'
                    showToggleButtonBox
                    mode='checkbox'
                    text='Favorites'
                    value={st.library.showFavorites}
                    onValueChange={(next) => (st.library.showFavorites = next)}
                />
                <InputNumberUI
                    text='size'
                    mode='int'
                    min={3}
                    max={20}
                    style={{ width: '10rem' }}
                    suffix='rem'
                    onValueChange={(next) => (st.library.imageSize = `${next}rem`)}
                    value={parseInt(st.library.imageSize.slice(0, -3), 10)}
                />
            </PanelHeaderUI>
            <Button
                tw='self-start'
                look='error'
                children='remove every deleted app'
                onClick={() => {
                    const allapps = st.db.cushy_app.findAll()

                    const toDelete = allapps.filter((app) => !app.scriptStillExistsOnDisk)
                    if (toDelete.length === 0) {
                        toastSuccess('no deleted apps found')
                    }
                    cushy.startActivity({
                        backdrop: true,
                        shell: 'popup-full',
                        UI: () => (
                            <div>
                                {toDelete.length} app lacks based on non-existing scripts
                                <Button
                                    onClick={() => {
                                        toDelete.forEach((app) => {
                                            app.delete({
                                                draft_appID: {
                                                    project_currentDraftID: 'set null',
                                                    step_draftID: 'set null',
                                                },
                                                // 🔶 we probably want to make step.app nullable.
                                                step_appID: {
                                                    comfy_prompt_stepID: {},
                                                },
                                            })
                                        })
                                    }}
                                >
                                    Send them to oblivion (SUPER SLOW)
                                </Button>
                            </div>
                        ),
                    })
                }}
            />
            <div tw='flex flex-col flex-grow p-4 overflow-auto'>
                <div tw='text-xl text-accent font-bold'>Built-in Apps</div>
                <div tw='flex flex-wrap  gap-2'>
                    {st.library.appsFilteredBuiltIn.map((app, ix) => (
                        <div key={app.id}>
                            <AppCardUI //
                                active={st.library.selectionCursor === ix}
                                app={app}
                            />
                        </div>
                    ))}
                </div>
                <div tw='divider'></div>
                <div tw='text-xl text-accent font-bold'>Local Apps</div>
                <div tw='flex flex-wrap  gap-2'>
                    {st.library.appsFilteredLocal.map((app, ix) => (
                        <div key={app.id}>
                            <AppCardUI //
                                active={st.library.selectionCursor === ix}
                                app={app}
                            />
                        </div>
                    ))}
                </div>
                <div tw='divider'></div>
                <div tw='text-xl text-accent font-bold'>SDK Examples</div>
                <div tw='flex flex-wrap  gap-2'>
                    {st.library.appsFilteredExample.map((app, ix) => (
                        <div key={app.id}>
                            <AppCardUI //
                                active={st.library.selectionCursor === ix}
                                app={app}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
})
