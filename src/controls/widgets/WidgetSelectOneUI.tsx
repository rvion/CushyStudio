import { observer } from 'mobx-react-lite'
import { BaseSelectOneEntry, Widget_selectOne } from 'src/controls/Widget'
import { SelectUI } from 'src/rsuite/SelectUI'

export const WidgetSelectOneUI = observer(function WidgetSelectOneUI_<T extends BaseSelectOneEntry>(p: {
    req: Widget_selectOne<T>
}) {
    const req = p.req
    const value = req.state.val
    return (
        <SelectUI<T>
            size='sm'
            getLabelText={(t) => t.type}
            options={req.choices}
            value={() => value}
            onChange={(selectOption) => {
                if (selectOption == null) {
                    if (!req.isOptional) return
                    req.state.active = false
                    return
                }
                const next = req.choices.find((c) => c.type === selectOption.type)
                if (next == null) {
                    console.log(`❌ WidgetSelectOneUI: could not find choice for ${JSON.stringify(selectOption)}`)
                    return
                }
                req.state.val = next
            }}
        />
    )
})
