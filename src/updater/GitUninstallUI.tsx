import { observer } from 'mobx-react-lite'

import { Button } from '../csuite/button/Button'
import { GitManagedFolder } from './updater'

export const UninstallUI = observer(function UninstallUI_(p: { updater: GitManagedFolder }) {
    const updater = p.updater
    return (
        <button
            tw='btn btn-sm btn-error'
            onClick={(ev) => {
                ev.stopPropagation()
                ev.preventDefault()
                updater.uninstall()
                // toaster.push(<Notification>Not implemented yet</Notification>, { placement: 'topEnd' })
            }}
        >
            <span className='material-symbols-outlined'>highlight_off</span> REMOVE
        </button>
    )
})
