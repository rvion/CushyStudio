import { observer } from 'mobx-react-lite'
import { Button, Loader, Message, Popover, Whisper } from 'rsuite'
import { useSt } from 'src/front/FrontStateCtx'

export const UpdateBtnUI = observer(function UpdateBtnUI_(p: {}) {
    const st = useSt()
    const hasErrors = st.updater.hasErrors
    return (
        <Whisper
            placement='bottom'
            enterable
            speaker={
                <Popover>
                    <UpdaterErrorUI />
                </Popover>
            }
        >
            <div tw={['flex gap-1 px-1 rounded cursor-help items-center', hasErrors ? 'bg-red-900' : 'bg-green-900 ']}>
                {hasErrors ? (
                    <>
                        <span className='text-orange-500 material-symbols-outlined'>error</span>
                        version
                    </>
                ) : st.updater.updateAvailable ? (
                    <Button
                        className='animate-pulse'
                        color='orange'
                        size='xs'
                        appearance='primary'
                        startIcon={<span className='material-symbols-outlined'>update</span>}
                        onClick={async () => {
                            await st.updater.updateToLastCommitAvailable()
                            window.location.reload()
                        }}
                    >
                        UPDATE to version {st.updater.nextVersion}
                    </Button>
                ) : (
                    <span className='text-green-400 material-symbols-outlined'>check_circle</span>
                )}
                <div className={st.updater.updateAvailable ? 'text-orange-400' : 'text-green-100'}>
                    {st.updater.commitCountOnHead ? `V${st.updater.currentVersion}` : <Loader />}
                </div>
            </div>
        </Whisper>
    )
})

export const UpdaterErrorUI = observer(function UpdaterErrorUI_(p: {}) {
    const st = useSt()
    const updater = st.updater
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
