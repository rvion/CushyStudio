import { observer } from 'mobx-react-lite'
import { ReactNode } from 'react'
import { InputNumber, Slider, Toggle } from 'rsuite'
import { Requestable_floatOpt, Requestable_intOpt } from 'src/controls/InfoRequest'

export const WidgetNumOptUI = observer(function WidgetNumOptUI_(p: { req: Requestable_intOpt | Requestable_floatOpt }) {
    const req = p.req
    const mode = req instanceof Requestable_intOpt ? 'int' : 'float'
    const val = req.state.val
    const step = req.input.step ?? (mode === 'int' ? 1 : 0.1)
    const theme = req.input.theme ?? 'slider'

    const children: ReactNode[] = []
    if (theme === 'slider')
        children.push(
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
            />,
        )

    return (
        <div className='flex gap-1'>
            <Toggle
                // size='sm'
                checked={req.state.active}
                onChange={(t) => (req.state.active = t)}
            />
            <InputNumber //
                disabled={!req.state.active}
                min={req.input.min}
                max={req.input.max}
                step={step}
                size='sm'
                value={val}
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
            {children}
        </div>
    )
})
