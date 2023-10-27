import { observer } from 'mobx-react-lite'
import { ErrorBoundary } from 'react-error-boundary'
import { Button } from 'rsuite'
import { useSt } from 'src/front/FrontStateCtx'
import { GithubUserUI } from 'src/marketplace/GithubAvatarUI'
import { GithubRepo, GithubUser } from 'src/marketplace/githubUtils'
import { ErrorBoundaryFallback } from 'src/front/ui/utils/ErrorBoundary'
import { ActionPack } from './ActionPack'
import { ActionPackStatusUI } from './ActionPackStatusUI'

export const MarketplaceUI = observer(function MarketplaceUI_(p: {}) {
    const st = useSt()
    return (
        <div>
            <div tw='p-2'>
                <Button onClick={() => {}} appearance='ghost' color='green' tw='w-full self-start'>
                    Create action
                </Button>
            </div>
            {st.toolbox.packs.map((actionPack) => (
                <ErrorBoundary key={actionPack.github} FallbackComponent={ErrorBoundaryFallback}>
                    <ActionPackUI key={actionPack.github} actionPack={actionPack} />
                </ErrorBoundary>
            ))}
        </div>
    )
})

export const ActionPackUI = observer(function ActionPackUI_(p: { actionPack: ActionPack }) {
    const st = useSt()
    const ap = p.actionPack
    const ghuser = ap.githubUser
    const repo = ap.githubRepository

    return (
        <div tw='cursor-pointer hover:bg-gray-700 p-2' key={ap.name} style={{ borderBottom: '1px solid #515151' }}>
            <div tw='flex  gap-2'>
                <div tw='flex-grow'>
                    <div tw='text-lg font-bold'>{ap.name}</div>
                    <GithubUserUI size='1.5rem' username={ap.githubUserName} showName />
                    <div tw='text-gray-400'>{ap.description}</div>
                </div>
                {ap.BUILT_IN ? null : (
                    <div>
                        <div tw='flex items-cetner'>
                            <Button
                                size='sm'
                                color='yellow'
                                onClick={(ev) => {
                                    ev.preventDefault()
                                    ev.stopPropagation()
                                    window.require('electron').shell.openExternal(ap.githubURL)
                                }}
                                appearance='link'
                            >
                                {repo.data?.json?.stargazers_count ?? '?'}
                                <span className='material-symbols-outlined'>star_rate</span>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            <ActionPackStatusUI pack={ap} />
            {ap.installK.logs.length > 0 && (
                <div>
                    <pre>{JSON.stringify(ap.installK.logs)}</pre>
                </div>
            )}
        </div>
    )
})
