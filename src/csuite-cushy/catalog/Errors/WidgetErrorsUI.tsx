import type { Field } from '../../../csuite/model/Field'
import type { Problem } from '../../../csuite/model/Validation'

import { observer } from 'mobx-react-lite'

import { Frame } from '../../../csuite/frame/Frame'
import { Ikon } from '../../../csuite/icons/iconHelpers'
import { RevealUI } from '../../../csuite/reveal/RevealUI'

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
   if (!field.mustDisplayErrors) return null
   return (
      <Frame
         // tw='text-red-700 -mt-1'
         text={{ hue: 0, contrast: 0.5, chroma: 0.3 }}
         tw='-mt-1'
      >
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
