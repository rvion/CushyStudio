import type { RuntimeErrorL } from '../models/RuntimeError'
import type { StepL } from '../models/Step'

import { observer } from 'mobx-react-lite'

import { LegacySurfaceUI } from '../csuite/inputs/LegacySurfaceUI'
import { JsonViewUI } from '../csuite/json/JsonViewUI'

export const OutputRuntimeErrorPreviewUI = observer(function OutputRuntimeErrorPreviewUI_(p: {
   step?: Maybe<StepL>
   output: RuntimeErrorL
}) {
   return <div tw='text-error-content bg-error font-bold'>Runtime Error</div>
})

export const OutputRuntimeErrorUI = observer(function OutputRuntimeErrorUI_(p: {
   step?: Maybe<StepL>
   output: RuntimeErrorL
}) {
   const output = p.output
   const msg = output.data
   return (
      <LegacySurfaceUI tw='h-full w-full'>
         <div className='bg-error text-error-content'>
            <div tw='text-xl font-bold'>Runtime Error</div>
            <div tw='italic'>{msg.message}</div>
         </div>
         <div>
            <div tw='font-bold'>error infos:</div>
            <JsonViewUI value={JSON.parse(JSON.stringify(msg.infos))} />
         </div>
      </LegacySurfaceUI>
   )
})
