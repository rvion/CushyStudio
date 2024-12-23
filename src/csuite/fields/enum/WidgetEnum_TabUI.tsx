import type { Field_enum } from './FieldEnum'

import { observer } from 'mobx-react-lite'

import { InputBoolUI } from '../../checkbox/InputBoolUI'

export const WidgetEnum_TabUI = observer(function WidgetEnum_TabUI_(p: { field: Field_enum<any> }) {
   const field = p.field
   const selected = field.serial.val
   return (
      <div
         tw={[
            //
            'flex flex-1',
            (field.config.wrap ?? true) && 'flex-wrap',
            'rounded',
            'select-none',
            'gap-x-0.5 gap-y-0',
         ]}
      >
         {field.possibleValues.map((c: any) => {
            const isSelected = selected === c
            return (
               <InputBoolUI
                  toggleGroup={field.id}
                  key={c}
                  value={isSelected}
                  display='button'
                  text={c.toString()}
                  onValueChange={(value) => {
                     if (value === isSelected) return
                     field.value = c
                  }}
               />
            )
         })}
      </div>
   )
})
