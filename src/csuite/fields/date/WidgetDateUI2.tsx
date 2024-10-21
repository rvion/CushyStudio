import type { Field_date } from './FieldDate2'

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
export const WidgetDate_ClearButtonUI = observer(function WidgetDate_ClearButtonUI_(p: {
    field: Field_date
    readonly?: boolean
}) {
    if (p.readonly) return null

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
                p.field.disableSelfWithinParent()
                p.field.touch()
            }}
        />
    )
})

// date HEADER
export const WidgetDate_HeaderUI = observer(function WidgetDateUI_(p: { field: Field_date; readonly?: boolean }) {
    const field = p.field
    const config = field.config
    return (
        <div tw='sticky top-0 flex w-full items-center gap-0.5'>
            <InputStringUI
                tw='w-full'
                inputClassName={['w-full', 'minh-input', 'UI-InputDate', field.mustDisplayErrors && 'border-red-700 border']
                    .filter(Boolean)
                    .join(' ')}
                icon={p.field.config.innerIcon}
                type='datetime-local'
                className={config.className}
                getValue={() => formatDateForInput(field.selectedValue)}
                setValue={(value) => {
                    field.setValueFromString(value)
                    p.field.touch()
                }}
                placeholder={field.config.placeHolder}
                disabled={p.readonly}
                onBlur={() => field.touch()}
            />
            <WidgetDate_ClearButtonUI field={field} readonly={p.readonly} />
        </div>
    )
})
