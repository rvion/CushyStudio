import { observer } from 'mobx-react-lite'
import { useSt } from 'src/state/stateContext'
import { AppBarUI } from './AppBarUI'
import { ProjectUI } from './ProjectUI'

export const CushyUI = observer(function CushyUI_() {
    const st = useSt()
    return (
        <div
            id='CushyStudio'
            tabIndex={-1}
            onKeyDown={st.shortcuts.processKeyDownEvent}
            ref={(e) => {
                if (e == null) return
                if (!(e instanceof HTMLElement)) return
                if (document.activeElement === document.body) e.focus()
            }}
            // global style
            tw={['col grow h100', st.theme.theme]}
        >
            <AppBarUI />
            <div className='flex flex-grow relative'>
                <ProjectUI />
            </div>
        </div>
    )
})

const foo = (
    <div className='grid grid-cols-2 grid-cols-1 grid-cols-3 grid-cols-4 grid-cols-5 grid-cols-6 grid-cols-7 grid-cols-8' />
)
