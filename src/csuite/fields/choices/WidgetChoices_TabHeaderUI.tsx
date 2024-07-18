import type { SchemaDict } from '../../model/SchemaDict'
import type { Field_choices } from './FieldChoices'

import { observer } from 'mobx-react-lite'

import { InputBoolUI } from '../../checkbox/InputBoolUI'
import { useCSuite } from '../../ctx/useCSuite'
import { getJustifyContent } from './TabPositionConfig'

// ============================================================================================================

export const WidgetChoices_TabHeaderUI = observer(function WidgetChoicesTab_LineUI_<T extends SchemaDict>(p: {
    field: Field_choices<T>
}) {
    const field = p.field
    const choices = field.choicesWithLabels // choicesStr.map((v) => ({ key: v }))
    const csuite = useCSuite()
    return (
        <div
            tw='rounded select-none flex flex-1 flex-wrap gap-x-0.5 gap-y-0.5'
            style={{ justifyContent: getJustifyContent(field.config.tabPosition) }}
        >
            {choices.map((c) => {
                const isSelected = field.serial.branches[c.key]
                return (
                    <InputBoolUI
                        icon={c.icon}
                        key={c.key}
                        value={isSelected}
                        display='button'
                        mode={p.field.isMulti ? 'checkbox' : 'radio'}
                        text={c.label}
                        box={isSelected ? undefined : { text: csuite.labelText }}
                        onValueChange={(value) => {
                            if (value != isSelected) {
                                field.toggleBranch(c.key)
                            }
                        }}
                    />
                )
            })}
        </div>
    )
})
