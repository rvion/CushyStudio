import { observer } from 'mobx-react-lite'
import { InputNumberBase, Slider } from 'src/rsuite/shims'
import { Widget_floatOpt, Widget_intOpt } from 'src/controls/Widget'
import { parseFloatNoRoundingErr } from 'src/utils/misc/parseFloatNoRoundingErr'

export const WidgetNumOptUI = observer(function WidgetNumOptUI_(p: { widget: Widget_intOpt | Widget_floatOpt }) {
    const req = p.widget
    const mode = req instanceof Widget_intOpt ? 'int' : 'float'
    const val = req.state.val
    const step = req.input.step ?? (mode === 'int' ? 1 : 0.1)
    const valueIsValid = typeof val === 'number' && !isNaN(val)

    return (
        <div className='flex gap-1 items-center'>
            {valueIsValid ? null : (
                <div className='text-red-500'>
                    Invalid value:
                    <pre>{JSON.stringify(val)}</pre>
                </div>
            )}
            {req.input.hideSlider ? null : (
                <Slider //
                    style={{ width: '10rem' }}
                    value={val}
                    min={req.input.min}
                    max={req.input.max}
                    step={step}
                    onChange={(ev) => {
                        const next = ev.target.value
                        // parse value
                        let num =
                            typeof next === 'string' //
                                ? mode == 'int'
                                    ? parseInt(next, 10)
                                    : parseFloatNoRoundingErr(next, 3)
                                : next

                        // ensure is a number
                        if (isNaN(num) || typeof num != 'number') {
                            return console.log(`${JSON.stringify(next)} is not a number`)
                        }
                        // ensure ints are ints
                        if (mode == 'int') num = Math.round(num)
                        req.state.val = num
                    }}
                />
            )}
            <InputNumberBase //
                disabled={!req.state.active}
                min={req.input.min}
                max={req.input.max}
                step={step}
                style={{
                    fontFamily: 'monospace',
                    width: val.toString().length + 6 + 'ch',
                }}
                _size='sm'
                value={val}
                onChange={(ev) => {
                    const next = ev.target.value
                    // parse value
                    let num =
                        typeof next === 'string' //
                            ? mode == 'int'
                                ? parseInt(next, 10)
                                : parseFloatNoRoundingErr(next, 3)
                            : next

                    // ensure is a number
                    if (isNaN(num) || typeof num != 'number') {
                        return console.log(`${JSON.stringify(next)} is not a number`)
                    }
                    // ensure ints are ints
                    if (mode == 'int') num = Math.round(num)
                    req.state.val = num
                }}
            />
        </div>
    )
})
