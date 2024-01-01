import { observer } from 'mobx-react-lite'
import { GitManagedFolder } from 'src/updater/updater'
import { Button } from 'src/rsuite/shims'

export const GitInstallUI = observer(function GitInstallUI_(p: { updater: GitManagedFolder }) {
    const updater = p.updater
    return (
        <Button
            loading={updater.currentAction != null}
            appearance='primary'
            size='xs'
            icon={<span className='text-gray-700 material-symbols-outlined'>cloud_download</span>}
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
