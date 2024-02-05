import { observer } from 'mobx-react-lite'
import { parseFloatNoRoundingErr } from 'src/utils/misc/parseFloatNoRoundingErr'

const clamp = (x: number, min: number, max: number) => Math.max(min, Math.min(max, x))

/* NOTE(bird_d): Having these here should be fine since only one slider should be dragging/active at a time? */
let startValue: number = 0
let dragged: boolean = false
let cumulativeOffset = 0
let activeSlider: HTMLDivElement | null = null
let tempValue: number = 0
let cancelled: boolean = false

export const InputNumberUI = observer(function InputNumberUI_(p: {
    value?: Maybe<number>
    mode: 'int' | 'float'
    onValueChange: (next: number) => void
    step?: number
    min?: number
    max?: number
    hideSlider?: boolean
    style?: React.CSSProperties
    placeholder?: string
}) {
    const val = p.value ?? clamp(1, p.min ?? -Infinity, p.max ?? Infinity)
    const mode = p.mode
    const step = p.step ?? (mode === 'int' ? 1 : 0.1)
    const valueIsValid = typeof val === 'number' && !isNaN(val)

    const ensureNumber = (value: number) => {
        // console.log(value / step)
        let num = mode == 'int' ? Math.round(value / step) * step : parseFloatNoRoundingErr(value, 2)

        // Ensure is number
        if (isNaN(num) || typeof num != 'number') {
            console.log(`${JSON.stringify(value)} is not a number`)
            return startValue
        }

        // Ensure ints are ints
        if (mode == 'int') num = Math.round(num)

        // Ensure in range
        num = parseFloatNoRoundingErr(clamp(num, p.min ?? -Infinity, p.max ?? Infinity), 2)

        return num
    }

    const mouseMoveListener = (e: MouseEvent) => {
        dragged = true
        cumulativeOffset += e.movementX

        let precision = (e.shiftKey ? 0.001 : 0.01) * step
        let offset = cumulativeOffset * precision

        const next = startValue + offset
        // Parse value
        let num =
            typeof next === 'string' //
                ? mode == 'int'
                    ? parseInt(next, 10)
                    : parseFloatNoRoundingErr(next, 2)
                : next

        // Snapping
        if (e.ctrlKey) {
            const inverval = e.shiftKey ? 0.1 * step : step
            num = Math.round(num / inverval) * inverval
        }

        num = ensureNumber(num)

        tempValue = num
        p.onValueChange(num)
    }

    const cancelListener = (e: MouseEvent) => {
        // Right click
        if (e.button == 2) {
            activeSlider = null
            document.exitPointerLock()
        }
    }

    const onPointerUp = (e: MouseEvent) => {
        // console.log('onPointerUp')
        if (activeSlider && !dragged) {
            // console.lo('Activating number input')
            let numberInput = activeSlider?.querySelector('input[type="number"') as HTMLInputElement

            numberInput.setAttribute('cursor', 'not-allowed')
            numberInput.setAttribute('cursor', 'none')
            numberInput.focus()
        } else {
            activeSlider = null
        }

        window.removeEventListener('mousemove', mouseMoveListener, true)
        window.removeEventListener('pointerup', onPointerUp, true)
        window.removeEventListener('pointerlockchange', onPointerLockChange, true)
        window.removeEventListener('mousedown', cancelListener, true)
        document.exitPointerLock()
    }

    const onPointerLockChange = (e: Event) => {
        // console.lo('onPointerLockChange')
        const isPointerLocked = document.pointerLockElement === activeSlider

        if (activeSlider && isPointerLocked) {
            // console.log('onPointerLockChange: IF!!!')
        } else {
            // console.log('onPointerLockChange: Else!')
            p.onValueChange(startValue)

            window.removeEventListener('mousemove', mouseMoveListener, true)
            window.removeEventListener('mousedown', cancelListener, true)
        }

        // // console.log(isPointerLocked ? 'Locked!' : 'Not Locked!')
    }

    return (
        <div className='relative-slider' tw='flex-1 select-none'>
            {/* <button class='relative flex flex-0 btn'>test</button> */}
            {/* <div tw='w-full h-full bg-white text-white decoration-white' /> */}
            <div tw='flex virtualBorder'>
                <button
                    tw='btn btn-xs'
                    onClick={(_) => {
                        let num = val - (mode === 'int' ? step : step * 0.1)
                        num = clamp(num, p.min ?? -Infinity, p.max ?? Infinity)
                        p.onValueChange(ensureNumber(num))
                    }}
                >
                    ◂
                </button>
                <div
                    tw='relative flex flex-1 select-none'
                    onWheel={(ev) => {
                        /* NOTE: This could probably divide by the length? But I'm not sure how to get the distance of 1 scroll tick.
                         * Increment/Decrement using scroll direction. */
                        if (ev.ctrlKey) {
                            let num = mode === 'int' ? step * -Math.sign(ev.deltaY) : step * -Math.sign(ev.deltaY) * 0.1
                            num = val + num

                            if (mode == 'int') {
                                num = Math.round(num)
                            } else {
                                num = parseFloatNoRoundingErr(num, 2)
                            }

                            num = clamp(num, p.min ?? -Infinity, p.max ?? Infinity)

                            p.onValueChange(num)
                        }
                    }}
                    onMouseDown={(ev) => {
                        if (ev.button != 0) {
                            return
                        }
                        // ev.currentTarget.blur()

                        // console.log('====================================================')

                        activeSlider = ev.currentTarget
                        startValue = val
                        cumulativeOffset = 0
                        dragged = false

                        window.addEventListener('mousemove', mouseMoveListener, true)
                        window.addEventListener('pointerup', onPointerUp, true)
                        window.addEventListener('pointerlockchange', onPointerLockChange, true)
                        window.addEventListener('mousedown', cancelListener, true)

                        activeSlider?.requestPointerLock()
                    }}
                >
                    {/* {valueIsValid ? null : (
                    <div className='text-red-500'>
                        Invalid value:
                        <pre>{JSON.stringify(val)}</pre>
                    </div>
                )} */}

                    <input //
                        id='sliderNumberInput'
                        type='number'
                        tw='input input-sm cursor-not-allowed pointer-events-none'
                        value={val}
                        placeholder={p.placeholder}
                        style={{
                            fontFamily: 'monospace',
                            zIndex: 2,
                            background: 'transparent',
                        }}
                        min={p.min}
                        max={p.max}
                        step={step}
                        onChange={(ev) => {
                            const next = ev.target.value
                            // parse value
                            let num =
                                typeof next === 'string' //
                                    ? mode == 'int'
                                        ? parseInt(next, 10)
                                        : parseFloat(next)
                                    : next

                            // ensure ints are ints
                            // if (mode == 'int') num = Math.round(num)
                            // console.log(tempValue)
                            tempValue = num
                            // console.log(tempValue)
                            // console.log(val)

                            p.onValueChange(tempValue)
                        }}
                        onFocus={(ev) => {
                            // console.log('onFocus')
                            let numberInput = ev.currentTarget
                            activeSlider = numberInput.parentElement as HTMLDivElement

                            numberInput.select()
                            startValue = val
                            tempValue = val

                            // numberInput.setAttribute('cursor', 'auto')
                            // numberInput.setAttribute('pointer-events', 'auto')
                        }}
                        onBlur={(ev) => {
                            // console.log('onBlur')
                            const next = ev.currentTarget.value
                            let numberInput = ev.currentTarget
                            // numberInput.setAttribute('cursor', 'not-allowed')
                            // numberInput.setAttribute('pointer-events', 'none')
                            activeSlider = null

                            if (cancelled) {
                                cancelled = false
                                p.onValueChange(startValue)
                                return
                            }

                            let num =
                                typeof next === 'string' //
                                    ? mode == 'int'
                                        ? parseInt(next, 10)
                                        : parseFloat(next)
                                    : next

                            // ensure is a number
                            if (isNaN(num) || typeof num != 'number') {
                                p.onValueChange(startValue)
                                return console.log(`${JSON.stringify(next)} is not a number`)
                            }

                            // ensure in range
                            num = clamp(num, p.min ?? -Infinity, p.max ?? Infinity)

                            // ensure ints are ints
                            if (mode == 'int') num = Math.round(num)
                            p.onValueChange(num)
                        }}
                        onKeyDown={(ev) => {
                            if (ev.key === 'Enter') {
                                ev.currentTarget.blur()
                            } else if (ev.key === 'Escape') {
                                cancelled = true
                                ev.currentTarget.blur()
                            }
                        }}
                    />
                    {/* <div tw='w-full flex flex-1 bg-white text-white decoration-white' /> */}
                    <input //Setting the value to 0
                        type='range'
                        style={{ zIndex: 1 }}
                        tw='range range-primary cursor-not-allowed pointer-events-none'
                        value={p.hideSlider ? 0 : val}
                        min={p.min}
                        max={p.max}
                        step={step * 0.01}
                    />
                </div>
                <button
                    className='btn btn-xs'
                    tw='btn btn-small'
                    onClick={(_) => {
                        let num = val + (mode === 'int' ? step : step * 0.1)
                        num = clamp(num, p.min ?? -Infinity, p.max ?? Infinity)
                        p.onValueChange(ensureNumber(num))
                    }}
                >
                    ▸
                </button>
            </div>
        </div>
    )
})
