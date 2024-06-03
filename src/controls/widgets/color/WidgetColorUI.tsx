import type { Widget_color } from './WidgetColor'

import { observer } from 'mobx-react-lite'

export const WidgetColorUI = observer(function WidgetColorUI_(p: { widget: Widget_color }) {
    const widget = p.widget
    return (
        // <div>
        <input //
            value={widget.serial.value}
            type='color'
            onChange={(ev) => (widget.value = ev.target.value)}
        />
        //     <div
        //         tw={[widget.hasChanged ? undefined : 'btn-disabled opacity-50']}
        //         onClick={() => widget.reset()}
        //         className='btn btn-xs btn-narrower btn-ghost'
        //     >
        //         <Ikon.mdiUndoVariant />
        //     </div>
        // </div>
    )
})
