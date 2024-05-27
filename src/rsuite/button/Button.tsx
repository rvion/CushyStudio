import { makeAutoObservable, runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useEffect, useMemo } from 'react'

import { Frame, FrameProps } from './Frame'

class ButtonState {
    constructor(public props: FrameProps) {
        makeAutoObservable(this)
    }

    pressed: boolean = false

    press = (ev: React.MouseEvent) => {
        this.pressed = true
        window.addEventListener('pointerup', this.release, true)
    }

    release = (/* e: MouseEvent */) => {
        this.pressed = false
        window.removeEventListener('pointerup', this.release, true)
    }

    get visuallyActive() {
        return this.pressed ? !this.props.active : this.props.active
    }
}

// -------------------------------------------------
// TBD

export const Button = observer(function Button_(p: FrameProps) {
    const uist = useMemo(() => new ButtonState(p), [])

    // ensure new properties that could change during lifetime of the component stays up-to-date in the stable state.
    runInAction(() => Object.assign(uist.props, p))

    // ensure any unmounting of this component will properly clean-up
    useEffect(() => uist.release, [])

    return (
        <Frame //
            {...p}
            tw={['Button_ cursor-pointer justify-center']}
            // triggerOnPress
            onMouseDown={uist.press}
            // active={uist.pressed}
            // active={p.active}
            active={uist.visuallyActive}
        />
    )
})
