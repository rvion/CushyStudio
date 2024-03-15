import type { Widget_bool } from './WidgetBool'

import { observer } from 'mobx-react-lite'

import { InputBoolUI } from './InputBoolUI'

export const WidgetBoolUI = observer(function WidgetBoolUI_(p: { widget: Widget_bool }) {
    const widget = p.widget

    if (widget.config.label2) {
        console.warn('label2 is deprecated, please use the text option instead. label2 will be removed in the future')
    }

    return (
        <>
            <InputBoolUI
                // config
                display={widget.config.display}
                expand={widget.config.expand}
                icon={widget.config.icon}
                text={widget.config.text ?? widget.config.label2}
                // value
                active={widget.value}
                onValueChange={(value) => (widget.value = value)}
            />
            <div
                tw={[widget.isChanged ? undefined : 'btn-disabled opacity-50']}
                onClick={() => widget.reset()}
                className='btn btn-xs btn-narrower btn-ghost'
            >
                <span className='material-symbols-outlined'>undo</span>
            </div>
        </>
    )
})
