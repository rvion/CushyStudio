import type { GitManagedFolder } from './updater'

import { observer } from 'mobx-react-lite'

import { Button } from '../csuite/button/Button'

export const GitInstallUI = observer(function GitInstallUI_(p: { updater: GitManagedFolder }) {
    const updater = p.updater
    return (
        <Button
            loading={updater.currentAction != null}
            look='primary'
            size='xs'
            icon='mdiCloudDownload'
            onClick={(ev) => {
                ev.stopPropagation()
                ev.preventDefault()
                return updater.install()
            }}
        >
            Install
        </Button>
    )
})
