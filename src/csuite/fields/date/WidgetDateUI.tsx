import type { Field_date } from './FieldDate'

import { Button } from '../../button/Button'
import { InputStringUI } from '../../input-string/InputStringUI'

/**
 * This component throws a warning in the console: when changing the value of `disabled`
 * because the parent component is un-mounted and then mounted again.
 * This needs to be fixed, and the warning will disappear. (2024-08-23)
 * Please remove this explanation when the warning is fixed.
 */
export const WidgetDate_ClearButtonUI = obs(function WidgetDate_ClearButtonUI_<VALUE>(p: {
   field: Field_date<VALUE>
   readonly?: boolean
}) {
   if (!p.field.ϟcanBeToggledWithinParent || p.readonly) return null

   return (
      <Button
         tw='flex-shrink flex-grow-0'
         size='input'
         borderless
         subtle
         square
         icon={IKONS.mdiClose}
         disabled={p.field.selectedValue == null || !p.field.ϟisEnabledWithinParent}
         onClick={() => {
            if (p.field.ϟcanBeToggledWithinParent) {
               p.field.ϟdisableSelfWithinParent()
            }
            p.field.ϟtouch()
         }}
      />
   )
})

// date HEADER
export const WidgetDate_HeaderUI = obs(function WidgetDateUI_<VALUE>(p: {
   field: Field_date<VALUE>
   readonly?: boolean
}) {
   const field = p.field
   const config = field.ϟconfig
   return (
      <div tw='sticky top-0 flex w-full items-center gap-0.5'>
         <InputStringUI
            tw='w-full'
            inputClassName={[
               'w-full',
               'minh-input',
               'UI-InputDate',
               field.ϟhasOwnErrors && field.ϟtouched && 'border-red-700 border',
            ].join(' ')}
            // inputClassName={field.hasOwnErrors && field.touched ? 'border-red-700 border' : undefined}
            icon={p.field.ϟconfig.innerIcon}
            type='datetime-local'
            className={config.className}
            getValue={() =>
               !field.ϟisEnabledWithinParent || field.ϟvalue_unchecked == null
                  ? ''
                  : field.format(field.ϟvalue_unchecked)
            }
            setValue={(value) => {
               if (p.field.ϟcanBeToggledWithinParent) {
                  if (value == '') {
                     p.field.ϟdisableSelfWithinParent()
                  } else {
                     p.field.ϟenableSelfWithinParent()
                  }
               }

               field.setValueFromString(value)
               p.field.ϟtouch()
            }}
            placeholder={field.ϟconfig.placeHolder}
            disabled={p.readonly}
            onBlur={() => p.field.ϟtouch()}
         />
         <WidgetDate_ClearButtonUI field={field} readonly={p.readonly} />
      </div>
   )
})
