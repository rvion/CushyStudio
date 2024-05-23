import '../../ALL_CMDS'

import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useEffect, useRef } from 'react'

import { CushyKitCtx } from '../../controls/shared/CushyKitCtx'
import { ActivityStackUI } from '../../operators/ActivityUI'
import { useRegionMonitor } from '../../operators/RegionMonitor'
import { Trigger } from '../../operators/RET'
import { RenderFullPagePanelUI } from '../../panels/router/RenderFullPagePanelUI'
import { RevealState } from '../../rsuite/reveal/RevealState'
import { useSt } from '../../state/stateContext'
import { Box } from '../../theme/colorEngine/Box'
import { GlobalSearchUI } from '../../utils/electron/globalSearchUI'
import { AppBarUI } from '../appbar/AppBarUI'
import { commandManager } from '../shortcuts/CommandManager'
import { FavBarUI } from './FavBar'
import { FooterBarUI } from './FooterBarUI'
import { ProjectUI } from './ProjectUI'

export const CushyUI = observer(function CushyUI_() {
    const st = useSt()
    const appRef = useRef<HTMLDivElement>(null)
    useRegionMonitor()
    useEffect(() => {
        const current = appRef.current
        if (current == null) return
        function handleKeyDown(event: KeyboardEvent) {
            const x = commandManager.processKeyDownEvent(event as any)

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
                x === Trigger.UNMATCHED && //
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
        <CushyKitCtx.Provider value={st}>
            <Box
                style={{
                    // @ts-expect-error 🔴
                    '--BASEOK': cushy.theme.root.value.base,
                }}
                // base='#1E212B'
                base={cushy.theme.root.value.base}
                text={{ contrast: 0.99 /* chromaBlend: 99, hueShift: 0 */ }}
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
                tw='col grow h-full text-base-content overflow-clip'
            >
                <div // Global Popup/Reveal/Tooltip container always be on screen with overflow-clip added.
                    id='tooltip-root'
                    tw='absolute inset-0 w-full h-full overflow-clip pointer-events-none'
                >
                    <ActivityStackUI />
                </div>

                <GlobalSearchUI /* Ctrl or Cmd + F: does not work natively on electron; implemented here */ />
                <AppBarUI />
                <RenderFullPagePanelUI />
                <div className='flex flex-grow relative overflow-clip'>
                    <FavBarUI direction='row' />
                    <ProjectUI />
                </div>
                <FooterBarUI />
            </Box>
        </CushyKitCtx.Provider>
    )
})

// force a few extra tailwind classNames to be included
const foo = (
    <div className='grid grid-cols-2 grid-cols-1 grid-cols-3 grid-cols-4 grid-cols-5 grid-cols-6 grid-cols-7 grid-cols-8' />
)
