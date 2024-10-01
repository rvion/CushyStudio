import { makeAutoObservable, observable, runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useEffect, useMemo } from 'react'

import { Frame, FrameProps } from '../frame/Frame'
import { withDefaultProps } from './withDefaultProps'

const buttonContrastWhenPressed: number = 0.13 // 30%
const buttonContrast: number = 0.08 // 20%

export type ButtonProps = FrameProps & {
    /** no contrast */
    subtle?: boolean
    /** no border */
    borderless?: boolean
    /** hue */
    hue?: number
    chroma?: number
}

const _Button = observer(function Button_(p: ButtonProps) {
    const uist = useMemo(() => new ButtonState(p), [])

    // ensure new properties that could change during lifetime of the component stays up-to-date in the stable state.
    runInAction(() => (uist.props = p))

    // ensure any unmounting of this component will properly clean-up
    useEffect(() => uist.release, [])

    const { size, look, subtle, borderless, iconSize, onClick, ...rest } = p
    const theme = cushy.theme.value
    const csuite = cushy.csuite

    return (
        <Frame //
            as='button'
            size={size ?? 'input'}
            look={look}
            boxShadow={
                uist.visuallyActive || p.subtle || p.borderless //
                    ? undefined
                    : { inset: true, y: -3, blur: 5, spread: 0, color: 5 }
            }
            base={{
                contrast: subtle //
                    ? 0
                    : uist.visuallyActive || uist.running
                      ? buttonContrastWhenPressed
                      : buttonContrast,
                hue: p.hue,
                chroma: p.chroma,
            }}
            border={borderless ? 0 : csuite.inputBorder}
            hover={p.disabled ? false : 3}
            // active={uist.visuallyActive}
            disabled={p.disabled}
            dropShadow={p.subtle ? undefined : (p.dropShadow ?? theme.inputShadow)}
            roundness={theme.inputRoundness}
            loading={p.loading ?? uist.running}
            tabIndex={p.tabIndex}
            onMouseDown={uist.press}
            onClick={uist.onClick}
            iconSize={iconSize ?? '1.1rem'}
            {...rest}
            tw={[
                'inline-flex',
                'select-none',

                // 💬 2024-07-30 rvion: let's make sure the default theme is good for prototyping;
                // | no nee to add too much padding, this can be themed by CSS
                p.square ? null : 'px-1',

                // 💬 2024-07-30 rvion: let's leave the themeing to somewhere else;
                // | if people want semibold or bold buttons, they can do so using the ui-button class
                // | 'font-semibold',

                'ui-button',
                'gap-1 items-center',
                p.disabled ? 'cursor-not-allowed' : 'cursor-pointer',
                'whitespace-nowrap',
                'justify-center',
            ]}
        />
    )
})

export class ButtonState {
    pressed: boolean = false
    running: boolean = false

    constructor(public props: Pick<FrameProps, 'disabled' | 'onClick' | 'active'>) {
        makeAutoObservable(this, { props: observable.ref })
    }

    onClick = (ev: React.MouseEvent<any>): void => {
        // prevent to run if already running
        if (this.props.disabled) return
        // prevent to run if already running (automatic behaviour when onClick return Promsies)
        if (this.running) return

        if (this.props.onClick) {
            const res = this.props.onClick(ev)
            if (res == null) return
            if (res instanceof Promise) {
                // mark as running
                runInAction(() => (this.running = true))
                void res.finally(() => runInAction(() => (this.running = false)))
            } else {
            }
        }
    }

    press = (_ev: React.MouseEvent): void => {
        // prevent to run if already running
        if (this.props.disabled) return
        // prevent to run if already running (automatic behaviour when onClick return Promsies)
        if (this.running) return

        this.pressed = true
        window.addEventListener('pointerup', this.release, true)
    }

    release = (/* e: MouseEvent */): void => {
        this.pressed = false
        window.removeEventListener('pointerup', this.release, true)
    }

    /** 2024-06-04 for now, "active" means "pressed or active" */
    get visuallyActive(): Maybe<boolean> {
        if (this.props.disabled) return false
        return this.pressed ? !this.props.active : this.props.active
    }
}

export const Button = Object.assign(_Button, {
    /** a borderless / contrastless button */
    Ghost: withDefaultProps(_Button, { borderless: true, subtle: true }),
})

// registerComponentAsClonableWhenInsideReveal(Button)
