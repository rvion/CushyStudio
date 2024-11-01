import { useApplication } from '@pixi/react'
import { memo, type ReactNode } from 'react'

import { PixiApplicationContext2 } from './PixiApplicationContext2'

let prev: any = null

export const PixiApplicationProvider = memo(function PixiApplicationProvider_(p: {
   children: React.ReactNode
}): ReactNode {
   const appli = useApplication()
   // console.log(
   //     `[✅] PixiApplicationProvider (${appli.isInitialising && 'initializing...'}, ${appli.isInitialised && 'isInitialized'})`,
   // )

   if (appli.isInitialising) return null
   if (!appli.isInitialised) return null
   // if (prev === appli.app) console.log(`[✅] ...SAME`)
   else {
      prev = appli.app
      // console.log(`[✅] ...DIFFERENT`)
   }
   // hopefull6y, this will properly debounce the excessive renders caused by useApplication...
   return (
      <PixiApplicationContext2.Provider //
         value={appli.app}
      >
         {p.children}
      </PixiApplicationContext2.Provider>
   )
})
