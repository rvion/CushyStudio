import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'

import { AppCardUI } from '../../cards/fancycard/AppCardUI'

export const StandaloneAppBtnUI = observer(function StandaloneAppBtnUI_(p: { path: RelativePath }) {
   const path = p.path
   const file = cushy.library.getFile(path)

   // ensure this app is up-to-date
   useEffect(() => void file.extractScriptFromFileAndUpdateApps(), [])

   // show script evaluation progress
   const script0 = file.script
   if (script0 == null)
      return (
         <div>
            extracting script...
            <div className='loading'></div>
         </div>
      )

   // show app evaluation progress
   const app = script0.apps?.[0]
   if (app == null) {
      return (
         <div>
            compiling app... <div className='loading'></div>
         </div>
      )
   }
   return (
      // <div key={path}>
      <AppCardUI //
         // active={st.library.selectionCursor === ix}
         // deck={card.pkg}
         app={app}
      />
      // </div>
   )
})
