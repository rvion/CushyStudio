import type { PropsOf } from 'src/panels/router/Layout'

import { observer } from 'mobx-react-lite'

import { InputNumberUI } from '../number/InputNumberUI'
import { Widget_custom } from './WidgetCustom'
import { ImageUI } from 'src/widgets/galleries/ImageUI'
import { JsonViewUI } from 'src/widgets/workspace/JsonViewUI'

export const WidgetCustom_HeaderUI = observer(function WidgetCustom_HeaderUI_<T>(p: { widget: Widget_custom<T> }) {
    const widget = p.widget
    return <widget.config.Component widget={widget} extra={_commonUIComponents} />
})

// ------------------------------------------------------------------------

/** Common ui components */
const _commonUIComponents = {
    ImageUI: (p: PropsOf<typeof ImageUI>) => <ImageUI {...p} />,
    JsonViewUI: (p: PropsOf<typeof JsonViewUI>) => <JsonViewUI {...p} />,
    InputNumberUI: (p: PropsOf<typeof InputNumberUI>) => <InputNumberUI {...p} />,
}

export type UIKit = typeof _commonUIComponents
