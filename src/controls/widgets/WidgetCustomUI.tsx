import { observer } from 'mobx-react-lite'
import { createElement } from 'react'
import { Widget_custom_componentProps_ui, Widget_custom } from 'src/controls/Widget'
import { PropsOf } from 'src/panels/router/Layout'
import { ImageUI } from 'src/widgets/galleries/ImageUI'

export const WidgetCustomUI = observer(function WidgetCustomUI_(p: { req: Widget_custom<unknown> }) {
    const req = p.req

    return createElement(req.Component, {
        req,
        componentState: req.componentState,
        onChange: (v) => (req.componentState = v),
        ui: commonUIComponents,
    })
})

/** Common ui components */
const commonUIComponents = {
    image: (p: PropsOf<typeof ImageUI>) => <ImageUI {...p} />,
}

export type UIKit = typeof commonUIComponents
