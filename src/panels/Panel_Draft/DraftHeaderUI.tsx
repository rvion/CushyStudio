import type { DraftL } from '../../models/Draft'

import { observer } from 'mobx-react-lite'

import { DraftIllustrationUI } from '../../cards/fancycard/DraftIllustration'
import { Frame } from '../../csuite/frame/Frame'
import { DraftMenuActionsUI } from './DraftMenuActionsUI'
import { DraftMenuDataBlockUI } from './DraftMenuJump'
import { DraftMenuLooksUI } from './DraftMenuLooksUI'
import { PublishAppBtnUI } from './PublishAppBtnUI'
import { RunOrAutorunUI } from './RunOrAutorunUI'
import { PanelHeaderUI } from '../PanelHeader'
import { SpacerUI } from '../../controls/widgets/spacer/SpacerUI'
import { Dropdown } from '../../csuite/dropdown/Dropdown'
import { Button } from '../../csuite/button/Button'
import { InputStringUI } from '../../csuite/input-string/InputStringUI'

export const DraftHeaderUI = observer(function DraftHeaderUI_(p: {
    //
    draft: DraftL
    className?: string
}) {
    const { draft } = p
    const app = draft.appRef.item
    return (
        <Frame
            style={{ zIndex: 99 /*boxShadow: '0 0 0.5rem oklch(var(--p)/.3)'*/ }}
            className={p.className}
            tw='_DraftHeaderUI flex flex-col sticky top-0 z-50 overflow-clip'
        >
            <PanelHeaderUI>
                <DraftMenuLooksUI draft={draft} title={app.name} />
                <DraftMenuActionsUI draft={draft} title={'Actions' /* app.name */} />
                <SpacerUI />
                <Dropdown //
                    // tw={'flex-grow'}
                    title={false}
                    content={() => <></>}
                    button={
                        <Button //
                            tw={'w-full'}
                            icon={'mdiApplication'}
                        >
                            {app.name}
                        </Button>
                    }
                />
                <PublishAppBtnUI
                    app={app} // TODO(bird_d): Make this "joined" with the app selection button when not hidden.
                />
                <SpacerUI />
            </PanelHeaderUI>
            <Frame tw='flex w-full gap-2 p-2 flex-grow text-base-content' base={{ contrast: -0.025 }}>
                <DraftIllustrationUI
                    revealAppIllustrationOnHover
                    draft={draft}
                    size='3.69rem'
                    // XXX: This is bad because h-input will change from the theme settings, but this will not.
                />
                <div tw='flex flex-col gap-2'>
                    <DraftMenuDataBlockUI draft={draft} title='Drafts' />
                    <InputStringUI
                        getValue={() => draft.data.canvasToolCategory ?? ''}
                        setValue={(val) => draft.update({ canvasToolCategory: val ? val : null })}
                        placeholder='Unified Canvas Category'
                    />
                </div>
                <RunOrAutorunUI tw='flex-grow !h-full' draft={draft} />
            </Frame>
        </Frame>
    )
})
