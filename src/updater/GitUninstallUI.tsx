import type { GitManagedFolder } from './updater'

import { Button } from '../csuite/button/Button'

export const UninstallUI = obs(function UninstallUI_(p: { updater: GitManagedFolder }) {
   const updater = p.updater
   return (
      <Button
         size='sm'
         look='error'
         onClick={(ev) => {
            ev.stopPropagation()
            ev.preventDefault()
            updater.uninstall()
            // toaster.push(<Notification>Not implemented yet</Notification>, { placement: 'topEnd' })
         }}
      >
         <span className='material-symbols-outlined'>highlight_off</span> REMOVE
      </Button>
   )
})
