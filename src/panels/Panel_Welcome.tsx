import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { ScriptExtractionResult } from 'src/cards/LibraryFile'
import { AppCardUI } from 'src/cards/fancycard/AppCardUI'
import { useSt } from 'src/state/stateContext'
import { toastError } from 'src/utils/misc/toasts'
import { CreateAppBtnUI } from './Panel_Welcome/CreateAppBtnUI'

export const Panel_Welcome = observer(function Panel_Welcome_(p: {}) {
    const st = useSt()
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
                <div tw='italic text-sm'>
                    Psss. You're early; this app is still in Beta. It update often, and break sometimes. Hope you'll have fun !
                </div>
                <div tw='divider mx-8'></div>
                <div>
                    1. First thing first, make sure you have some ComfyUI server you can connect to in the
                    <div onClick={() => st.layout.FOCUS_OR_CREATE('Hosts', {})} className='btn btn-sm btn-primary'>
                        Hosts
                        <span className='material-symbols-outlined'>open_in_new</span>
                    </div>{' '}
                    panel.
                    {/* <span tw='italic text-xs'>(🤫 Cushy Cloud is coming soon)</span> */}
                </div>
                {/* <div>You can fill your local CushyApp database by indexing all apps in the `./library` folder</div> */}
                {/* <IndexAllAppsBtnUI /> */}
                <div tw='divider mx-8'></div>
                2. To get started, try those apps ?
                {['library/built-in/CushyDiffusion.ts'].map((path) => (
                    <StandaloneAppBtnUI key={path} path={path as RelativePath} />
                ))}
                <div tw='divider mx-8'></div>
                <div>
                    <div>
                        3. Time to create your own app ? It's super-easy. Let's GOO !
                        <CreateAppBtnUI />
                    </div>
                    <div>and if you're feeling lost, check the </div>
                    <div tw='btn btn-sm'>
                        SDK examples
                        <span className='material-symbols-outlined'>open_in_new</span>
                    </div>{' '}
                    or the{' '}
                    <div tw='btn btn-sm'>
                        Documentation
                        <span className='material-symbols-outlined'>open_in_new</span>
                    </div>{' '}
                    website
                </div>
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
        void (async () => {
            const res: ScriptExtractionResult = await file.extractScriptFromFile()
            if (res.type === 'failed') return toastError('default app (CushyDiffusion) failed to load')
            const script = res.script
            script.evaluateAndUpdateApps()
        })()
    }, [])

    // show script evaluation progress
    const script0 = file.script
    if (script0 == null)
        return (
            <div>
                extracting script...
                <div className='loading'></div>
            </div>
        )

    // show app evaluation progress
    const app = script0.apps?.[0]
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
