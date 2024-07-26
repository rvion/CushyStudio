import { observer } from 'mobx-react-lite'

import { AppCardUI } from '../cards/fancycard/AppCardUI'
import { Button } from '../csuite/button/Button'
import { InputBoolToggleButtonUI } from '../csuite/checkbox/InputBoolToggleButtonUI'
import { Frame } from '../csuite/frame/Frame'
import { InputNumberUI } from '../csuite/input-number/InputNumberUI'
import { InputSliderUI_legacy } from '../csuite/input-slider/Slider'
import { InputStringUI } from '../csuite/input-string/InputStringUI'
import { Toggle } from '../csuite/inputs/shims'
import { useSt } from '../state/stateContext'
import { FieldAndLabelUI } from '../widgets/misc/FieldAndLabelUI'

export const Panel_FullScreenLibrary = observer(function Panel_CardPicker3UI_(p: {}) {
    const st = useSt()
    const library = st.library

    return (
        <div tw='relative h-full flex-grow flex flex-col'>
            <Frame base tw='p-4 flex flex-wrap items-center'>
                <div tw='text-2xl'>Library</div>
                <div tw='flex gap-1 items-center flex-wrap'>
                    <InputStringUI
                        icon='mdiSelectSearch'
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
                        showToggleButtonBox
                        mode='checkbox'
                        text='Descriptions'
                        value={st.library.showDescription}
                        onValueChange={(next) => (st.library.showDescription = next)}
                    />
                    <InputBoolToggleButtonUI
                        showToggleButtonBox
                        mode='checkbox'
                        text='Drafts'
                        value={st.library.showDrafts}
                        onValueChange={(next) => (st.library.showDrafts = next)}
                    />
                    <InputBoolToggleButtonUI
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
                </div>
            </Frame>
            <div tw='flex flex-col flex-grow p-4 overflow-auto'>
                <div tw='divider'></div>
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
