import type { Field_selectMany } from './FieldSelectMany'

import { observer } from 'mobx-react-lite'

import { InputBoolToggleButtonUI } from '../../checkbox/InputBoolToggleButtonUI'
import { ResizableFrame } from '../../resizableFrame/resizableFrameUI'
import { makeLabelFromPrimitiveValue } from '../../utils/makeLabelFromFieldName'
import { convertSelectKeyToReactKey, type SelectKey } from '../selectOne/SelectOneKey'

export const WidgetSelectMany_ListUI = observer(function WidgetSelectMany_ListUI_<VALUE, KEY extends SelectKey>(p: {
    field: Field_selectMany<VALUE, KEY>
}) {
    const field = p.field
    return (
        <ResizableFrame
            border
            tw='w-full'
            // header={
            //     <>
            //         <input
            //             // placeholder={s.isOpen ? p.placeholder : undefined}
            //             // ref={s.inputRef}
            //             // onChange={s.handleInputChange}
            //             tw='w-full h-full !outline-none csuite-basic-input'
            //             type='text'
            //             // value={s.searchQuery}
            //         />
            //     </>
            // }
        >
            {field.options.slice(0, 100).map((c) => {
                const isSelected = field.selectedKeys.includes(c.id)
                return (
                    <InputBoolToggleButtonUI
                        key={convertSelectKeyToReactKey(c.id)}
                        value={isSelected}
                        // border={false}
                        mode='checkbox'
                        showToggleButtonBox
                        tw='w-full [&>p]:text-start' // ❌ misc
                        text={c.label ?? makeLabelFromPrimitiveValue(c.id)}
                        onValueChange={(value) => {
                            if (value != isSelected) field.toggleId(c.id)
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
