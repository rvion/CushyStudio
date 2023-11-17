import { observer } from 'mobx-react-lite'
import { InputNumberBase, Slider } from 'src/rsuite/shims'
import { Widget_float, Widget_int } from 'src/controls/Widget'
import { parseFloatNoRoundingErr } from 'src/utils/misc/parseFloatNoRoundingErr'
import { InputNumberUI } from 'src/rsuite/InputNumberUI'

export type NumbericTheme = 'input' | 'slider'

export const WidgetNumUI = observer(function WidgetNumUI_(p: { req: Widget_int | Widget_float }) {
    const req = p.req
    const val = req.state.val
    const mode = req instanceof Widget_int ? 'int' : 'float'
    const step = req.input.step ?? (mode === 'int' ? 1 : 0.1)

    return (
        <InputNumberUI
            //
            mode={mode}
            value={val}
            hideSlider={req.input.hideSlider}
            max={req.input.max}
            min={req.input.min}
            step={step}
            onValueChange={(next) => (req.state.val = next)}
        />
    )
})
