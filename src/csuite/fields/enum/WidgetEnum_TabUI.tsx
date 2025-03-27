import type { Field_enum } from './FieldEnum'

import { InputBoolUI } from '../../checkbox/InputBoolUI'

export const WidgetEnum_TabUI = obs(function WidgetEnum_TabUI_(p: { field: Field_enum<any> }) {
   const field = p.field
   const selected = field.ϟserial.val
   return (
      <div
         tw={[
            //
            'flex flex-1',
            (field.ϟconfig.wrap ?? true) && 'flex-wrap',
            'rounded',
            'select-none',
            'gap-x-0.5 gap-y-0',
         ]}
      >
         {field.possibleValues.map((c: any) => {
            const isSelected = selected === c
            return (
               <InputBoolUI
                  toggleGroup={field.ϟuid}
                  key={c}
                  value={isSelected}
                  display='button'
                  text={c.toString()}
                  onValueChange={(value) => {
                     if (value === isSelected) return
                     field.ϟvalue = c
                  }}
               />
            )
         })}
      </div>
   )
})
