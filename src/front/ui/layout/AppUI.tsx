import { observer } from 'mobx-react-lite'
import { AppBarUI } from './AppBarUI'
import { useSt } from 'src/front/FrontStateCtx'
import { ProjectUI } from './ProjectUI'
import { MainNavBarUI } from './MainNavBarUI'

export const CushyUI = observer(function CushyUI_() {
    const st = useSt()
    return (
        <div
            // id
            id='CushyStudio'
            // shortcuts
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
                <MainNavBarUI />
                <ProjectUI />
            </div>
        </div>
    )
})
