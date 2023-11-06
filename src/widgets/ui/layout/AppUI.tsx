import { observer } from 'mobx-react-lite'
import { useSt } from 'src/widgets/FrontStateCtx'
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
