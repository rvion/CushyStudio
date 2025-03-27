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
   if (!p.field.zCanBeToggledWithinParent || p.readonly) return null

   return (
      <Button
         tw='flex-shrink flex-grow-0'
         size='input'
         borderless
         subtle
         square
         icon={IKONS.mdiClose}
         disabled={p.field.selectedValue == null || !p.field.zIsEnabledWithinParent}
         onClick={() => {
            if (p.field.zCanBeToggledWithinParent) {
               p.field.zDisableSelfWithinParent()
            }
            p.field.zTouch()
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
   const config = field.zConfig
   return (
      <div tw='sticky top-0 flex w-full items-center gap-0.5'>
         <InputStringUI
            tw='w-full'
            inputClassName={[
               'w-full',
               'minh-input',
               'UI-InputDate',
               field.zHasOwnErrors && field.zTouched && 'border-red-700 border',
            ].join(' ')}
            // inputClassName={field.hasOwnErrors && field.touched ? 'border-red-700 border' : undefined}
            icon={p.field.zConfig.innerIcon}
            type='datetime-local'
            className={config.className}
            getValue={() =>
               !field.zIsEnabledWithinParent || field.zValue_unchecked == null
                  ? ''
                  : field.format(field.zValue_unchecked)
            }
            setValue={(value) => {
               if (p.field.zCanBeToggledWithinParent) {
                  if (value == '') {
                     p.field.zDisableSelfWithinParent()
                  } else {
                     p.field.zEnableSelfWithinParent()
                  }
               }

               field.setValueFromString(value)
               p.field.zTouch()
            }}
            placeholder={field.zConfig.placeHolder}
            disabled={p.readonly}
            onBlur={() => p.field.zTouch()}
         />
         <WidgetDate_ClearButtonUI field={field} readonly={p.readonly} />
      </div>
   )
})
