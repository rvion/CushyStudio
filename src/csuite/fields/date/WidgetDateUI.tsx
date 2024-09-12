import type { Field_date } from './FieldDate'

import { observer } from 'mobx-react-lite'

import { Button } from '../../button/Button'
import { InputStringUI } from '../../input-string/InputStringUI'
import { formatDateForInput } from './formatDateForInput'

/**
 * This component throws a warning in the console: when changing the value of `disabled`
 * because the parent component is un-mounted and then mounted again.
 * This needs to be fixed, and the warning will disappear. (2024-08-23)
 * Please remove this explanation when the warning is fixed.
 */
export const WidgetDate_ClearButtonUI = observer(function WidgetDate_ClearButtonUI_<NULLABLE extends boolean>(p: {
    field: Field_date<NULLABLE>
    readonly?: boolean
}) {
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
                ;(p.field as Field_date<true>).value = null
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
        <div tw='sticky flex items-center gap-0.5 top-0 z-[50] w-full'>
            <InputStringUI
                tw='w-full'
                icon={p.field.config.innerIcon}
                type='datetime-local'
                className={config.className}
                getValue={() => formatDateForInput(field.selectedValue)}
                setValue={(value) => field.setValueFromString(value)}
                placeholder={field.config.placeHolder}
                disabled={p.readonly}
            />
            <WidgetDate_ClearButtonUI field={field} readonly={p.readonly} />
        </div>
    )
})
