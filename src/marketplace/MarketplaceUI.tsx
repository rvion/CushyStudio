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
                <div tw='hover:bg-gray-700 p-2' key={p.data.name} style={{ borderBottom: '1px solid #515151' }}>
                    <div tw='flex  gap-2'>
                        <GithubUserUI size='3rem' username={p.authorName} />
                        <div tw='flex-grow'>
                            <div tw='font-bold'>{p.data.name}</div>
                            <div tw='text-gray-400'>{p.data.description}</div>
                        </div>
                        {p.data.BUILT_IN ? null : (
                            <div>
                                <div tw='flex items-cetner'>
                                    <Button
                                        size='xs'
                                        color='yellow'
                                        // target='_blank'
                                        onClick={() => {
                                            window.require('electron').shell.openExternal(p.githubURL)
                                        }}
                                        // href={p.githubURL}
                                        appearance='link'
                                        endIcon={<span className='material-symbols-outlined'>star_rate</span>}
                                    >
                                        {p.stars} Star
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                    {p.data.BUILT_IN ? (
                        <div tw='text-gray-500'>built-in</div>
                    ) : (
                        <div>
                            {p.isInstalled ? (
                                <div tw='flex justify-between'>
                                    <UpdateBtnUI updater={p.updater} />
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
                    )}
                    {p.installK.logs.length > 0 && (
                        <div>
                            <pre>{JSON.stringify(p.installK.logs)}</pre>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
})
