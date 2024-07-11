import type { BaseSelectEntry } from '../selectOne/FieldSelectOne'
import type { Field_selectMany } from './FieldSelectMany'

import { observer } from 'mobx-react-lite'

import { InputBoolUI } from '../../checkbox/InputBoolUI'
import { getJustifyContent } from '../choices/TabPositionConfig'

export const WidgetSelectMany_TabUI = observer(function WidgetSelectMany_TabUI_<T extends BaseSelectEntry>(p: {
    field: Field_selectMany<T>
}) {
    const field = p.field
    return (
        <div>
            <div
                tw='rounded select-none flex flex-wrap gap-x-0.5 gap-y-0'
                style={{ justifyContent: getJustifyContent(field.config.tabPosition) }}
            >
                {field.choices.map((c) => {
                    const isSelected = Boolean(field.serial.values.find((item) => item.id === c.id))
                    return (
                        <InputBoolUI
                            value={isSelected}
                            display='button'
                            text={c.label ?? c.id}
                            onValueChange={(value) => {
                                if (value != isSelected) field.toggleItem(c)
                            }}
                        />
                    )
                })}

                {/* ERROR ITEMS (items that are no longer valid to pick from) */}
                {/* We need to display them so we can properly uncheck them. */}
                {field.serial.values
                    .filter((v) => field.choices.find((i) => i.id === v.id) == null)
                    .map((item) => (
                        <InputBoolUI
                            value={true}
                            style={{ border: '1px solid oklch(var(--er))' }}
                            display='button'
                            text={item.label ?? 'no label'}
                            onValueChange={(value) => field.toggleItem(item)}
                        />
                    ))}
            </div>
        </div>
    )
})
