import { observer } from 'mobx-react-lite'

export const WelcomeScreenUI = observer(function WelcomeScreenUI_(p: { children: React.ReactNode }) {
    return (
        <div className='welcome-screen rainbowbg'>
            <div className='welcome-popup col gap items-center'>{p.children}</div>
        </div>
    )
})
