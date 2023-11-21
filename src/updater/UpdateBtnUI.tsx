import { observer } from 'mobx-react-lite'
import { GitManagedFolder } from 'src/updater/updater'
import { FolderGitStatus } from 'src/cards/FolderGitStatus'
import { Button, Loader } from 'src/rsuite/shims'
import { ReleaseChannelUI } from '../app/layout/ReleaseChannelUI'
import { RevealUI } from 'src/rsuite/RevealUI'
import { GitInitBtnUI } from './GitInitBtnUI'
import { GitInstallUI } from './GitInstallUI'
import { _getRelativeTimeString } from './_getRelativeTimeString'
import { UninstallUI } from './GitUninstallUI'
import { UpdaterErrorUI } from './UpdaterErrorUI'

export const UpdateBtnUI = observer(function UpdateBtnUI_(p: { updater: GitManagedFolder }) {
    const updater = p.updater
    return (
        <RevealUI>
            <UpdaterAnchorUI updater={updater} />
            <UpdaterDetailsUI updater={updater} />
        </RevealUI>
    )
})

export const UpdaterAnchorUI = observer(function UpdaterAnchorUI_(p: { updater: GitManagedFolder }) {
    const updater = p.updater
    const hasErrors = updater.hasErrors
    const status = updater.status
    if (status === FolderGitStatus.Unknown) return <Loader />
    if (status === FolderGitStatus.DoesNotExist) return <GitInstallUI udpater={updater} />
    if (status === FolderGitStatus.NotADirectory) return <div>❓ unexpected file</div>
    if (status === FolderGitStatus.FolderWithoutGit) return <GitInitBtnUI updater={updater} />
    if (status === FolderGitStatus.FolderWithGitButWithProblems) return <div>❓</div>
    if (status === FolderGitStatus.FolderWithGit)
        return (
            <div tw={['flex gap-1 cursor-help']}>
                <div tw='flex gap-1'>
                    {
                        hasErrors ? (
                            <>
                                <span className='text-error-content material-symbols-outlined'>error</span>
                                version
                            </>
                        ) : updater.hasUpdateAvailable ? (
                            <Button
                                className='animate-pulse'
                                color='red'
                                size='sm'
                                appearance='primary'
                                icon={<span className='material-symbols-outlined'>update</span>}
                                onClick={async (ev) => {
                                    ev.stopPropagation()
                                    ev.preventDefault()
                                    await updater.updateToLastCommitAvailable()
                                    window.location.reload()
                                }}
                            >
                                update
                                {/* to version {updater.nextVersion} */}
                            </Button>
                        ) : null
                        // <span className='text-green-400 material-symbols-outlined'>check_circle</span>
                    }

                    <Button tw={[updater.hasUpdateAvailable ? 'btn-warning' : 'btn-ghost', 'btn-sm']}>
                        {updater.currentVersion}
                        {/* {updater.mainBranchName} */}
                        {/* {updater.headCommitsCount ? `v${updater.currentVersion}` : <Loader />} */}
                    </Button>
                </div>
            </div>
        )
    exhaust(status)
})

export const UpdaterDetailsUI = observer(function UpdaterDetailsUI_(p: { updater: GitManagedFolder }) {
    const updater = p.updater
    return (
        <div tw='menu flex flex-col gap-2'>
            <div className='virtualBorder'>status: {p.updater.status}</div>
            <div className='virtualBorder'>currentAction: {p.updater.currentAction}</div>
            {updater.config.betaBranch ? <ReleaseChannelUI onChange={(e) => console.log(e)} /> : null}
            <UpdaterErrorUI updater={updater} />
            <div tw='virtualBorder flex items-center'>
                <span className='material-symbols-outlined'>folder</span> <div>{updater.relPath || 'root'}</div>
            </div>
            <div tw='virtualBorder'>
                {updater.lastFetchAt ? (
                    <div>
                        <div>
                            <span className='material-symbols-outlined'>history</span> prev update :{' '}
                            {_getRelativeTimeString(updater.lastFetchAt)}
                        </div>
                        <div>
                            <span className='material-symbols-outlined'>schedule</span> next update :{' '}
                            {_getRelativeTimeString(updater.nextFetchAt)}
                        </div>
                    </div>
                ) : (
                    <>no update done</>
                )}
            </div>
            <div tw='flex gap-2'>
                <Button
                    tw='btn-info'
                    size='sm'
                    onClick={() => updater.checkForUpdatesNow()}
                    icon={<span className='material-symbols-outlined'>refresh</span>}
                >
                    REFRESH
                </Button>
                {updater.config.canBeUninstalled ? ( //
                    <UninstallUI updater={updater} />
                ) : null}
            </div>
            <table tw='table table-zebra-zebra table-xs'>
                <tbody>
                    {updater.lastLogs.logs.map((log, i) => (
                        <tr key={i}>
                            <td>{_getRelativeTimeString(log.date)}</td>
                            <td>{log.msg}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
})
