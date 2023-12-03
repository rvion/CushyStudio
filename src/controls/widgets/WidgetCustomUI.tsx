import { observer } from 'mobx-react-lite'
import { createElement } from 'react'
import { Widget_custom_componentProps_ui, Widget_custom } from 'src/controls/Widget'
import { ImageUI } from 'src/widgets/galleries/ImageUI'

export const WidgetCustomUI = observer(function WidgetCustomUI_(p: { req: Widget_custom<unknown> }) {
    const req = p.req

    return createElement(req.Component, {
        req,
        componentState: req.componentState,
        onChange: (v) => (req.componentState = v),
        ui,
    })
})

/** Common ui components */
const ui: Widget_custom_componentProps_ui = {
    image: (p) => <ImageUI {...p} />,
}
