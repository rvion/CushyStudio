import type { Field_selectOne } from './FieldSelectOne'

import { observer } from 'mobx-react-lite'

import { InputBoolUI } from '../../checkbox/InputBoolUI'
import { getJustifyContent } from '../choices/TabPositionConfig'

export const WidgetSelectOne_TabUI = observer(function WidgetSelectOne_TabUI_<VALUE>(p: {
    field: Field_selectOne<VALUE>
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
            {field.options.map((c) => {
                const isSelected = selected === c.id
                return (
                    <InputBoolUI
                        key={c.id}
                        icon={c.icon}
                        value={isSelected}
                        display='button'
                        text={c.label ?? c.id}
                        onValueChange={(value: boolean) => {
                            if (value === isSelected) return
                            field.selectedId = c.id
                        }}
                    />
                )
            })}
        </div>
    )
})
