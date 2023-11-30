import { observer } from 'mobx-react-lite'
import { GitManagedFolder } from 'src/updater/updater'
import { FolderGitStatus } from 'src/cards/FolderGitStatus'
import { Button, Joined, Loader, Message } from 'src/rsuite/shims'
import { ReleaseChannelUI } from '../app/layout/ReleaseChannelUI'
import { RevealUI } from 'src/rsuite/RevealUI'
import { GitInitBtnUI } from './GitInitBtnUI'
import { GitInstallUI } from './GitInstallUI'
import { _formatAsRelativeDateTime } from './_getRelativeTimeString'
import { UninstallUI } from './GitUninstallUI'
import { UpdaterErrorUI } from './UpdaterErrorUI'
import { ReactNode } from 'react'
import { exhaust } from 'src/utils/misc/ComfyUtils'

export const UpdateBtnUI = observer(function UpdateBtnUI_(p: {
    //
    className?: string
    updater: GitManagedFolder
    children?: ReactNode
}) {
    const updater = p.updater
    let ANCHOR = (
        <div
            //
            className={p.className}
            tw={['btn-narrow btn btn-sm btn-ghost italic', updater.hasUpdateAvailable && 'btn-warning']}
        >
            {p.children}
            <div tw='text-xs italic opacity-50'>
                <UpdaterAnchorUI updater={updater} />
            </div>
        </div>
    )
    if (updater.hasUpdateAvailable)
        ANCHOR = (
            <div className={p.className}>
                <span className='indicator-item badge badge-secondary'>update</span>
                {ANCHOR}
            </div>
        )

    return (
        <RevealUI disableHover>
            {ANCHOR}
            <UpdaterDetailsUI updater={updater} />
        </RevealUI>
    )
})

export const UpdaterAnchorUI = observer(function UpdaterAnchorUI_(p: { updater: GitManagedFolder }) {
    const updater = p.updater
    const status = updater.status
    if (status === FolderGitStatus.Unknown) return <Loader />
    if (status === FolderGitStatus.DoesNotExist) return <GitInstallUI udpater={updater} />
    if (status === FolderGitStatus.NotADirectory) return <div>❓ unexpected file</div>
    if (status === FolderGitStatus.FolderWithoutGit) return <GitInitBtnUI updater={updater} />
    if (status === FolderGitStatus.FolderWithGitButWithProblems) return <div>❓</div>
    if (status === FolderGitStatus.FolderWithGit) return updater.currentVersion
    exhaust(status)
})

export const UpdaterDetailsUI = observer(function UpdaterDetailsUI_(p: { updater: GitManagedFolder }) {
    const updater = p.updater
    const hasErrors = updater.hasErrors

    return (
        <div tw='menu flex flex-col gap-2'>
            {hasErrors && <Message type='error'>error</Message>}
            <div>
                {updater.hasUpdateAvailable ? (
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
                ) : null}
            </div>
            <UpdaterErrorUI updater={updater} />

            <div tw='virtualBorder'>
                {updater.lastFetchAt ? (
                    <div>
                        <div>
                            <span className='material-symbols-outlined'>history</span> prev update :{' '}
                            {_formatAsRelativeDateTime(updater.lastFetchAt)}
                        </div>
                        <div>
                            <span className='material-symbols-outlined'>schedule</span> next update :{' '}
                            {_formatAsRelativeDateTime(updater.nextFetchAt)}
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
                            <td>{_formatAsRelativeDateTime(log.date)}</td>
                            <td tw='max-w-sm'>{log.msg}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div tw='virtualBorder flex flex-wrap items-center'>
                <span className='material-symbols-outlined'>folder</span> <div>{updater.relPath || 'root'}</div>
            </div>
            <Joined tw='flex gap-2'>
                <div className='virtualBorder'>#{p.updater.status}</div>
                <div className='virtualBorder'>action: {p.updater.currentAction ?? 'ø'}</div>
            </Joined>
        </div>
    )
})
