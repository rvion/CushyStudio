import { observer } from 'mobx-react-lite'
import { BaseSelectEntry, Widget_selectOne } from 'src/controls/Widget'
import { SelectUI } from 'src/rsuite/SelectUI'

export const WidgetSelectOneUI = observer(function WidgetSelectOneUI_<T extends BaseSelectEntry>(p: {
    widget: Widget_selectOne<T>
}) {
    const widget = p.widget
    return (
        <SelectUI<T>
            key={widget.id}
            size='sm'
            getLabelText={(t) => {
                // const def = typeof (t as any).type === 'string' ? (t as any).type : '<no label>'
                // def
                // console.log(`[👙] t`, t)
                return t.label ?? t.id // ?? def
            }}
            options={() => widget.choices}
            value={() => widget.state.val}
            onChange={(selectOption) => {
                if (selectOption == null) {
                    if (!widget.isOptional) return
                    widget.state.active = false
                    return
                }
                const next = widget.choices.find((c) => c.id === selectOption.id)
                if (next == null) {
                    console.log(`❌ WidgetSelectOneUI: could not find choice for ${JSON.stringify(selectOption)}`)
                    return
                }
                widget.state.val = next
            }}
        />
    )
})
