import { observer } from 'mobx-react-lite'
import { Button, Loader, Message, Popover, Whisper } from 'rsuite'
import { Updater } from 'src/front/updater'
import { _formatPreviewDate } from 'src/utils/_formatPreviewDate'

export const UpdateBtnUI = observer(function UpdateBtnUI_(p: { updater: Updater }) {
    const updater = p.updater
    const hasErrors = updater.hasErrors
    return (
        <Whisper
            placement='auto'
            enterable
            speaker={
                <Popover>
                    <UpdaterErrorUI updater={updater} />
                    <div tw='flex items-center'>
                        <span className='material-symbols-outlined'>folder</span>
                        <pre>{updater.relativePathFromRoot || 'root'}</pre>
                    </div>
                    <div>
                        {updater.infos.fetchedAt ? (
                            <div tw='flex items-center'>
                                update checked at :{_formatPreviewDate(new Date(updater.infos.fetchedAt))}
                            </div>
                        ) : (
                            <>no update done</>
                        )}
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
                </Popover>
            }
        >
            <div tw={['flex gap-1 cursor-help items-center']}>
                {/* // hasErrors ? 'bg-red-900' : 'bg-green-900 ', */}
                <div tw='bg-green-900 flex gap-1 px-1'>
                    {hasErrors ? (
                        <>
                            <span className='text-orange-500 material-symbols-outlined'>error</span>
                            version
                        </>
                    ) : (
                        <span className='text-green-400 material-symbols-outlined'>check_circle</span>
                    )}

                    <div className={updater.updateAvailable ? 'text-orange-400' : 'text-green-100 '}>
                        {updater.infos.headCommitsCount ? `V${updater.currentVersion}` : <Loader />}
                    </div>
                </div>
                {updater.updateAvailable && (
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
                        UPDATE to version {updater.nextVersion}
                    </Button>
                )}
            </div>
        </Whisper>
    )
})

export const UpdaterErrorUI = observer(function UpdaterErrorUI_(p: { updater: Updater }) {
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
