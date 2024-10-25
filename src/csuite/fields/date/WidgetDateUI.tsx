import type { Field_date } from './FieldDate'

import { observer } from 'mobx-react-lite'

import { Button } from '../../button/Button'
import { InputStringUI } from '../../input-string/InputStringUI'
import { formatDateForInput } from './format'

/**
 * This component throws a warning in the console: when changing the value of `disabled`
 * because the parent component is un-mounted and then mounted again.
 * This needs to be fixed, and the warning will disappear. (2024-08-23)
 * Please remove this explanation when the warning is fixed.
 */
export const WidgetDate_ClearButtonUI = observer(function WidgetDate_ClearButtonUI_<
   NULLABLE extends boolean,
>(p: { field: Field_date<NULLABLE>; readonly?: boolean }) {
   const mustShowDeleteBtn: boolean = ((): boolean => {
      if (p.field.selectedValue == null) return false
      if (p.readonly) return false
      if (p.field.config.nullable) return true
      if (p.field.canBeToggledWithinParent) return true
      return false
   })()

   if (!mustShowDeleteBtn) return null

   return (
      <Button
         tw='flex-shrink flex-grow-0'
         size='input'
         borderless
         subtle
         square
         icon='mdiClose'
         disabled={p.field.selectedValue == null}
         onClick={() => {
            if (p.field.config.nullable) {
               ;(p.field as Field_date<true>).value = null
            }
            if (p.field.canBeToggledWithinParent) {
               p.field.disableSelfWithinParent()
            }
            p.field.touch()
         }}
      />
   )
})

// date HEADER
export const WidgetDate_HeaderUI = observer(function WidgetDateUI_<NULLABLE extends boolean>(p: {
   field: Field_date<NULLABLE>
   readonly?: boolean
}) {
   const field = p.field
   const config = field.config
   return (
      <div tw='sticky top-0 flex w-full items-center gap-0.5'>
         <InputStringUI
            tw='w-full'
            inputClassName={[
               'w-full',
               'minh-input',
               'UI-InputDate',
               field.mustDisplayErrors && 'border-red-700 border',
            ]
               .filter(Boolean)
               .join(' ')}
            icon={p.field.config.innerIcon}
            type='datetime-local'
            className={config.className}
            getValue={() => formatDateForInput(field.value_unchecked)}
            setValue={(value) => {
               if (p.field.canBeToggledWithinParent) {
                  if (value == '') {
                     p.field.disableSelfWithinParent()
                  } else {
                     p.field.enableSelfWithinParent()
                  }
               }

               field.setValueFromString(value)
               p.field.touch()
            }}
            placeholder={field.config.placeHolder}
            disabled={p.readonly}
         />
         <WidgetDate_ClearButtonUI field={field} readonly={p.readonly} />
      </div>
   )
})
