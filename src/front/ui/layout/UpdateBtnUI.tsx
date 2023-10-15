import { observer } from 'mobx-react-lite'
import { Button, Loader } from 'rsuite'
import { useSt } from 'src/front/FrontStateCtx'

export const UpdateBtnUI = observer(function UpdateBtnUI_(p: {}) {
    const st = useSt()
    return (
        <div className='flex gap-1 bg-green-900 px-1 rounded cursor-help'>
            {st.updater.updateAvailable ? (
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
                v{st.updater.commitCountOnHead ? st.updater.currentVersion : <Loader />}
            </div>
        </div>
    )
})
