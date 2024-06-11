import type { BaseSelectEntry } from '../selectOne/WidgetSelectOne'
import type { Widget_selectMany } from './WidgetSelectMany'

import { observer } from 'mobx-react-lite'

import { InputBoolUI } from '../../../csuite/checkbox/InputBoolUI'
import { MessageErrorUI } from '../../../csuite/messages/MessageErrorUI'
import { ResizableFrame } from '../../../csuite/resizableFrame/resizableFrameUI'

export const WidgetSelectMany_ListUI = observer(function WidgetSelectMany_TabUI_<T extends BaseSelectEntry>(p: {
    widget: Widget_selectMany<T>
}) {
    const widget = p.widget
    return (
        <ResizableFrame tw='w-full'>
            {widget.choices.slice(0, 100).map((c) => {
                const isSelected = Boolean(widget.serial.values.find((item) => item.id === c.id))
                return (
                    <InputBoolUI
                        value={isSelected}
                        display='button'
                        tw='w-full'
                        text={c.label}
                        onValueChange={(value) => {
                            if (value != isSelected) widget.toggleItem(c)
                        }}
                    />
                )
            })}

            {/* ERROR ITEMS (items that are no longer valid to pick from) */}
            {/* We need to display them so we can properly uncheck them. */}
            {/* {widget.serial.values
                .filter((v) => widget.choices.find((i) => i.id === v.id) == null)
                .map((item) => (
                    <InputBoolUI
                        value={true}
                        style={{ border: '1px solid oklch(var(--er))' }}
                        display='button'
                        text={item.label ?? 'no label'}
                        onValueChange={(value) => widget.toggleItem(item)}
                    />
                ))} */}
        </ResizableFrame>
    )
})
