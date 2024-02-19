import { observer } from 'mobx-react-lite'
import { BaseSelectEntry, Widget_selectOne } from 'src/controls/Widget'
import { SelectUI } from 'src/rsuite/SelectUI'
import { makeLabelFromFieldName } from 'src/utils/misc/makeLabelFromFieldName'

export const WidgetSelectOneUI = observer(function WidgetSelectOneUI_<T extends BaseSelectEntry>(p: {
    widget: Widget_selectOne<T>
}) {
    const widget = p.widget
    if (widget.config.appearance === 'tab') {
        const selected = widget.serial.val
        return (
            <div>
                <div role='tablist' tw='tabs tabs-boxed tabs-sm flex-wrap text-shadow'>
                    {widget.choices.map((c) => {
                        const isSelected = selected?.id === c.id
                        return (
                            <a
                                onClick={() => (widget.serial.val = c)}
                                key={c.id}
                                role='tab'
                                tw={['tab', isSelected && 'tab-active']}
                            >
                                {c.label ?? makeLabelFromFieldName(c.id)}
                            </a>
                        )
                    })}
                </div>
                {widget.errors && (
                    <div tw='text-red-500 flex items-center gap-1'>
                        <span className='material-symbols-outlined'>error</span>
                        {widget.errors}
                    </div>
                )}
            </div>
        )
    }
    return (
        <div tw='flex-1'>
            <SelectUI<T>
                key={widget.id}
                tw={[widget.errors && 'rsx-field-error']}
                size='sm'
                getLabelText={(t) => t.label ?? makeLabelFromFieldName(t.id)}
                options={() => widget.choices}
                value={() => widget.serial.val}
                onChange={(selectOption) => {
                    if (selectOption == null) {
                        // TODO: hook into it's parent if parent is an option block ?
                        // ⏸️ if (!widget.isOptional) return
                        // ⏸️ widget.state.active = false
                        return
                    }
                    const next = widget.choices.find((c) => c.id === selectOption.id)
                    if (next == null) {
                        console.log(`❌ WidgetSelectOneUI: could not find choice for ${JSON.stringify(selectOption)}`)
                        return
                    }
                    widget.serial.val = next
                }}
            />
            {widget.errors && (
                <div tw='text-red-500 flex items-center gap-1'>
                    <span className='material-symbols-outlined'>error</span>
                    {widget.errors}
                </div>
            )}
        </div>
    )
})
