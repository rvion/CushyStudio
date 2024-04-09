import type { DraftL } from '../../models/Draft'

import { observer } from 'mobx-react-lite'

import { DraftIllustrationUI } from '../../cards/fancycard/DraftIllustration'
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
        <div
            style={{
                // background: 'linear-gradient(45deg, #3b3b3b, oklch(var(--b1)))',
                background: 'bg-',
                zIndex: 99 /*boxShadow: '0 0 0.5rem oklch(var(--p)/.3)'*/,
            }}
            className={p.className}
            tw='_DraftHeaderUI bg-base-300 flex border-b border-b-base-300 sticky top-0 z-50'
        >
            <div tw='flex gap-1 mt-1 flex-grow relative text-base-content'>
                <DraftIllustrationUI revealAppIllustrationOnHover draft={draft} size='7.3rem' />
                <div tw='flex flex-col gap-1 flex-grow'>
                    <div tw='flex text-sm gap-1'>
                        App <span tw='text-primary font-bold'>{app.name}</span>
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
                        <div onClick={draft.expandTopLevelFormEntries} tw='btn btn-square btn-sm join-item'>
                            <span className='material-symbols-outlined'>unfold_more</span>
                        </div>
                        {/* --------------------------------- */}
                        <div onClick={draft.collapseTopLevelFormEntries} tw='btn btn-square btn-sm join-item'>
                            <span className='material-symbols-outlined'>unfold_less</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})
