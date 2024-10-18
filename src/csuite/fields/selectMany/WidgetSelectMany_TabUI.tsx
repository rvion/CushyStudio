import type { SelectKey } from '../selectOne/SelectOneKey'
import type { Field_selectMany } from './FieldSelectMany'

import { observer } from 'mobx-react-lite'

import { InputBoolUI } from '../../checkbox/InputBoolUI'
import { makeLabelFromPrimitiveValue } from '../../utils/makeLabelFromFieldName'
import { getJustifyContent } from '../choices/TabPositionConfig'
import { convertSelectKeyToReactKey } from '../selectOne/SelectOneKey'

export const WidgetSelectMany_TabUI = observer(function WidgetSelectMany_TabUI_<VALUE, KEY extends SelectKey>(p: {
    field: Field_selectMany<VALUE, KEY>
}) {
    const field = p.field

    return (
        <div>
            <div
                tw='flex select-none flex-wrap gap-x-0.5 gap-y-0 rounded'
                style={{ justifyContent: getJustifyContent(field.config.tabPosition) }}
            >
                {p.field.options.map((option) => {
                    const isSelected = field.selectedKeys.includes(option.id)

                    return (
                        <InputBoolUI
                            toggleGroup={field.id}
                            key={convertSelectKeyToReactKey(option.id)}
                            value={isSelected}
                            display='button'
                            text={option.label ?? makeLabelFromPrimitiveValue(option.id)}
                            onValueChange={(value) => {
                                if (value != isSelected) field.toggleId(option.id)
                                field.touch()
                            }}
                            onBlur={() => field.touch()}
                        />
                    )
                })}

                {/* ERROR ITEMS (items that are no longer valid to pick from) */}
                {/* We need to display them so we can properly uncheck them. */}
                {field.selectedKeys
                    .filter((v) => !field.possibleKeys.includes(v))
                    .map((missingId) => (
                        <InputBoolUI
                            toggleGroup={field.id}
                            key={convertSelectKeyToReactKey(missingId)}
                            value={true}
                            style={{ border: '1px solid oklch(var(--er))' }}
                            display='button'
                            text={makeLabelFromPrimitiveValue(missingId)}
                            onValueChange={(value) => {
                                field.toggleId(missingId)
                                field.touch()
                            }}
                            onBlur={() => field.touch()}
                        />
                    ))}
            </div>
        </div>
    )
})
