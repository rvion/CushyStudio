import type { PropsOf } from '../../../router/Layout'
import type { Widget_custom } from './WidgetCustom'

import { observer } from 'mobx-react-lite'

import { ImageUI } from '../../../widgets/galleries/ImageUI'
import { InputNumberUI } from '../../input-number/InputNumberUI'
import { JsonViewUI } from '../../json/JsonViewUI'

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
