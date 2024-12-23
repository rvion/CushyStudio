import type { CushyAppL } from '../../models/CushyApp'

import { observer } from 'mobx-react-lite'

import { ErrorPanelUI } from './ErrorPanelUI'
import { RecompileUI } from './RecompileUI'

export const AppCompilationErrorUI = observer(function AppCompilationErrorUI_(p: { app: CushyAppL }) {
   return (
      <ErrorPanelUI>
         <h3>invalid app</h3>
         <RecompileUI always app={p.app} />
         <pre tw='bg-black text-xs text-white'>{p.app.script.data.code}</pre>
      </ErrorPanelUI>
   )
})
