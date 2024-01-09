import { observer } from 'mobx-react-lite'
import { DraftIllustrationUI } from 'src/cards/fancycard/DraftIllustration'
import { DraftL } from 'src/models/Draft'
import { DraftMenuUI } from './DraftMenuUI'
import { RunOrAutorunUI } from './RunOrAutorunUI'
import { PublishAppBtnUI } from './PublishAppBtnUI'

export const DraftHeaderUI = observer(function DraftHeaderUI_(p: {
    //
    draft: DraftL
    className?: string
}) {
    const { draft } = p
    const st = draft.st
    const app = draft.appRef.item
    return (
        <div
            style={{ zIndex: 99 /*boxShadow: '0 0 0.5rem oklch(var(--p)/.3)'*/ }}
            className={p.className}
            tw='_DraftHeaderUI flex bg-base-300 border-b border-b-base-300 sticky top-0 z-50'
        >
            <div tw='flex gap-0.5 flex-grow relative text-base-content'>
                <DraftIllustrationUI draft={draft} size='4rem' />
                <div tw='ml-1 flex-grow'>
                    <div style={{ height: '2rem' }} className='flex items-center gap-2 justify-between text-sm'>
                        <input
                            tw='input input-bordered input-sm flex-grow'
                            onChange={(ev) => draft.update({ title: ev.target.value })}
                            // tw='w-full'
                            value={draft.data.title ?? 'no title'}
                        ></input>
                        <RunOrAutorunUI tw='flex-shrink-0' draft={draft} />
                    </div>
                    <div tw='flex items-center'>
                        <DraftMenuUI tw='w-full' draft={draft} title={app.name} />

                        {/* --------------------------------- */}
                        <PublishAppBtnUI app={app} />

                        {/* --------------------------------- */}
                        <div
                            tw='btn btn-square btn-sm join-item'
                            // active={app.isFavorite}
                            onClick={draft.collapseTopLevelFormEntries}
                        >
                            <span className='material-symbols-outlined'>unfold_less</span>
                            {/* Collapse top level entries */}
                        </div>
                        {/* --------------------------------- */}
                        <div
                            tw='btn btn-square btn-sm join-item'
                            // active={app.isFavorite}
                            onClick={draft.expandTopLevelFormEntries}
                        >
                            <span className='material-symbols-outlined'>unfold_more</span>
                            {/* Expand top level entries */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})
