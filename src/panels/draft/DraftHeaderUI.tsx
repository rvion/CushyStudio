import { observer } from 'mobx-react-lite'
import { DraftIllustrationUI } from 'src/cards/fancycard/DraftIllustration'
import { DraftL } from 'src/models/Draft'
import { DraftMenuUI } from './DraftMenuUI'
import { RunOrAutorunUI } from './RunOrAutorunUI'
import { CushyAppL } from 'src/models/CushyApp'

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

export const PublishAppBtnUI = observer(function PublishAppBtnUI_(p: { app: CushyAppL }) {
    const app = p.app
    const st = app.st
    return (
        <div
            tw='btn btn-accent btn-xs'
            onClick={async () => {
                // ensure is connected
                if (!st.auth.isConnected) {
                    const confirm = window.confirm('You need to log in to publish apps. Do you want to log in now?')
                    if (!confirm) return
                    await st.auth.startLoginFlowWithGithub()
                    return
                }

                // double intent verification
                const confirm = window.confirm('Are you sure you want to publish this app?')
                if (!confirm) return

                // publish
                await app.publish()
            }}
        >
            {app.isPublishing ? <div tw='loading' /> : <span className='material-symbols-outlined'>publish</span>}
            Publish
        </div>
    )
})
