import type { Field_datePlain } from './FieldDatePlain'

import { observer } from 'mobx-react-lite'

import { Button } from '../../button/Button'
import { InputStringUI } from '../../input-string/InputStringUI'

/**
 * This component throws a warning in the console: when changing the value of `disabled`
 * because the parent component is un-mounted and then mounted again.
 * This needs to be fixed, and the warning will disappear. (2024-08-23)
 * Please remove this explanation when the warning is fixed.
 */
export const WidgetDatePlain_ClearButtonUI = observer(function WidgetDatePlain_ClearButtonUI_<
   NULLABLE extends boolean,
>(p: { field: Field_datePlain<NULLABLE>; readonly?: boolean }) {
   if (!p.field.config.nullable || p.readonly) return null

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
            ;(p.field as Field_datePlain<true>).value = null
            p.field.touch()
         }}
      />
   )
})

// date HEADER
export const WidgetDatePlain_HeaderUI = observer(function WidgetDatePlainUI_<NULLABLE extends boolean>(p: {
   field: Field_datePlain<NULLABLE>
   readonly?: boolean
}) {
   const field = p.field
   const config = field.config
   return (
      <div tw='sticky top-0 z-[50] flex w-full items-center gap-0.5'>
         <InputStringUI
            tw='w-full'
            inputClassName={field.mustDisplayErrors ? 'rsx-field-error' : undefined}
            icon={p.field.config.innerIcon}
            type='date'
            className={config.className}
            getValue={() => field.selectedValue?.toString() ?? ''}
            setValue={(value) => {
               field.setValueFromString(value)
               p.field.touch()
            }}
            placeholder={field.config.placeHolder}
            disabled={p.readonly}
            onBlur={() => field.touch()}
         />
         <WidgetDatePlain_ClearButtonUI field={field} readonly={p.readonly} />
      </div>
   )
})
