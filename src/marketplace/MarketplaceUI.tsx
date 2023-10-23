import { observer } from 'mobx-react-lite'
import { Button, IconButton, Panel } from 'rsuite'
import { useSt } from 'src/front/FrontStateCtx'
import { GithubUserUI } from 'src/front/GithubAvatarUI'
import { UpdateBtnUI } from 'src/front/ui/layout/UpdateBtnUI'
import { ActionPack } from './ActionPack'
import { GithubRepo, GithubUser } from 'src/front/githubUtils'

export const MarketplaceUI = observer(function MarketplaceUI_(p: {}) {
    const st = useSt()
    return (
        <div>
            <div tw='p-2'>
                <Button appearance='ghost' color='green' tw='w-full'>
                    Create action
                </Button>
            </div>
            {st.marketplace.plugins.map((actionPack) => (
                <ActionPackUI key={actionPack.data.github} actionPack={actionPack} />
            ))}
        </div>
    )
})

export const ActionPackUI = observer(function ActionPackUI_(p: { actionPack: ActionPack }) {
    const st = useSt()
    const ap = p.actionPack
    const ghuser = GithubUser.get(st, ap.authorName)
    const repo = GithubRepo.get(st, ghuser, ap.repositoryName)

    return (
        <div tw='hover:bg-gray-700 p-2' key={ap.data.name} style={{ borderBottom: '1px solid #515151' }}>
            <div tw='flex  gap-2'>
                <div tw='flex-grow'>
                    <div tw='text-lg font-bold'>{ap.data.name}</div>
                    <GithubUserUI size='1.5rem' username={ap.authorName} showName />
                    <div tw='text-gray-400'>{ap.data.description}</div>
                </div>
                {ap.data.BUILT_IN ? null : (
                    <div>
                        <div tw='flex items-cetner'>
                            <Button
                                size='xs'
                                color='yellow'
                                onClick={() => window.require('electron').shell.openExternal(ap.githubURL)}
                                appearance='link'
                                endIcon={<span className='material-symbols-outlined'>star_rate</span>}
                            >
                                {ap.stars} Star
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            {ap.data.BUILT_IN ? (
                <div tw='text-gray-500'>built-in</div>
            ) : (
                <div>
                    {ap.isInstalled ? (
                        <div tw='flex justify-between'>
                            <UpdateBtnUI updater={ap.updater} />
                            <Button
                                size='sm'
                                appearance='link'
                                tw='text-gray-500'
                                // startIcon={<span className='material-symbols-outlined'>toggle_off</span>}
                            >
                                Disable
                            </Button>
                        </div>
                    ) : (
                        <Button
                            loading={ap.installK.isRunning}
                            appearance='primary'
                            onClick={() => ap.install()}
                            size='xs'
                            startIcon={<span className='text-gray-700 material-symbols-outlined'>cloud_download</span>}
                        >
                            Install
                        </Button>
                    )}
                </div>
            )}
            {ap.installK.logs.length > 0 && (
                <div>
                    <pre>{JSON.stringify(ap.installK.logs)}</pre>
                </div>
            )}
        </div>
    )
})
