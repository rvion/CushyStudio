import { Title3 } from '@fluentui/react-components'
import * as I from '@fluentui/react-icons'
import { animated, useSpring } from '@react-spring/web'
import { observer } from 'mobx-react-lite'
import { useMemo, useState } from 'react'

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
    const props = useSpring({
        from: { opacity: 0, transform: 'translate3d(0,-20px,0)' },
        to: { opacity: 1, transform: `translate3d(0,0px,0)` },
    })
    return (
        <animated.div style={props}>
            <Title3 className='row gap baseline'>
                <I.Warning24Regular /> Issue loading ?
            </Title3>
            <div>{p.message}</div>
        </animated.div>
    )
}
