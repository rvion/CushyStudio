import type { CompiledRenderProps } from '../../../csuite-cushy/presenters/Presenter'
import type { Field_optional } from './FieldOptional'

import { observer } from 'mobx-react-lite'

import { renderFCOrNode } from '../../../csuite-cushy/shells/_isFC'

export const ShellOptionalUI = observer(function ShellOptionalUI_(p: CompiledRenderProps<Field_optional>) {
    const field = p.field
    const extraClass = field.isDisabled ? 'pointer-events-none opacity-30 bg-[#00000005]' : undefined
    const child = field.child
    return (
        <child.UI //
            Toogle={<field.UIToggle />}
            LabelText={(x) => renderFCOrNode(p.LabelText, { field: field })}
            classNameAroundBodyAndHeader={extraClass}
        />
    )
})
