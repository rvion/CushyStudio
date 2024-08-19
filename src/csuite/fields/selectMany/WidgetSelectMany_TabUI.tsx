import type { Field_selectMany } from './FieldSelectMany'

import { observer } from 'mobx-react-lite'

import { InputBoolUI } from '../../checkbox/InputBoolUI'
import { getJustifyContent } from '../choices/TabPositionConfig'

export const WidgetSelectMany_TabUI = observer(function WidgetSelectMany_TabUI_<VALUE>(p: { field: Field_selectMany<VALUE> }) {
    const field = p.field

    return (
        <div>
            <div
                tw='rounded select-none flex flex-wrap gap-x-0.5 gap-y-0'
                style={{ justifyContent: getJustifyContent(field.config.tabPosition) }}
            >
                {p.field.options.map((option) => {
                    const isSelected = field.selectedIds.includes(option.id)

                    return (
                        <InputBoolUI
                            key={option.id}
                            value={isSelected}
                            display='button'
                            text={option.label ?? option.id}
                            onValueChange={(value) => {
                                if (value != isSelected) field.toggleId(option.id)
                            }}
                        />
                    )
                })}

                {/* ERROR ITEMS (items that are no longer valid to pick from) */}
                {/* We need to display them so we can properly uncheck them. */}
                {field.selectedIds
                    .filter((v) => !field.choices.includes(v))
                    .map((missingId) => (
                        <InputBoolUI
                            key={missingId}
                            value={true}
                            style={{ border: '1px solid oklch(var(--er))' }}
                            display='button'
                            text={missingId}
                            onValueChange={(value) => field.toggleId(missingId)}
                        />
                    ))}
            </div>
        </div>
    )
})
