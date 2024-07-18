import { makeAutoObservable, observable, runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useEffect, useMemo } from 'react'

import { Frame, FrameProps } from '../frame/Frame'

export const Button = observer(function Button_(
    p: FrameProps & {
        /** no contrast */
        subtle?: boolean
        /** no border */
        borderless?: boolean
        /** hue */
        hue?: number
    },
) {
    const uist = useMemo(() => new ButtonState(p), [])

    // ensure new properties that could change during lifetime of the component stays up-to-date in the stable state.
    runInAction(() => (uist.props = p))

    // ensure any unmounting of this component will properly clean-up
    useEffect(() => uist.release, [])
    const { size, look, subtle, borderless, iconSize, onClick, ...rest } = p
    return (
        <Frame //
            size={size ?? 'input'}
            look={look}
            base={{
                contrast: subtle ? 0 : uist.visuallyActive || uist.running ? 0.3 : 0.2,
                hue: p.hue,
            }}
            border={borderless ? 0 : 10}
            hover={p.disabled ? false : 3}
            // active={uist.visuallyActive}
            disabled={p.disabled}
            loading={p.loading ?? uist.running}
            tabIndex={p.tabIndex ?? -1}
            onMouseDown={uist.press}
            onClick={uist.onClick}
            iconSize={iconSize ?? '1.1rem'}
            {...rest}
            tw={[
                'inline-flex',
                'select-none',
                p.square ? null : 'px-2',
                'font-semibold',
                'ui-button',
                'rounded-sm gap-1 items-center',
                p.disabled ? null : 'cursor-pointer',
                'whitespace-nowrap',
                'justify-center',
            ]}
        />
    )
})

class ButtonState {
    pressed: boolean = false
    running: boolean = false

    constructor(public props: FrameProps) {
        makeAutoObservable(this, { props: observable.ref })
    }

    onClick = (ev: React.MouseEvent<any>) => {
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

    press = (_ev: React.MouseEvent) => {
        // prevent to run if already running
        if (this.props.disabled) return
        // prevent to run if already running (automatic behaviour when onClick return Promsies)
        if (this.running) return

        this.pressed = true
        window.addEventListener('pointerup', this.release, true)
    }

    release = (/* e: MouseEvent */) => {
        this.pressed = false
        window.removeEventListener('pointerup', this.release, true)
    }

    /** 2024-06-04 for now, "active" means "pressed or active" */
    get visuallyActive() {
        if (this.props.disabled) return false
        return this.pressed ? !this.props.active : this.props.active
    }
}
