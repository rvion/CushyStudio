import { observer } from 'mobx-react-lite'
import { Button, IconButton, Panel } from 'rsuite'
import { useSt } from 'src/front/FrontStateCtx'
import { GithubUserUI } from 'src/front/GithubAvatarUI'
import { UpdateBtnUI } from 'src/front/ui/layout/UpdateBtnUI'

export const MarketplaceUI = observer(function MarketplaceUI_(p: {}) {
    const st = useSt()
    return (
        <div>
            {st.marketplace.plugins.map((p) => (
                <Panel bordered tw='hover:brightness-90' key={p.data.name}>
                    <div tw='flex  gap-2'>
                        <GithubUserUI size='3rem' username={p.authorName} />
                        <div tw='flex-grow'>
                            <div tw='font-bold'>{p.data.name}</div>
                            <div tw='text-gray-400'>{p.data.description}</div>
                        </div>
                        <div>
                            <div tw='flex gap-2'>
                                <div tw='flex items-cetner'>
                                    {p.stars}
                                    <span className='material-symbols-outlined'>star_rate</span>
                                    <IconButton
                                        size='xs'
                                        as='a'
                                        target='_blank'
                                        href={p.githubURL}
                                        appearance='link'
                                        startIcon={<span className='material-symbols-outlined'>open_in_new</span>}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        {p.isInstalled ? (
                            <div tw='flex'>
                                <UpdateBtnUI updater={p.updater} />
                                <Button
                                    size='sm'
                                    appearance='link'
                                    startIcon={<span className='material-symbols-outlined'>toggle_off</span>}
                                >
                                    Disable
                                </Button>
                            </div>
                        ) : (
                            <Button
                                loading={p.installK.isRunning}
                                appearance='primary'
                                onClick={() => p.install()}
                                size='xs'
                                startIcon={<span className='text-gray-700 material-symbols-outlined'>cloud_download</span>}
                            >
                                Install
                            </Button>
                        )}
                    </div>
                    {p.installK.logs.length > 0 && (
                        <div>
                            <pre>{JSON.stringify(p.installK.logs)}</pre>
                        </div>
                    )}
                </Panel>
            ))}
        </div>
    )
})
