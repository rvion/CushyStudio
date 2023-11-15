import { observer } from 'mobx-react-lite'
import { useEffect, useRef } from 'react'
import { useSt } from 'src/state/stateContext'
import { AppBarUI } from '../appbar/AppBarUI'
import { ProjectUI } from './ProjectUI'
import { Trigger } from '../shortcuts/Trigger'
import { RenderFullPagePanelUI } from 'src/panels/router/RenderFullPagePanelUI'

export const CushyUI = observer(function CushyUI_() {
    const st = useSt()
    const appRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const current = appRef.current
        if (current == null) return
        function handleKeyDown(event: KeyboardEvent) {
            const x = st.shortcuts.processKeyDownEvent(event as any)

            if (x === Trigger.Success) {
                event.preventDefault()
                event.stopPropagation()
                return
            }

            // no idea if this safety case is needed
            if (document.activeElement == null) {
                event.preventDefault()
                event.stopPropagation()
                current?.focus()
            }

            // prevent accidental tab closing when pressing ctrl+w one too-many times
            if (
                x === Trigger.UNMATCHED_CONDITIONS && //
                event.key === 'w' &&
                (event.ctrlKey || event.metaKey)
            ) {
                event.preventDefault()
                event.stopPropagation()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        if (document.activeElement === document.body) current.focus()
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [appRef.current, st])

    return (
        <div data-theme={st.themeMgr.theme} id='CushyStudio' tabIndex={-1} ref={appRef} tw={['col grow h100']}>
            <AppBarUI />
            <RenderFullPagePanelUI />
            <div className='flex flex-grow relative'>
                <ProjectUI />
            </div>
        </div>
    )
})

// force a few extra tailwind classNames to be included
const foo = (
    <div className='grid grid-cols-2 grid-cols-1 grid-cols-3 grid-cols-4 grid-cols-5 grid-cols-6 grid-cols-7 grid-cols-8' />
)
