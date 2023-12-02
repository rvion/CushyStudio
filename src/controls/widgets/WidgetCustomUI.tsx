import { observer } from 'mobx-react-lite'
import { Widget_custom_componentProps_ui, Widget_custom } from 'src/controls/Widget'
import { ImageUI } from 'src/widgets/galleries/ImageUI'

export const WidgetCustomUI = observer(function WidgetCustomUI_(p: { req: Widget_custom }) {
    const req = p.req

    return (
        <>
            <req.customComponent value={req.componentViewState} onChange={(v) => (req.componentViewState = v)} ui={ui} />
        </>
    )
})

/** Common ui components */
const ui: Widget_custom_componentProps_ui = {
    image: (p) => <ImageUI {...p} />,
}
