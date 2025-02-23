import type { Field } from '../model/Field'

import { observer } from 'mobx-react-lite'

import { Ikon } from '../../csuite/icons/iconHelpers'
import { csuiteConfig } from '../config/configureCsuite'
import { Frame } from '../frame/Frame'
import { MessageInfoUI } from '../messages/MessageInfoUI'
import { normalizeProblem, type Problem } from '../model/Validation'
import { RevealUI } from '../reveal/RevealUI'

export const ErrorMessage = observer(function ErrorMessage_(p: { problem: Problem }) {
   return (
      <div tw='minh-input flex items-start gap-1'>
         <Ikon.mdiAlert tw='mt-1' />
         {p.problem.message}
      </div>
   )
})

/** default error block */
export const WidgetErrorsUI = observer(function WidgerErrorsUI_(p: { field: Field }) {
   const field = p.field
   if (!field.hasOwnErrors || !field.touched) return null
   return (
      <Frame tw={['text-red-700', field.type === 'group' ? 'mt-4' : '']} noColorStuff>
         {/* {field.pathExt} */}
         {field.ownErrors.map((e, i) =>
            e.longerMessage ? (
               // 🦀 Added `h-input` to make it less ugly, but not sure if it's the right way
               <RevealUI key={i} trigger={'click'} content={() => e.longerMessage ?? 'no extra infos'}>
                  <ErrorMessage problem={e} />
               </RevealUI>
            ) : (
               <ErrorMessage problem={e} key={i} />
            ),
         )}
      </Frame>
   )
})

/** default error block */
export const WidgetConfigErrorsUI = observer(function WidgetConfigErrorsUI_(p: { field: Field }) {
   // 💬 2024-09-17 rvion:
   // | this component is only visible during dev
   if (!csuiteConfig.isDev) return null

   const field = p.field
   const configPbs = normalizeProblem(field, field.ownConfigSpecificProblems)
   if (configPbs.length === 0) return null
   return (
      <MessageInfoUI title={`Field Config Invalid (ONLY VISIBLE DURING DEV)`}>
         {configPbs.map((e, i) => (
            // 🦀 Added `h-input` to make it less ugly, but not sure if it's the right way
            <RevealUI key={i} trigger={'click'} content={() => e.longerMessage ?? 'no extra infos'}>
               <div tw='h-input flex items-center gap-1'>
                  <Ikon.mdiNinja />
                  {e.message}
               </div>
            </RevealUI>
         ))}
      </MessageInfoUI>
   )
})
