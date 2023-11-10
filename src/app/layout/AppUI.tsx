import { observer } from 'mobx-react-lite'
import { useEffect, useRef } from 'react'
import { useSt } from 'src/state/stateContext'
import { AppBarUI } from './AppBarUI'
import { ProjectUI } from './ProjectUI'

export const CushyUI = observer(function CushyUI_() {
    const st = useSt()
    const appRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const current = appRef.current
        if (current == null) return
        function handleKeyDown(event: KeyboardEvent) {
            if (!current!.contains(document.activeElement)) current?.focus()
            if (event.key === 'w' && (event.ctrlKey || event.metaKey)) {
                event.preventDefault()
                event.stopPropagation()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        if (document.activeElement === document.body) current.focus()
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [appRef.current])

    return (
        <div
            id='CushyStudio'
            tabIndex={-1}
            ref={appRef}
            onKeyDown={st.shortcuts.processKeyDownEvent}
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

// force a few extra tailwind classNames to be included
const foo = (
    <div className='grid grid-cols-2 grid-cols-1 grid-cols-3 grid-cols-4 grid-cols-5 grid-cols-6 grid-cols-7 grid-cols-8' />
)
