import type { GitManagedFolder } from './updater'

import { observer } from 'mobx-react-lite'

import { LegacyMessageUI } from '../csuite/inputs/LegacyMessageUI'

export const UpdaterErrorUI = observer(function UpdaterErrorUI_(p: { updater: GitManagedFolder }) {
   const updater = p.updater
   const errs = updater.commandErrors
   if (errs.size === 0) return null
   const errsArr = [...errs.entries()]
   return (
      <div>
         {errsArr.map(([cmd, err]) => (
            <div tw='w-96 overflow-auto' key={cmd}>
               <LegacyMessageUI type='error' showIcon>
                  <div>
                     command
                     <pre tw='whitespace-pre-wrap'>{cmd}</pre>
                  </div>
                  <div>
                     error
                     <pre tw='whitespace-pre-wrap'>{JSON.stringify(err)}</pre>
                  </div>
               </LegacyMessageUI>
            </div>
         ))}
      </div>
   )
})
