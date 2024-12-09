import { observer } from 'mobx-react-lite'

import { Button } from '../../csuite/button/Button'

export const IndexAllAppsBtnUI = observer(function IndexAllAppsBtnUI_(p: {}) {
   return (
      <Button //
         icon='mdiMagnifyScan'
         look='primary'
         hue={200}
         onClick={cushy.startupFileIndexing}
      >
         Index Apps
      </Button>
   )
})

export const ForceUpdateAllAppsBtnUI = observer(function IndexAllAppsBtnUI_(p: {}) {
   return <Button onClick={cushy.forceRefreshAllApps}>Force-Recompile All Apps</Button>
})
