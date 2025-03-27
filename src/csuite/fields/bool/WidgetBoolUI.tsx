import type { Field_bool } from './FieldBool'

import { InputBoolUI } from '../../checkbox/InputBoolUI'
import { SpacerUI } from '../../components/SpacerUI'

export const WidgetBoolUI = obs(function WidgetBoolUI_(p: { field: Field_bool }) {
   const field = p.field

   if (field.config.label2) {
      console.warn(
         'label2 is deprecated, please use the text option instead. label2 will be removed in the future',
      )
   }

   return (
      <div tw='flex h-full w-full '>
         <InputBoolUI
            // config
            display={field.config.display}
            expand={field.config.display === 'button' ? field.config.expand : true}
            icon={field.icon}
            text={field.config.text ?? field.config.label2}
            // value
            value={field.value_or_zero}
            onBlur={() => field.ܒtouch()}
            onValueChange={(value) => {
               field.value = value
               p.field.ܒtouch()
            }}
            toggleGroup={field._uid}
         />

         <SpacerUI />
      </div>
   )
})
