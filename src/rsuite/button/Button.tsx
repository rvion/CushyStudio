import { makeAutoObservable, runInAction } from 'mobx'
import { CushyKit } from '../../controls/shared/CushyKit'
import { ButtonProps, Frame } from './Frame'
import { observer } from 'mobx-react-lite'
import { useCushyKitOrNull } from '../../controls/shared/CushyKitCtx'
import { useEffect, useMemo } from 'react'

class ButtonState {
    constructor(
        //
        public props: ButtonProps,
        public kit: Maybe<CushyKit>, // Not sure how to implement this
    ) {
        makeAutoObservable(this)
    }

    active: boolean = false

    onPointerUpListener = (/* e: MouseEvent */) => {
        this.active = false
        window.removeEventListener('pointerup', this.onPointerUpListener, true)
    }
}

// -------------------------------------------------
// TBD

export const Button = observer(function Button_(p: ButtonProps) {
    const kit = useCushyKitOrNull()
    const uist = useMemo(() => new ButtonState(p, kit), [])

    // ensure new properties that could change during lifetime of the component stays up-to-date in the stable state.
    runInAction(() => Object.assign(uist.props, p))

    // ensure any unmounting of this component will properly clean-up
    useEffect(() => uist.onPointerUpListener, [])

    return (
        <Frame //
            {...p}
            onMouseDown={(ev) => {
                uist.active = true
                window.addEventListener('pointerup', uist.onPointerUpListener, true)
            }}
            // onClick={p.props.onClick}
            active={uist.active}
        />
    )
})
