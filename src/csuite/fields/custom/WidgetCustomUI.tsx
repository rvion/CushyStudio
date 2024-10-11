import type { PropsOf } from '../../types/PropsOf'
import type { Field_custom } from './FieldCustom'

import { observer } from 'mobx-react-lite'

import { ImageUI } from '../../../widgets/galleries/ImageUI'
import { InputNumberUI } from '../../input-number/InputNumberUI'
import { JsonViewUI } from '../../json/JsonViewUI'

export const WidgetCustom_HeaderUI = observer(function WidgetCustom_HeaderUI_<T>(p: { field: Field_custom<T> }) {
    const field = p.field
    return (
        <field.config.Component
            //
            field={field}
            extra={_commonUIComponents}
        />
    )
})

// ------------------------------------------------------------------------

/** Common ui components */
const _commonUIComponents = {
    ImageUI: (p: PropsOf<typeof ImageUI>): JSX.Element => <ImageUI {...p} />,
    JsonViewUI: (p: PropsOf<typeof JsonViewUI>): JSX.Element => <JsonViewUI {...p} />,
    InputNumberUI: (p: PropsOf<typeof InputNumberUI>): JSX.Element => <InputNumberUI {...p} />,
}

export type UIKit = typeof _commonUIComponents
