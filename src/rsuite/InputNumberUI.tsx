import { observable, runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { useSt } from 'src/state/stateContext'
import { parseFloatNoRoundingErr } from 'src/utils/misc/parseFloatNoRoundingErr'

const clamp = (x: number, min: number, max: number) => Math.max(min, Math.min(max, x))

/* NOTE(bird_d): Having these here should be fine since only one slider should be dragging/active at a time? */
let startValue: number = 0
let dragged: boolean = false
let cumulativeOffset = 0
let activeSlider: HTMLDivElement | null = null
let cancelled: boolean = false

export const InputNumberUI = observer(function InputNumberUI_(p: {
    value?: Maybe<number>
    mode: 'int' | 'float'
    onValueChange: (next: number) => void
    step?: number
    min?: number
    max?: number
    softMin?: number
    softMax?: number
    text?: string
    suffix?: string
    hideSlider?: boolean
    style?: React.CSSProperties
    placeholder?: string
    forceSnap?: boolean
    className?: string
}) {
    const val = p.value ?? clamp(1, p.min ?? -Infinity, p.max ?? Infinity)
    const mode = p.mode
    const step = p.step ?? (mode === 'int' ? 1 : 0.1)
    const forceSnap = p.forceSnap ?? false
    const rangeMin = p.softMin ?? p.min ?? -Infinity
    const rangeMax = p.softMax ?? p.max ?? Infinity

    const numberSliderSpeed = useSt().configFile.get('numberSliderSpeed') ?? 1

    /* Used for making sure you can type whatever you want in to the value, but it gets validated when pressing Enter. */
    const [inputValue, setInputValue] = useState<string>(val.toString())
    /* When editing the number <input> this will make it display inputValue instead of val.*/
    const [isEditing, setEditing] = useState<boolean>(false)

    // make sure we retrieve the `onValueChange` lambda from the latest prop version
    const [latestProps] = useState(() => observable({ onValueChange: p.onValueChange }))
    useEffect(() => runInAction(() => void (latestProps.onValueChange = p.onValueChange)), [p.onValueChange])

    const syncValues = (value: number | string, soft: boolean = false) => {
        let num =
            typeof value === 'string' //
                ? mode == 'int'
                    ? parseInt(value, 10)
                    : parseFloat(value)
                : value

        // Ensure is number
        if (isNaN(num) || typeof num != 'number') {
            console.log(`${JSON.stringify(value)} is not a number`)
            return startValue
        }

        if (forceSnap) {
            num = mode == 'int' ? Math.round(num / step) * step : parseFloatNoRoundingErr(num, 2)
        }

        // Ensure ints are ints
        if (mode == 'int') num = Math.round(num)

        // Ensure in range
        if (soft && startValue <= rangeMax && startValue >= rangeMin) {
            num = parseFloatNoRoundingErr(clamp(num, rangeMin, rangeMax), 2)
        } else {
            num = parseFloatNoRoundingErr(clamp(num, p.min ?? -Infinity, p.max ?? Infinity), 2)
        }

        latestProps.onValueChange(num)
        setInputValue(num.toString())
    }

    const mouseMoveListener = (e: MouseEvent) => {
        dragged = true
        cumulativeOffset += e.movementX

        let precision = (e.shiftKey ? 0.001 : 0.01) * step
        let offset = numberSliderSpeed * cumulativeOffset * precision

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

        syncValues(num, true)
    }

    const cancelListener = (e: MouseEvent) => {
        // Right click
        if (e.button == 2) {
            activeSlider = null
            document.exitPointerLock()
        }
    }

    const onPointerUpListener = (e: MouseEvent) => {
        if (activeSlider && !dragged) {
            let textInput = activeSlider?.querySelector('input[type="text"') as HTMLInputElement

            textInput.setAttribute('cursor', 'not-allowed')
            textInput.setAttribute('cursor', 'none')
            textInput.focus()
        } else {
            activeSlider = null
        }

        window.removeEventListener('mousemove', mouseMoveListener, true)
        window.removeEventListener('pointerup', onPointerUpListener, true)
        window.removeEventListener('pointerlockchange', onPointerLockChange, true)
        window.removeEventListener('mousedown', cancelListener, true)
        document.exitPointerLock()
    }

    const onPointerLockChange = (e: Event) => {
        const isPointerLocked = document.pointerLockElement === activeSlider

        if (!(activeSlider && isPointerLocked)) {
            window.removeEventListener('mousemove', mouseMoveListener, true)
            window.removeEventListener('mousedown', cancelListener, true)

            syncValues(startValue)
        }
    }

    return (
        <div
            //
            className={p.className}
            tw='relative-slider flex-1 select-none min-w-16'
        >
            <div tw='relative w-full flex'>
                <progress
                    style={{ zIndex: 1 }}
                    tw='range range-primary cursor-not-allowed pointer-events-none'
                    value={p.hideSlider ? 0 : val - rangeMin}
                    max={rangeMax - rangeMin}
                ></progress>

                <div tw='absolute w-full rounded-sm flex'>
                    <button
                        tw='btn btn-xs absolute left-0'
                        style={{ zIndex: 2 }}
                        onClick={(_) => {
                            startValue = val
                            let num = val - (mode === 'int' ? step : step * 0.1)
                            syncValues(num, true)
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
                                num = mode == 'int' ? Math.round(num) : parseFloatNoRoundingErr(num, 2)
                                num = clamp(num, p.min ?? -Infinity, p.max ?? Infinity)
                                syncValues(num)
                            }
                        }}
                        onMouseDown={(ev) => {
                            if (ev.button != 0) {
                                return
                            }

                            /* Begin slider drag */
                            activeSlider = ev.currentTarget
                            startValue = val
                            cumulativeOffset = 0
                            dragged = false

                            window.addEventListener('mousemove', mouseMoveListener, true)
                            window.addEventListener('pointerup', onPointerUpListener, true)
                            window.addEventListener('pointerlockchange', onPointerLockChange, true)
                            window.addEventListener('mousedown', cancelListener, true)

                            /* Fix for low-sensitivity devices, it will get raw input from the mouse instead of the processed input.
                             *  NOTE: This does not work on Linux right now, but when it does get added for Linux, this code should not need to be changed.
                             */
                            // @ts-ignore 🔴 untyped for me for now; TODO: will have to investigate why
                            activeSlider?.requestPointerLock({ unadjustedMovement: true }).catch((error) => {
                                console.log(
                                    '[InputNumberUI] Obtaining raw mouse input is not supported on this platform. Using processed mouse input, you may need to adjust the number input drag multiplier.',
                                )
                                activeSlider?.requestPointerLock()
                            })
                        }}
                    >
                        <div className='text-container' tw='flex'>
                            {!isEditing && p.text ? (
                                <div tw='primary-content outline-0 border-0 border-transparent z-10 w-full text-left'>
                                    {p.text}
                                </div>
                            ) : null}
                            <input //
                                type='text'
                                tw={
                                    !isEditing && p.text
                                        ? 'text-right cursor-not-allowed pointer-events-none'
                                        : 'text-center cursor-not-allowed pointer-events-none'
                                }
                                value={isEditing ? inputValue : val}
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
                                    setInputValue(ev?.target.value)
                                }}
                                onFocus={(ev) => {
                                    let textInput = ev.currentTarget
                                    activeSlider = textInput.parentElement as HTMLDivElement

                                    textInput.select()
                                    startValue = val
                                    setInputValue(val.toString())
                                    setEditing(true)
                                }}
                                onBlur={(ev) => {
                                    setEditing(false)
                                    const next = ev.currentTarget.value
                                    activeSlider = null

                                    if (cancelled) {
                                        cancelled = false
                                        syncValues(startValue)
                                        return
                                    }

                                    syncValues(ev.currentTarget.value)
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
                            {!isEditing && p.suffix ? <div style={{ zIndex: 2, paddingLeft: 3 }}>{p.suffix}</div> : <></>}
                        </div>
                        {/* <input //Setting the value to 0
                        type='range'
                        style={{ zIndex: 1 }}
                        tw='range range-primary cursor-not-allowed pointer-events-none'
                        value={p.hideSlider ? 0 : val}
                        min={rangeMin}
                        max={rangeMax}
                        step={step * 0.01}
                        readOnly
                    /> */}
                    </div>
                    <button
                        className='btn btn-xs'
                        tw='btn btn-small absolute right-0'
                        style={{ zIndex: 2 }}
                        onClick={(_) => {
                            startValue = val
                            let num = val + (mode === 'int' ? step : step * 0.1)
                            syncValues(num, true)
                        }}
                    >
                        ▸
                    </button>
                </div>
            </div>
        </div>
    )
})
