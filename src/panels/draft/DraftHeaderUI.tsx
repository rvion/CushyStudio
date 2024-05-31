import type { DraftL } from '../../models/Draft'

import { observer } from 'mobx-react-lite'

import { DraftIllustrationUI } from '../../cards/fancycard/DraftIllustration'
import { BoxUI } from '../../rsuite/box/BoxUI'
import { Button } from '../../rsuite/button/Button'
import { DraftMenuActionsUI } from './DraftMenuActionsUI'
import { DraftMenuJumpUI } from './DraftMenuJump'
import { DraftMenuLooksUI } from './DraftMenuLooksUI'
import { PublishAppBtnUI } from './PublishAppBtnUI'
import { RunOrAutorunUI } from './RunOrAutorunUI'

export const DraftHeaderUI = observer(function DraftHeaderUI_(p: {
    //
    draft: DraftL
    className?: string
}) {
    const { draft } = p
    const app = draft.appRef.item
    return (
        <BoxUI
            // base={{ chroma: 0.1, lightness: 0.1 }}
            // base={10}
            // border
            style={{
                // background: 'linear-gradient(45deg, #3b3b3b, oklch(var(--b1)))',
                zIndex: 99 /*boxShadow: '0 0 0.5rem oklch(var(--p)/.3)'*/,
            }}
            className={p.className}
            tw='_DraftHeaderUI flex sticky top-0 z-50'
        >
            <div tw='flex gap-1 mt-1 flex-grow relative text-base-content'>
                <DraftIllustrationUI revealAppIllustrationOnHover draft={draft} size='7.3rem' />
                <div tw='flex flex-col gap-1 flex-grow'>
                    <div tw='flex text-sm gap-1'>
                        App <span tw='font-bold'>{app.name}</span>
                    </div>
                    <div className='flex items-center gap-2 justify-between text-sm'>
                        <input
                            tw='input input-bordered input-xs flex-grow'
                            onChange={(ev) => draft.update({ title: ev.target.value })}
                            // tw='w-full'
                            value={draft.data.title ?? 'no title'}
                        ></input>
                    </div>
                    <RunOrAutorunUI tw='flex-shrink-0' draft={draft} />
                    <div tw='flex'>
                        <DraftMenuActionsUI draft={draft} title={'Actions' /* app.name */} />
                        <DraftMenuJumpUI draft={draft} title='Drafts' />
                        {/* --------------------------------- */}
                        <div tw='flex-grow'></div>
                        <PublishAppBtnUI app={app} />
                        <DraftMenuLooksUI draft={draft} title={app.name} />
                        {/* --------------------------------- */}
                        <Button square size='xs' icon='mdiUnfoldMoreHorizontal' onClick={draft.expandTopLevelFormEntries} />
                        <Button square size='xs' icon='mdiUnfoldLessHorizontal' onClick={draft.collapseTopLevelFormEntries} />
                    </div>
                </div>
            </div>
        </BoxUI>
    )
})
