import { observer } from 'mobx-react-lite'

import { Widget_string } from './WidgetString'

// UI
export const WidgetStringUI = observer(function WidgetStringUI_(p: { widget: Widget_string }) {
    const widget = p.widget
    const val = widget.value
    if (widget.config.textarea) {
        return (
            <textarea
                tw='textarea textarea-bordered textarea-sm w-full'
                placeholder={widget.config.placeHolder}
                rows={2}
                value={val}
                onChange={(ev) => {
                    widget.value = ev.target.value
                }}
            />
        )
    }
    return (
        <>
            <input
                tw='input input-sm w-full'
                type={widget.config.inputType}
                placeholder={widget.config.placeHolder}
                value={val}
                onChange={(ev) => {
                    widget.value = ev.target.value
                }}
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
