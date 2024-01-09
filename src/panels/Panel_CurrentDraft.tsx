import { observer } from 'mobx-react-lite'
import { useEffect, useLayoutEffect } from 'react'
import { IndexAllAppsBtnUI } from './libraryUI/LibraryHeaderUI'
import { AppCardUI } from 'src/cards/fancycard/AppCardUI'
import { useSt } from 'src/state/stateContext'

export const Panel_CurrentDraft = observer(function CurrentDraftUI_(p: {}) {
    useEffect(() => {
        // confetti
        void (async () => {
            const confetti = (await import('https://cdn.skypack.dev/canvas-confetti' as any)).default
            confetti()
        })()
    })

    return (
        <div tw='relative'>
            <section tw='text-center py-2 flex flex-col gap-2 items-center px-8'>
                <h1 tw='text-2xl'>Welcome to CushyStudio !</h1>
                <div>You managed to get it running !</div>
                <div tw='divider mx-8'></div>
                <div>You can fill your local CushyApp database by indexing all apps in the `./library` folder</div>
                <IndexAllAppsBtnUI />
                <div tw='divider mx-8'></div>
                {['library/built-in/SDUI.ts'].map((path) => (
                    <StandaloneAppBtnUI key={path} path={path as RelativePath} />
                ))}
            </section>
        </div>
    )
})

export const StandaloneAppBtnUI = observer(function StandaloneAppBtnUI_(p: { path: RelativePath }) {
    const path = p.path
    const st = useSt()
    const file = st.library.getFile(path)

    // ensure this app is up-to-date
    useEffect(() => {
        file.extractScriptFromFile()
    }, [])

    // show script evaluation progress
    const script0 = file.script0
    if (script0 == null)
        return (
            <div>
                extracting script...
                <div className='loading'></div>
            </div>
        )

    // show app evaluation progress
    const app = script0.apps_viaScript?.[0]
    if (app == null) {
        return (
            <div>
                compiling app... <div className='loading'></div>
            </div>
        )
    }
    return (
        <div key={path}>
            <AppCardUI //
                // active={st.library.selectionCursor === ix}
                // deck={card.pkg}
                app={app}
            />
        </div>
    )
})
