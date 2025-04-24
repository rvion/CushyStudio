import { Button } from '../../csuite/button/Button'

export const IndexAllAppsBtnUI = obs(function IndexAllAppsBtnUI_(p: {}) {
   return (
      <Button //
         icon={IKONS.mdiMagnifyScan}
         look='primary'
         hue={200}
         onClick={cushy.startupFileIndexing}
      >
         Index Apps
      </Button>
   )
})

export const ForceUpdateAllAppsBtnUI = obs(function IndexAllAppsBtnUI_(p: {}) {
   return <Button onClick={cushy.forceRefreshAllApps}>Force-Recompile All Apps</Button>
})
