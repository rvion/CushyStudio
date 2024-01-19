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
    const step = widget.config.step ?? (mode === 'int' ? 1 : 0.1)

    return (
        <InputNumberUI
            //
            mode={mode}
            value={value}
            hideSlider={widget.config.hideSlider}
            max={widget.config.max}
            min={widget.config.min}
            step={step}
            onValueChange={(next) => (widget.state.val = next)}
        />
    )
})
