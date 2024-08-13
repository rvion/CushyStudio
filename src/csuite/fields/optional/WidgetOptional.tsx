import type { Field_optional } from './FieldOptional'

import { observer } from 'mobx-react-lite'

import { WidgetWithLabelUI } from '../../form/WidgetWithLabelUI'

// string HEADER
export const WidgetOptional_HeaderUI = observer(function WidgetStringUI_(p: { field: Field_optional }) {
    const field = p.field
    const child = field.child
    const extraClass = field.isDisabled ? 'pointer-events-none opacity-30 bg-[#00000005]' : undefined
    return (
        <WidgetWithLabelUI //
            classNameAroundBodyAndHeader={extraClass}
            fieldName='child'
            justifyLabel={field.config.justifyLabel ?? child.config.justifyLabel}
            field={child}
        />
    )
})
