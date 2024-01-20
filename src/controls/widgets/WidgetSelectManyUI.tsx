import { observer } from 'mobx-react-lite'
import { BaseSelectEntry, Widget_selectMany } from 'src/controls/Widget'
import { SelectUI } from 'src/rsuite/SelectUI'

export const WidgetSelectManyUI = observer(function WidgetSelectOneUI_<T extends BaseSelectEntry>(p: {
    widget: Widget_selectMany<T>
}) {
    const widget = p.widget
    return (
        <SelectUI<T>
            size='sm'
            multiple
            getLabelText={(t) => t.label ?? t.id}
            options={() => widget.choices}
            value={() => widget.serial.values}
            onChange={(selectOption) => widget.toggleItem(selectOption)}
        />
    )
})
