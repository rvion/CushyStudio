import { observer } from 'mobx-react-lite'
import { InputNumberBase, Slider } from 'src/rsuite/shims'
import { Widget_float, Widget_int } from 'src/controls/Widget'
import { parseFloatNoRoundingErr } from 'src/utils/misc/parseFloatNoRoundingErr'
import { InputNumberUI } from 'src/rsuite/InputNumberUI'

export type NumbericTheme = 'input' | 'slider'

export const WidgetNumUI = observer(function WidgetNumUI_(p: { widget: Widget_int | Widget_float }) {
    const widget = p.widget
    const value = widget.state.val
    const mode = widget instanceof Widget_int ? 'int' : 'float'
    const step = widget.input.step ?? (mode === 'int' ? 1 : 0.1)

    return (
        <InputNumberUI
            //
            mode={mode}
            value={value}
            hideSlider={widget.input.hideSlider}
            max={widget.input.max}
            min={widget.input.min}
            step={step}
            onValueChange={(next) => (widget.state.val = next)}
        />
    )
})
