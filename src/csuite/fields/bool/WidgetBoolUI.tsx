import type { Field_bool } from './FieldBool'

import { InputBoolUI } from '../../checkbox/InputBoolUI'
import { SpacerUI } from '../../components/SpacerUI'

export const WidgetBoolUI = obs(function WidgetBoolUI_(p: { field: Field_bool }) {
   const field = p.field

   if (field.ϟconfig.label2) {
      console.warn(
         'label2 is deprecated, please use the text option instead. label2 will be removed in the future',
      )
   }

   return (
      <div tw='flex h-full w-full '>
         <InputBoolUI
            // config
            display={field.ϟconfig.display}
            expand={field.ϟconfig.display === 'button' ? field.ϟconfig.expand : true}
            icon={field.ϟicon}
            text={field.ϟconfig.text ?? field.ϟconfig.label2}
            // value
            value={field.ϟvalue_or_zero}
            onBlur={() => field.ϟtouch()}
            onValueChange={(value) => {
               field.ϟvalue = value
               p.field.ϟtouch()
            }}
            toggleGroup={field.ϟuid}
         />

         <SpacerUI />
      </div>
   )
})
