import { observer } from 'mobx-react-lite'
import { Button, Loader, Message, Popover, Whisper } from 'rsuite'
import { FolderKind, GitManagedFolder } from 'src/front/updater'
import { _formatPreviewDate } from 'src/utils/_formatPreviewDate'

export const GitInitBtnUI = observer(function GitInitBtnUI_(p: {}) {
    return (
        <Button
            disabled
            // onClick={() => {

            // }}
            size='xs'
            appearance='primary'
        >
            git init
        </Button>
    )
})

export const GitInstallUI = observer(function GitInstallUI_(p: { udpater: GitManagedFolder }) {
    const updater = p.udpater
    return (
        <Button
            loading={updater.currentAction != null}
            appearance='primary'
            size='xs'
            startIcon={<span className='text-gray-700 material-symbols-outlined'>cloud_download</span>}
            onClick={(ev) => {
                ev.stopPropagation()
                ev.preventDefault()
                updater.install()
            }}
        >
            Install
        </Button>
    )
})

export const UpdateBtnUI = observer(function UpdateBtnUI_(p: { updater: GitManagedFolder }) {
    const updater = p.updater
    const hasErrors = updater.hasErrors
    if (updater.status === FolderKind.Unknown) return <Loader />
    if (updater.status === FolderKind.DoesNotExist) return <GitInstallUI udpater={updater} />
    if (updater.status === FolderKind.NotADirectory) return <div>❓ unespected file</div>
    if (updater.status === FolderKind.FolderWithoutGit) return <GitInitBtnUI />
    return (
        <Whisper
            placement='auto'
            enterable
            speaker={
                <Popover>
                    <div>
                        <UpdaterErrorUI updater={updater} />
                        <div tw='flex items-center'>
                            <span className='material-symbols-outlined'>folder</span>
                            <pre>{updater.relPath || 'root'}</pre>
                        </div>
                        <div>
                            {updater.lastFetchAt ? (
                                <div tw='flex items-center'>
                                    prev update : {getRelativeTimeString(updater.lastFetchAt)}
                                    next update : {getRelativeTimeString(updater.nextFetchAt)}
                                </div>
                            ) : (
                                <>no update done</>
                            )}
                        </div>
                        <div>
                            <Button
                                size='sm'
                                color='orange'
                                appearance='ghost'
                                onClick={() => updater.checkForUpdates()}
                                startIcon={<span className='material-symbols-outlined'>refresh</span>}
                            >
                                FORCE REFRESH
                            </Button>
                        </div>
                        <div>
                            {updater.p.canBeUninstalled ? ( //
                                <UninstallUI updater={updater} />
                            ) : null}
                        </div>
                    </div>
                </Popover>
            }
        >
            <div tw={['flex gap-1 cursor-help']}>
                {/* // hasErrors ? 'bg-red-900' : 'bg-green-900 ', */}
                <div tw='flex gap-1'>
                    {hasErrors ? (
                        <>
                            <span className='text-orange-500 material-symbols-outlined'>error</span>
                            version
                        </>
                    ) : updater.updateAvailable ? (
                        <Button
                            className='animate-pulse'
                            color='red'
                            size='xs'
                            appearance='primary'
                            startIcon={<span className='material-symbols-outlined'>update</span>}
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
                    ) : (
                        <span className='text-green-400 material-symbols-outlined'>check_circle</span>
                    )}

                    <div className={updater.updateAvailable ? 'text-orange-400' : 'text-green-100 '}>
                        {updater.headCommitsCount ? `v${updater.currentVersion}` : <Loader />}
                    </div>
                </div>
            </div>
        </Whisper>
    )
})

export const UpdaterErrorUI = observer(function UpdaterErrorUI_(p: { updater: GitManagedFolder }) {
    const updater = p.updater
    const errs = updater.commandErrors
    if (errs.size === 0) return null
    const errsArr = [...errs.entries()]
    return (
        <div>
            {errsArr.map(([cmd, err]) => (
                <div tw='w-96 overflow-auto' key={cmd}>
                    <Message type='error' showIcon>
                        <div>
                            command
                            <pre tw='whitespace-pre-wrap'>{cmd}</pre>
                        </div>
                        <div>
                            error
                            <pre tw='whitespace-pre-wrap'>{JSON.stringify(err)}</pre>
                        </div>
                    </Message>
                </div>
            ))}
        </div>
    )
})

export const UninstallUI = observer(function UninstallUI_(p: { updater: GitManagedFolder }) {
    const updater = p.updater
    return (
        <Button
            color='red'
            size='sm'
            appearance='ghost'
            startIcon={<span className='material-symbols-outlined'>highlight_off</span>}
            onClick={(ev) => {
                ev.stopPropagation()
                ev.preventDefault()
                updater.uninstall()
                // toaster.push(<Notification>Not implemented yet</Notification>, { placement: 'topEnd' })
            }}
        >
            REMOVE
        </Button>
    )
})

/**
 * from: https://www.builder.io/blog/relative-time
 * Convert a date to a relative time string, such as
 * "a minute ago", "in 2 hours", "yesterday", "3 months ago", etc.
 * using Intl.RelativeTimeFormat
 */
export function getRelativeTimeString(date: Date | number, lang = navigator.language): string {
    // Allow dates or times to be passed
    const timeMs = typeof date === 'number' ? date : date.getTime()

    // Get the amount of seconds between the given date and now
    const deltaSeconds = Math.round((timeMs - Date.now()) / 1000)

    // Array reprsenting one minute, hour, day, week, month, etc in seconds
    const cutoffs = [60, 3600, 86400, 86400 * 7, 86400 * 30, 86400 * 365, Infinity]

    // Array equivalent to the above but in the string representation of the units
    const units: Intl.RelativeTimeFormatUnit[] = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year']

    // Grab the ideal cutoff unit
    const unitIndex = cutoffs.findIndex((cutoff) => cutoff > Math.abs(deltaSeconds))

    // Get the divisor to divide from the seconds. E.g. if our unit is "day" our divisor
    // is one day in seconds, so we can divide our seconds by this to get the # of days
    const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1

    // Intl.RelativeTimeFormat do its magic
    const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' })
    return rtf.format(Math.floor(deltaSeconds / divisor), units[unitIndex])
}
