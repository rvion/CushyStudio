import { observer } from 'mobx-react-lite'
import { Button, Loader } from 'rsuite'
import { useSt } from 'src/front/FrontStateCtx'

export const UpdateBtnUI = observer(function UpdateBtnUI_(p: {}) {
    const st = useSt()
    return (
        <>
            {st.updater.updateAvailable ? (
                <Button
                    className='animate-pulse'
                    color='orange'
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
            <div className={st.updater.updateAvailable ? 'text-orange-400' : 'text-green-400'}>
                v{st.updater.commitCountOnHead ? st.updater.currentVersion : <Loader />}
            </div>
        </>
    )
})
