import type { DraftL } from '../../models/Draft'

import { observer } from 'mobx-react-lite'

import { DraftIllustrationUI } from '../../cards/fancycard/DraftIllustration'
import { Button } from '../../csuite/button/Button'
import { Dropdown } from '../../csuite/dropdown/Dropdown'
import { Frame } from '../../csuite/frame/Frame'
import { InputStringUI } from '../../csuite/input-string/InputStringUI'
import { PanelHeaderUI } from '../../csuite/wrappers/PanelHeader'
import { DraftMenuActionsUI } from './DraftMenuActionsUI'
import { DraftMenuDataBlockUI } from './DraftMenuJump'
import { DraftMenuLooksUI } from './DraftMenuLooksUI'
import { PublishAppBtnUI } from './PublishAppBtnUI'
import { RunOrAutorunUI } from './RunOrAutorunUI'

export const DraftHeaderUI = observer(function DraftHeaderUI_(p: {
    //
    draft: DraftL
    className?: string
    children?: React.ReactNode
}) {
    const { draft } = p
    const app = draft.appRef.item

    return (
        <Frame
            style={{ zIndex: 99 /*boxShadow: '0 0 0.5rem oklch(var(--p)/.3)'*/ }}
            className={p.className}
            tw='_DraftHeaderUI flex flex-col sticky top-0 z-50 overflow-clip'
        >
            <PanelHeaderUI tw='grid grid-cols-[1fr_1fr_1fr]'>
                <div tw='flex'>
                    <DraftMenuLooksUI draft={draft} title={app.name} />
                    <DraftMenuActionsUI draft={draft} title={'Actions' /* app.name */} />
                </div>
                {/* <SpacerUI /> */}

                <div tw='flex justify-center'>
                    <Frame
                        // TODO(bird_d): We need a better way to "join" items together automatically. Possibly just move the tailwind from this? But with better handling of the inbetween borders.
                        tw={['flex [&>*]:rounded-none [&_*]:!border-none ']}
                        border={{ contrast: 0.1 }}
                    >
                        <Dropdown //
                            // tw={'flex-grow'}
                            title={false}
                            content={() => <></>}
                            button={
                                <Button //
                                    tw={'w-full'}
                                    icon={'mdiApplication'}
                                    tooltip='Not Implemented'
                                >
                                    {app.name}
                                </Button>
                            }
                        />
                        <PublishAppBtnUI
                            app={app} // TODO(bird_d): Make this "joined" with the app selection button when not hidden.
                        />
                    </Frame>
                </div>
                {p.children}
            </PanelHeaderUI>
            <Frame tw='flex w-full gap-2 p-2 flex-grow text-base-content' base={{ contrast: -0.025 }}>
                <DraftIllustrationUI
                    revealAppIllustrationOnHover
                    draft={draft}
                    // XXX: This is bad because h-input will change from the theme settings, but this will not.
                    size='3.69rem'
                />
                <div tw='flex flex-col gap-2'>
                    <DraftMenuDataBlockUI draft={draft} title='Drafts' />
                    <div tw='flex items-center'>
                        <InputStringUI
                            getValue={() => draft.data.canvasToolCategory ?? ''}
                            setValue={(val) => draft.update({ canvasToolCategory: val ? val : null })}
                            placeholder='Unified Canvas Category'
                        />
                        {/* [TEMPORARY HACK 2024-06-24 START] */}
                        {cushy.theme.root.fields.labelLayout.renderSimple({ label: 'Label' })}
                        {/* {p.children} */}
                        {/* [TEMPORARY HACK 2024-06-24 END] */}
                    </div>
                </div>
                <RunOrAutorunUI tw='flex-grow !h-full' draft={draft} />
            </Frame>
        </Frame>
    )
})
