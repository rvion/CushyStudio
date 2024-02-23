import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useEffect, useRef } from 'react'

import { AppBarUI } from '../appbar/AppBarUI'
import { Trigger } from '../shortcuts/Trigger'
import { FavBarUI } from './FavBar'
import { ProjectUI } from './ProjectUI'
import { AppIllustrationUI } from 'src/cards/fancycard/AppIllustrationUI'
import { DraftIllustrationUI } from 'src/cards/fancycard/DraftIllustration'
import { RenderFullPagePanelUI } from 'src/panels/router/RenderFullPagePanelUI'
import { RevealState } from 'src/rsuite/reveal/RevealState'
import { useSt } from 'src/state/stateContext'

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
        <div
            //
            data-theme={st.themeMgr.theme}
            id='CushyStudio'
            tabIndex={-1}
            onClick={(ev) => {
                // if a click has bubbled outwards up to the body, then we want to close various things
                // such as contet menus, tooltips, Revals, etc.
                runInAction(() => {
                    RevealState.shared.current?.close()
                    RevealState.shared.current = null
                })
            }}
            ref={appRef}
            tw={['col grow h100 text-base-content']}
        >
            <div id='tooltip-root' tw='pointer-events-none absolute inset-0 w-full h-full'></div>
            <AppBarUI />
            <RenderFullPagePanelUI />
            <div className='flex flex-grow relative'>
                <FavBarUI direction='column' />
                <ProjectUI />
            </div>
        </div>
    )
})

// force a few extra tailwind classNames to be included
const foo = (
    <div className='grid grid-cols-2 grid-cols-1 grid-cols-3 grid-cols-4 grid-cols-5 grid-cols-6 grid-cols-7 grid-cols-8' />
)
