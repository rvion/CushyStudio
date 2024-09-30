import type { CompiledRenderProps } from '../../../csuite-cushy/presenters/Presenter'
import type { BaseSchema } from '../../model/BaseSchema'
import type { Field_link } from './FieldLink'

import { observer } from 'mobx-react-lite'

import { renderFCOrNode } from '../../../csuite-cushy/shells/_isFC'

export const ShellLinkUI = observer(function ShellLink(p: CompiledRenderProps<Field_link<BaseSchema, BaseSchema>>) {
    const field = p.field
    const extraClass = field.isDisabled ? 'pointer-events-none opacity-30 bg-[#00000005]' : undefined
    const child = field.bField
    return (
        <child.UI //
            LabelText={(x) => renderFCOrNode(p.LabelText, { field: field })}
            classNameAroundBodyAndHeader={extraClass}
        />
    )
})