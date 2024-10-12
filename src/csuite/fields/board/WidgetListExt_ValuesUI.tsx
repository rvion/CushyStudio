import type { BaseSchema } from '../../model/BaseSchema'
import type { Field_board } from './Field_board'

import { observer } from 'mobx-react-lite'

import { Button } from '../../button/Button'

export const WidgetListExt_ValuesUI = observer(function WidgetListExtValuesUI_<T extends BaseSchema>(p: {
    //
    field: Field_board<T>
}) {
    const listExt = p.field
    const { items } = listExt.fields
    const values = listExt.fields.items.childrenAll
    const len = values.length
    const indexWidth = len < 10 ? 1 : len < 100 ? 2 : 3
    const min = items.config.min
    return (
        <div tw='flex flex-col gap-1'>
            {values.map((sub2, ix) => {
                const sub = sub2.fields
                const subWidget = sub.value
                const shape = sub.shape
                return (
                    <div key={subWidget.id} tw='flex items-start'>
                        <div style={{ width: `${indexWidth}rem` }}>{ix}</div>
                        <input
                            value={shape.value.fill}
                            onChange={(ev) => (shape.value.fill = ev.target.value)}
                            type='color'
                            tw='w-7'
                        ></input>
                        <Button
                            style={{ width: `${indexWidth}rem` }}
                            look='subtle'
                            size='sm'
                            onClick={() => subWidget.setCollapsed(!Boolean(subWidget.serial.collapsed))}
                        >
                            {subWidget.serial.collapsed ? '▸' : '▿'}
                        </Button>
                        <subWidget.UI />
                        {/* <shape.UI /> */}
                        <Button
                            look='subtle'
                            disabled={min ? items.length <= min : undefined}
                            tw='self-start'
                            onClick={() => items.removeItem(sub2)}
                            size='sm'
                        >
                            X
                        </Button>
                    </div>
                )
            })}
        </div>
    )
})
