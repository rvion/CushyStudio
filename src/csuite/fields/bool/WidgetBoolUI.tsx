import type { Field_bool } from './FieldBool'

import { InputBoolUI } from '../../checkbox/InputBoolUI'
import { SpacerUI } from '../../components/SpacerUI'

export const WidgetBoolUI = obs(function WidgetBoolUI_(p: { field: Field_bool }) {
   const field = p.field

   if (field.zConfig.label2) {
      console.warn(
         'label2 is deprecated, please use the text option instead. label2 will be removed in the future',
      )
   }

   return (
      <div tw='flex h-full w-full '>
         <InputBoolUI
            // config
            display={field.zConfig.display}
            expand={field.zConfig.display === 'button' ? field.zConfig.expand : true}
            icon={field.zIcon}
            text={field.zConfig.text ?? field.zConfig.label2}
            // value
            value={field.zValueOrZero}
            onBlur={() => field.zTouch()}
            onValueChange={(value) => {
               field.zValue = value
               p.field.zTouch()
            }}
            toggleGroup={field.zUid}
         />

         <SpacerUI />
      </div>
   )
})
