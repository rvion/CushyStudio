import { Animation } from 'rsuite'
import { observer } from 'mobx-react-lite'
import { useMemo, useState } from 'react'
import * as I from '@rsuite/icons'

export const TroubleShootinInstructionsUI = observer(function TroubleShootinInstructionsUI_(p: {}) {
    const [visible, setVisible] = useState(false)
    useMemo(() => {
        setTimeout(() => setVisible(true), 2000)
    }, [])
    return (
        <div style={{ maxWidth: '20rem' }}>
            {visible && (
                <FancyText
                    message='If this keeps spinning forever, please, open the debug console (ctrl+shift+i or cmd+option+i) and contact
                    @rvion with errors you see here 🙏'
                />
            )}
        </div>
    )
})

const FancyText = (p: { message: string }) => {
    // const props = useSpring({
    //     from: { opacity: 0, transform: 'translate3d(0,-20px,0)' },
    //     to: { opacity: 1, transform: `translate3d(0,0px,0)` },
    // })
    return (
        <Animation.Bounce in={true}>
            <h3 className='row gap baseline'>
                <I.WarningRound /> Issue loading ?
            </h3>
            <div>{p.message}</div>
        </Animation.Bounce>
    )
}
