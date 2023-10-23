import { observer } from 'mobx-react-lite'
import { InputNumber, Slider } from 'rsuite'
import { Requestable_float, Requestable_int } from 'src/controls/InfoRequest'

export type NumbericTheme = 'input' | 'slider'

export const WidgetNumUI = observer(function WidgetNumUI_(p: { req: Requestable_int | Requestable_float }) {
    const req = p.req
    const val = req.state.val
    const mode = req instanceof Requestable_int ? 'int' : 'float'
    const theme = req.input.theme ?? 'slider'
    const step = mode === 'int' ? 1 : 0.1

    const sliderUI =
        theme === 'slider' ? (
            <Slider //
                style={{ width: '10rem' }}
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
        ) : null

    const inputUI = (
        <InputNumber //
            size='sm'
            value={val}
            style={{ width: '10rem' }}
            min={req.input.min}
            max={req.input.max}
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
    )

    if (sliderUI)
        return (
            <>
                {inputUI}
                {sliderUI}
            </>
        )
    return inputUI
})
