import './InputNumberUI.css'

import { makeAutoObservable, runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import React, { useEffect, useMemo } from 'react'

import { parseFloatNoRoundingErr } from '../../../utils/misc/parseFloatNoRoundingErr'

const clamp = (x: number, min: number, max: number) => Math.max(min, Math.min(max, x))

/* NOTE(bird_d): Having these here should be fine since only one slider should be dragging/active at a time? */
let startValue = 0
let dragged = false
let cumulativeOffset = 0
let lastShiftState = false
let lastControlState = false
let lastValue = 0
let activeSlider: HTMLDivElement | null = null
let cancelled = false

type InputNumberProps = {
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
    debug?: string
    hideSlider?: boolean
    style?: React.CSSProperties
    placeholder?: string
    forceSnap?: boolean
    className?: string
}

/** this class will be instanciated ONCE in every InputNumberUI, (local the the InputNumberUI) */
class InputNumberStableState {
    constructor(public props: InputNumberProps) {
        // this `makeAutoObservable` will make all getters defined below be `computed` properties
        // they will update their value when props change so all functions always work with up-to-date values
        makeAutoObservable(this)
    }

    get value() { return this.props.value ?? clamp(1, this.props.min ?? -Infinity, this.props.max ?? Infinity) } // prettier-ignore
    get mode() { return this.props.mode } // prettier-ignore
    get step() { return this.props.step ?? (this.mode === 'int' ? 1 : 0.1) } // prettier-ignore
    get rounding() { return Math.ceil(-Math.log10(this.step * 0.01)) } // prettier-ignore
    get forceSnap() { return this.props.forceSnap ?? false } // prettier-ignore
    get rangeMin() { return this.props.softMin ?? this.props.min ?? -Infinity } // prettier-ignore
    get rangeMax() { return this.props.softMax ?? this.props.max ?? Infinity } // prettier-ignore
    get numberSliderSpeed() { return cushy.configFile.get('numberSliderSpeed') ?? 1 } // prettier-ignore
    get isInteger() { return this.mode === 'int' } // prettier-ignore

    /* Used for making sure you can type whatever you want in to the value, but it gets validated when pressing Enter. */
    inputValue: string = this.value.toString()

    /* When editing the number <input> this will make it display inputValue instead of val.*/
    isEditing: boolean = false

    inputRef = React.createRef<HTMLInputElement>()

    syncValues = (
        //
        value: number | string,
        opts: { soft?: boolean; roundingModifier?: number; skipRounding?: boolean } = {},
    ) => {
        const soft = opts.soft ?? false
        const roundingModifier = opts.roundingModifier ?? 1
        const skipRounding = opts.skipRounding ?? false
        let num =
            typeof value === 'string' //
                ? this.mode == 'int'
                    ? parseInt(value, 10)
                    : parseFloat(value)
                : value

        // Ensure is number
        if (isNaN(num) || typeof num != 'number') {
            console.log(`${JSON.stringify(value)} is not a number`)
            return startValue
        }

        // snap integer value ?? (🔴 probably wrong logic here; why only ints ?)
        if (this.forceSnap) {
            num =
                this.mode == 'int' //
                    ? Math.round(num / this.step) * this.step
                    : num
        }

        // Ensure value is integer if mode === 'int'
        if (this.mode === 'int') num = Math.round(num)

        // Ensure value in range
        if (soft && startValue <= this.rangeMax && startValue >= this.rangeMin) {
            num = clamp(num, this.rangeMin, this.rangeMax)
        } else {
            num = clamp(num, this.props.min ?? -Infinity, this.props.max ?? Infinity)
        }

        // ...
        if (!skipRounding) {
            const roundingPrecise = Math.ceil(-Math.log10(this.step * 0.01 * roundingModifier))
            num = parseFloatNoRoundingErr(num, roundingPrecise)
        }

        // console.log(`[onValueChange] (${reason}) p.debug = ${this.props.debug} | NEW = ${num}`)
        this.props.onValueChange(num)
        this.inputValue = num.toString()
    }

    increment = () => {
        startValue = this.value
        let num = this.value + (this.isInteger ? this.step : this.step * 0.1)
        this.syncValues(num, { soft: true })
    }

    decrement = () => {
        startValue = this.value
        let num = this.value - (this.isInteger ? this.step : this.step * 0.1)
        this.syncValues(num, { soft: true })
    }

    mouseMoveListener = (e: MouseEvent) => {
        // reset origin if change shift or control key while drag (to let already applied changes remain)
        if (dragged && (lastShiftState !== e.shiftKey || lastControlState !== e.ctrlKey)) {
            startValue = lastValue
            cumulativeOffset = 0
        }

        dragged = true
        cumulativeOffset += e.movementX

        let precision = (e.shiftKey ? 0.001 : 0.01) * this.step
        let offset = this.numberSliderSpeed * cumulativeOffset * precision

        const next = startValue + offset
        // Parse value
        let num =
            typeof next === 'string' //
                ? this.mode == 'int'
                    ? parseInt(next, 10)
                    : parseFloatNoRoundingErr(next, this.rounding)
                : next

        // Snapping
        if (e.ctrlKey) {
            const inverval = e.shiftKey ? 0.1 * this.step : this.step
            num = Math.round(num / inverval) * inverval
        }

        lastShiftState = e.shiftKey
        lastControlState = e.ctrlKey
        lastValue = num
        this.syncValues(num, { soft: true, roundingModifier: e.shiftKey ? 0.01 : 1 })
    }

    cancelListener = (e: MouseEvent) => {
        // Right click
        if (e.button == 2) {
            activeSlider = null
            document.exitPointerLock()
        }
    }

    onPointerUpListener = (/* e: MouseEvent */) => {
        if (activeSlider && !dragged) {
            this.inputRef.current?.focus()
        } else {
            activeSlider = null
        }

        // pointer
        window.removeEventListener('pointerup', this.onPointerUpListener, true)
        window.removeEventListener('pointerlockchange', this.onPointerLockChange, true)
        // mouse
        window.removeEventListener('mousemove', this.mouseMoveListener, true)
        window.removeEventListener('mousedown', this.cancelListener, true)
        // lock
        document.exitPointerLock()
    }

    onPointerLockChange = (e: Event) => {
        const isPointerLocked = document.pointerLockElement === activeSlider

        if (!(activeSlider && isPointerLocked)) {
            window.removeEventListener('mousemove', this.mouseMoveListener, true)
            window.removeEventListener('mousedown', this.cancelListener, true)
            this.syncValues(startValue)
        }
    }
}

export const InputNumberUI = observer(function InputNumberUI_(p: InputNumberProps) {
    // create stable state, that we can programmatically mutate witout caring about stale references
    const uist = useMemo(() => new InputNumberStableState(p), [])

    // ensure new properties that could change during lifetime of the component stays up-to-date in the stable state.
    runInAction(() => Object.assign(uist.props, p))

    // ensure any unmounting of this component will properly clean-up
    useEffect(() => uist.onPointerUpListener, [])

    // to minimize diff with previous code
    const val = uist.value
    const step = uist.step
    const rounding = uist.rounding
    const isEditing = uist.isEditing

    return (
        <div /* Root */
            className={p.className}
            tw={[
                'WIDGET-FIELD relative',
                'input-number-ui input-number-roundness',
                'flex-1 select-none min-w-16 cursor-ew-resize overflow-clip',
                'bg-primary/30 border border-base-100 border-b-2 border-b-base-200',
                !isEditing && 'hover:border-base-200 hover:border-b-base-300 hover:bg-primary/40',
            ]}
            onWheel={(ev) => {
                /* NOTE: This could probably divide by the length? But I'm not sure how to get the distance of 1 scroll tick.
                 * Increment/Decrement using scroll direction. */
                if (ev.ctrlKey) {
                    let num = uist.isInteger ? step * -Math.sign(ev.deltaY) : step * -Math.sign(ev.deltaY) * 0.1
                    num = val + num
                    num = uist.isInteger ? Math.round(num) : parseFloatNoRoundingErr(num, rounding)
                    num = clamp(num, p.min ?? -Infinity, p.max ?? Infinity)
                    uist.syncValues(num, undefined)
                }
            }}
        >
            <div /* Slider display */
                className='inui-foreground'
                tw={[
                    //
                    'absolute left-0 WIDGET-FIELD',
                    !p.hideSlider && !isEditing && 'bg-primary/40',
                    'z-10',
                ]}
                style={{ width: `${((val - uist.rangeMin) / (uist.rangeMax - uist.rangeMin)) * 100}%` }}
            />

            <div tw='grid w-full h-full items-center z-20' style={{ gridTemplateColumns: '16px 1fr 16px' }}>
                <button /* Left Button */
                    tw={[
                        'h-full flex rounded-none text-center justify-center items-center z-20',
                        `border border-base-200 opacity-0 bg-base-200 hover:brightness-125`,
                    ]}
                    tabIndex={-1}
                    onClick={uist.decrement}
                >
                    <span className='material-symbols-outlined'>arrow_left</span>
                </button>

                <div /* Text Container */
                    tw={[
                        //
                        `flex px-1 items-center justify-center text-sm text-shadow truncate z-20`,
                    ]}
                    onMouseDown={(ev) => {
                        if (isEditing || ev.button != 0) return

                        /* Begin slider drag */
                        activeSlider = ev.currentTarget
                        startValue = val
                        cumulativeOffset = 0
                        dragged = false

                        window.addEventListener('mousemove', uist.mouseMoveListener, true)
                        window.addEventListener('pointerup', uist.onPointerUpListener, true)
                        window.addEventListener('pointerlockchange', uist.onPointerLockChange, true)
                        window.addEventListener('mousedown', uist.cancelListener, true)

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
                    <input //
                        type='text'
                        draggable='false'
                        ref={uist.inputRef}
                        onDragStart={(ev) => ev.preventDefault()} // Prevents drag n drop of selected text, so selecting is easier.
                        tw={[
                            'text-shadow outline-0',
                            /* `absolute opacity-0` is a bit of a hack around not being able to figure out why the input kept taking up so much width.
                             * Can't use `hidden` here because it messes up focusing. */
                            !isEditing && 'cursor-not-allowed pointer-events-none absolute opacity-0',
                            !isEditing && p.text ? 'text-right' : 'text-center',
                        ]}
                        value={isEditing ? uist.inputValue : val}
                        placeholder={p.placeholder}
                        style={{
                            fontFamily: 'monospace',
                            zIndex: 2,
                            background: 'transparent',
                            MozWindowDragging: 'no-drag',
                        }}
                        min={p.min}
                        max={p.max}
                        step={step}
                        onChange={(ev) => {
                            uist.inputValue = ev?.target.value
                        }}
                        onFocus={(ev) => {
                            let textInput = ev.currentTarget
                            activeSlider = textInput.parentElement as HTMLDivElement
                            textInput.select()
                            startValue = val
                            uist.inputValue = val.toString()
                            uist.isEditing = true
                        }}
                        onBlur={(ev) => {
                            uist.isEditing = false
                            const next = ev.currentTarget.value
                            activeSlider = null
                            if (cancelled) {
                                cancelled = false
                                uist.syncValues(startValue, undefined)
                                return
                            }
                            uist.syncValues(ev.currentTarget.value, { skipRounding: true })
                        }}
                        onKeyDown={(ev) => {
                            if (ev.key === 'Enter') {
                                ev.currentTarget.blur()
                            } else if (ev.key === 'Escape') {
                                cancelled = true
                                ev.currentTarget.blur()
                            }

                            /* Since we removed tabbing to buttons, we want up and down to increment/decrement.
                             * I don't think people actually use up and down to maneuver to the beginning/end of a single line, more likely using home/end so this should be fine. */
                            if (uist.isEditing) {
                                if (ev.key === 'ArrowUp') {
                                    uist.increment()
                                    ev.preventDefault()
                                } else if (ev.key === 'ArrowDown') {
                                    uist.decrement()
                                    ev.preventDefault()
                                } else {
                                    // 💬 2024-03-11 rvion: we just stop propagation here,
                                    // | just in case parents (e.g. unified canvas) have
                                    // | dedicated shortcuts for single letter or singler digit key
                                    ev.stopPropagation()
                                }
                            }
                        }}
                    />
                    {!isEditing && (
                        <>
                            {p.text && (
                                <div /* Inner Label Text - Not shown while editing */
                                    tw={['w-full pr-1 outline-0 border-0 border-transparent z-10 text-left truncate']}
                                >
                                    {p.text}
                                </div>
                            )}
                            {/* I couldn't make the input not take up a ton of space so I'm just using this when we're not editing now. */}
                            <div style={{ fontFamily: 'monospace' }}>{p.value}</div>
                            {!isEditing && p.suffix ? <div tw='pl-0.5'>{p.suffix}</div> : <></>}
                        </>
                    )}
                </div>

                <button /* Right Button */
                    tw={[
                        'h-full flex rounded-none text-center justify-center items-center z-20',
                        `border border-base-200 opacity-0 bg-base-200 hover:brightness-125`,
                    ]}
                    tabIndex={-1}
                    onClick={uist.increment}
                >
                    <span className='material-symbols-outlined'>arrow_right</span>
                </button>
            </div>
        </div>
    )
})
