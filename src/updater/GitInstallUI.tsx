import type { GitManagedFolder } from './updater'

import { Button } from '../csuite/button/Button'

export type GitInstallUIProps = {
   updater: GitManagedFolder
}

export const GitInstallUI: React.FC<GitInstallUIProps> = obs(function GitInstallUI_({ updater }) {
   return (
      <Button
         loading={updater.currentAction != null}
         look='primary'
         size='xs'
         icon={IKONS.mdiCloudDownload}
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
