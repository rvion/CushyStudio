import { observer } from 'mobx-react-lite'
import { InputNumber, Slider } from 'rsuite'
import { Widget_float, Widget_int } from 'src/controls/Widget'
import { parseFloatNoRoundingErr } from 'src/utils/misc/parseFloatNoRoundingErr'

export type NumbericTheme = 'input' | 'slider'

export const WidgetNumUI = observer(function WidgetNumUI_(p: { req: Widget_int | Widget_float }) {
    const req = p.req
    const val = req.state.val
    const mode = req instanceof Widget_int ? 'int' : 'float'
    const step = req.input.step ?? (mode === 'int' ? 1 : 0.1)
    const valueIsValid = typeof val === 'number' && !isNaN(val)

    return (
        <div tw='relative flex items-center gap-2'>
            {valueIsValid ? null : (
                <div className='text-red-500'>
                    Invalid value:
                    <pre>{JSON.stringify(val)}</pre>
                </div>
            )}
            {req.input.hideSlider ? null : (
                <Slider //
                    style={{ width: '6rem' }}
                    value={val}
                    min={req.input.min}
                    max={req.input.max}
                    step={step}
                    onChange={(next) => {
                        // parse value
                        let num =
                            typeof next === 'string' //
                                ? mode == 'int'
                                    ? parseInt(next, 10)
                                    : parseFloatNoRoundingErr(next, 2)
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
            <InputNumber //
                size='sm'
                value={val}
                style={{
                    fontFamily: 'monospace',
                    width: val.toString().length + 6 + 'ch',
                }}
                // min={req.input.min}
                // max={req.input.max}
                step={step}
                onChange={(next) => {
                    // parse value
                    let num =
                        typeof next === 'string' //
                            ? mode == 'int'
                                ? parseInt(next, 10)
                                : parseFloat(next)
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
