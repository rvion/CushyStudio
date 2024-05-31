import { makeAutoObservable, observable, runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useEffect, useMemo } from 'react'

import { Frame, FrameProps } from '../frame/Frame'

export const Button = observer(function Button_(p: FrameProps) {
    const uist = useMemo(() => new ButtonState(p), [])
    // ensure new properties that could change during lifetime of the component stays up-to-date in the stable state.
    runInAction(() => (uist.props = p))
    // ensure any unmounting of this component will properly clean-up
    useEffect(() => uist.release, [])
    const { size, look: appearance, ...rest } = p
    return (
        <Frame //
            size={size ?? 'sm'}
            base={5}
            border={18}
            hover={p.disabled ? false : undefined}
            active={uist.visuallyActive}
            loading={p.loading}
            tabIndex={p.tabIndex ?? -1}
            {...rest}
            tw={[
                'ui-button',
                'rounded-md flex gap-2 items-center',
                p.disabled ? null : 'cursor-pointer',
                'justify-center rounded',
            ]}
            onMouseDown={uist.press}
        />
    )
})

class ButtonState {
    pressed: boolean = false
    constructor(public props: FrameProps) {
        makeAutoObservable(this, { props: observable.ref })
    }

    press = (_ev: React.MouseEvent) => {
        this.pressed = true
        window.addEventListener('pointerup', this.release, true)
    }
    release = (/* e: MouseEvent */) => {
        this.pressed = false
        window.removeEventListener('pointerup', this.release, true)
    }
    get visuallyActive() {
        if (this.props.disabled) return false
        return this.pressed ? !this.props.active : this.props.active
    }
}
