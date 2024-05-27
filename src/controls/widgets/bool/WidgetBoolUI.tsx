import type { Widget_bool } from './WidgetBool'

import { observer } from 'mobx-react-lite'

import { Ikon } from '../../../icons/iconHelpers'
import { SpacerUI } from '../spacer/SpacerUI'
import { InputBoolUI } from './InputBoolUI'

export const WidgetBoolUI = observer(function WidgetBoolUI_(p: { widget: Widget_bool }) {
    const widget = p.widget

    if (widget.config.label2) {
        console.warn('label2 is deprecated, please use the text option instead. label2 will be removed in the future')
    }

    return (
        <div tw='flex w-full h-full '>
            <InputBoolUI
                // config
                display={widget.config.display}
                expand={widget.config.display === 'button' ? widget.config.expand : true}
                icon={widget.icon}
                text={widget.config.text ?? widget.config.label2}
                // value
                active={widget.value}
                onValueChange={(value) => (widget.value = value)}
            />

            <SpacerUI />
        </div>
    )
})
