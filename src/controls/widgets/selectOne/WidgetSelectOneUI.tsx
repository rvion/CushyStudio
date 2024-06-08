import type { BaseSelectEntry, Widget_selectOne } from './WidgetSelectOne'

import { observer } from 'mobx-react-lite'

import { InputBoolUI } from '../../../csuite/checkbox/InputBoolUI'
import { SelectUI } from '../../../csuite/select/SelectUI'
import { makeLabelFromFieldName } from '../../../utils/misc/makeLabelFromFieldName'

export const WidgetSelectOneUI = observer(function WidgetSelectOneUI_<T extends BaseSelectEntry>(p: {
    widget: Widget_selectOne<T>
}) {
    const widget = p.widget
    if (widget.config.appearance === 'tab') return <WidgetSelectOne_TabUI widget={widget} />
    return <WidgetSelectOne_SelectUI widget={widget} />
})

export const WidgetSelectOne_TabUI = observer(function WidgetSelectOne_TabUI_<T extends BaseSelectEntry>(p: {
    widget: Widget_selectOne<T>
}) {
    const widget = p.widget
    const selected = widget.serial.val
    return (
        <div>
            <div tw='rounded select-none ml-auto justify-end flex flex-wrap gap-x-0.5 gap-y-0'>
                {widget.choices.map((c) => {
                    const isSelected = selected?.id === c.id
                    return (
                        <InputBoolUI
                            key={c.id}
                            value={isSelected}
                            display='button'
                            text={c.label ?? c.id}
                            onValueChange={(value) => {
                                if (value === isSelected) return
                                widget.value = c
                            }}
                        />
                    )
                })}
            </div>
            {widget.baseErrors && (
                <div tw='text-red-500 flex items-center gap-1'>
                    <span className='material-symbols-outlined'>error</span>
                    {widget.baseErrors}
                </div>
            )}
        </div>
    )
})

export const WidgetSelectOne_SelectUI = observer(function WidgetSelectOne_SelectUI_<T extends BaseSelectEntry>(p: {
    widget: Widget_selectOne<T>
}) {
    const widget = p.widget
    return (
        <div tw='flex-1'>
            <SelectUI<T>
                key={widget.id}
                tw={[widget.baseErrors && 'rsx-field-error']}
                getLabelText={(t) => t.label ?? makeLabelFromFieldName(t.id)}
                getLabelUI={widget.config.getLabelUI}
                getSearchQuery={() => widget.serial.query ?? ''}
                setSearchQuery={(query) => (widget.serial.query = query)}
                disableLocalFiltering={widget.config.disableLocalFiltering}
                options={() => widget.choices}
                equalityCheck={(a, b) => a.id === b.id}
                value={() => widget.serial.val}
                onChange={(selectOption) => {
                    if (selectOption == null) {
                        // TODO?: hook into it's parent if parent is an option block ?
                        // ⏸️ if (!widget.isOptional) return
                        // ⏸️ widget.state.active = false
                        return
                    }
                    const next = widget.choices.find((c) => c.id === selectOption.id)
                    if (next == null) {
                        console.log(`❌ WidgetSelectOneUI: could not find choice for ${JSON.stringify(selectOption)}`)
                        return
                    }
                    widget.value = next
                }}
            />
            {/* {widget.baseErrors && (
                <div tw='text-red-500 flex items-center gap-1'>
                    <span className='material-symbols-outlined'>error</span>
                    {widget.baseErrors}
                </div>
            )} */}
        </div>
    )
})
