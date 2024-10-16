import type { BaseSelectEntry, Field_selectOne } from './FieldSelectOne'

import { observer } from 'mobx-react-lite'

import { InputBoolUI } from '../../checkbox/InputBoolUI'
import { getJustifyContent } from '../choices/TabPositionConfig'

export const WidgetSelectOne_TabUI = observer(function WidgetSelectOne_TabUI_<T extends BaseSelectEntry>(p: {
    field: Field_selectOne<T>
    className?: string
}) {
    const field = p.field
    const selected = field.serial.val
    return (
        <div
            style={{ justifyContent: getJustifyContent(field.config.tabPosition) }}
            className={p.className}
            tw={[
                //
                'flex flex-1',
                'rounded',
                'select-none',
                //
                (field.config.wrap ?? true) && 'flex-wrap',
                'gap-x-1 gap-y-0',
            ]}
        >
            {field.choices.map((c) => {
                const isSelected = selected?.id === c.id
                return (
                    <InputBoolUI
                        key={c.id}
                        icon={c.icon}
                        value={isSelected}
                        display='button'
                        text={c.label ?? c.id}
                        onValueChange={(value) => {
                            if (value === isSelected) return
                            field.value = c
                        }}
                    />
                )
            })}
        </div>
    )
})
