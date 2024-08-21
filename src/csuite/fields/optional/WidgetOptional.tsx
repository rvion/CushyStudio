import type { BaseSchema } from '../../model/BaseSchema'
import type { FieldRenderProps } from '../../model/FieldShell'
import type { Field_optional } from './FieldOptional'

import { observer } from 'mobx-react-lite'

// string HEADER
// export const WidgetOptional_HeaderUI = observer(function WidgetStringUI_(p: { field: Field_optional }) {
//     const field = p.field
//     const child = field.child
//     const extraClass = field.isDisabled ? 'pointer-events-none opacity-30 bg-[#00000005]' : undefined
//     return (
//         <WidgetWithLabelUI //
//             classNameAroundBodyAndHeader={extraClass}
//             fieldName='child'
//             justifyLabel={field.config.justifyLabel ?? child.config.justifyLabel}
//             field={child}
//         />
//     )
// })

export const WidgetOptionalUI = observer(function WidgetOptional({
    //
    field,
    shell: Shell,
    ShellProps,
}: FieldRenderProps<Field_optional<BaseSchema>>) {
    const child = field.child
    const extraClass = field.isDisabled ? 'pointer-events-none opacity-30 bg-[#00000005]' : undefined

    return child.render({
        classNameAroundBodyAndHeader: extraClass,
        slotToggle: field.UIToggle,
    })
})
