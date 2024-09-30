import type { DraftL } from '../../models/Draft'

import { observer } from 'mobx-react-lite'

import { DraftIllustrationUI } from '../../cards/fancycard/DraftIllustration'
import { Button } from '../../csuite/button/Button'
import { Frame, type FrameProps } from '../../csuite/frame/Frame'
import { hashStringToNumber } from '../../csuite/hashUtils/hash'
import { InputStringUI } from '../../csuite/input-string/InputStringUI'
import { PanelHeaderUI } from '../../csuite/panel/PanelHeaderUI'
import { mergeStylesTsEfficient } from '../../csuite/utils/mergeStylesTsEfficient'
import { DraftMenuActionsUI } from './DraftMenuActionsUI'
import { DraftMenuDataBlockUI } from './DraftMenuJump'
import { DraftMenuLooksUI } from './DraftMenuLooksUI'
import OverflowingRowUI from './OverflowingRowUI'
import { PublishAppBtnUI } from './PublishAppBtnUI'
import { RunOrAutorunUI } from './RunOrAutorunUI'

export const DraftHeaderUI = observer(function DraftHeader({
    // own props
    draft,

    // wrapped
    children,
    style,

    // rest
    ...rest
}: { draft: DraftL } & FrameProps) {
    const app = draft.appRef.item

    return (
        <Frame
            style={mergeStylesTsEfficient({ zIndex: 99 }, style)}
            tw='🔴test flex flex-col sticky top-0 z-50 overflow-clip shrink-0'
            {...rest}
        >
            <PanelHeaderUI>
                <DraftMenuLooksUI draft={draft} title={app.name} />
                <DraftMenuActionsUI draft={draft} title={'Actions' /* app.name */} />
                <PublishAppBtnUI
                    app={app} // TODO(bird_d): Make this "joined" with the app selection button when not hidden.
                />

                {children}
            </PanelHeaderUI>

            <OverflowingRowUI // quick access to past versions
                icon='mdiHistory'
                tw='gap-1'
            >
                {app.lastExecutedDrafts.map(({ id, title, lastRunAt }) => {
                    return (
                        <Button
                            borderless
                            // subtle
                            look='primary'
                            hue={hashStringToNumber(id)}
                            key={id}
                            onClick={() => cushy.db.draft.getOrThrow(id).openOrFocusTab()}
                        >
                            <div tw='flex items-center'>{title ?? id}</div>
                        </Button>
                    )
                })}
            </OverflowingRowUI>
            <h1 // Proeminent app title
                tw='underline cursor-pointer'
                onClick={() => cushy.openInVSCode(draft.app.relPath)}
            >
                {draft.app.name} <span tw='text-xs'>{draft.app.id}</span>
            </h1>
            <Frame tw='flex w-full gap-2 p-2 flex-grow text-base-content' base={{ contrast: -0.025 }}>
                <DraftIllustrationUI
                    revealAppIllustrationOnHover
                    draft={draft}
                    // XXX: This is bad because h-input will change from the theme settings, but this will not.
                    size='3.69rem'
                />
                <div tw='flex flex-col flex-1'>
                    <Frame line>
                        <DraftMenuDataBlockUI draft={draft} title='Drafts' />
                        <RunOrAutorunUI tw='flex-grow !h-full' draft={draft} />
                    </Frame>
                    <div tw='flex items-center justify-between'>
                        <InputStringUI
                            icon='mdiHammerScrewdriver'
                            autoResize
                            getValue={() => draft.data.canvasToolCategory ?? ''}
                            setValue={(val) => draft.update({ canvasToolCategory: val ? val : null })}
                            placeholder='Unified Canvas Category'
                        />
                        {cushy.theme.fields.labelLayout.renderSimple({ LabelText: 'Label' })}
                    </div>
                </div>
            </Frame>
        </Frame>
    )
})

// {/* ({formatSize(JSON.stringify(draft.data.formSerial).length)})  */}
// {/* ({formatSize(JSON.stringify(draft.data.formSerial, null, 3).length)}) */}
// {/* <SpacerUI /> */}
// {/* <div tw='flex justify-center'>
//     <Frame
//         // TODO(bird_d): We need a better way to "join" items together automatically. Possibly just move the tailwind from this? But with better handling of the inbetween borders.
//         tw={['flex [&>*]:rounded-none [&_*]:!border-none ']}
//         border={{ contrast: 0.1 }}
//     >
//         <Dropdown //
//             // tw={'flex-grow'}
//             title={false}
//             content={() => <>Not implemented</>}
//             button={
//                 <Button //
//                     tw={'w-full'}
//                     icon={'mdiApplication'}
//                     tooltip='Not Implemented'
//                 >
//                     {app.name}
//                 </Button>
//             }
//         />
//     </Frame>
// </div> */}
