import type { NO_PROPS } from '../../csuite/types/NO_PROPS'

import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'

import { AppCardUI } from '../../cards/fancycard/AppCardUI'
import { Button } from '../../csuite/button/Button'
import { Panel, type PanelHeader } from '../../router/Panel'
import { useSt } from '../../state/stateContext'
import { CreateAppBtnUI } from './CreateAppBtnUI'
import { ForceUpdateAllAppsBtnUI, IndexAllAppsBtnUI } from './LibraryHeaderUI'

export const PanelWelcome = new Panel({
    name: 'Welcome',
    widget: (): React.FC<NO_PROPS> => PanelWelcomeUI,
    header: (p): PanelHeader => ({ title: 'Welcome' }),
    def: (): NO_PROPS => ({}),
    icon: undefined,
})

export const PanelWelcomeUI = observer(function PanelWelcomeUI_(p: {}) {
    const st = useSt()
    useEffect(() => void cushy.showConfettiAndBringFun())

    return (
        <div tw='relative'>
            <section tw='text-center py-2 flex flex-col gap-2 items-center px-8'>
                <h1 tw='text-2xl'>Welcome to CushyStudio !</h1>
                <div tw='italic text-sm'>
                    Psss. You're early; this app is still in Beta. It update often, and break sometimes. Hope you'll have fun !
                </div>
                <div tw='divider mx-8'></div>
                <div tw='flex gap-1'>
                    <IndexAllAppsBtnUI />
                    <ForceUpdateAllAppsBtnUI />
                </div>
                <div>
                    1. First thing first, make sure you have some ComfyUI server you can connect to in the
                    <Button icon='mdiOpenInNew' onClick={() => st.layout.FOCUS_OR_CREATE('Hosts', {})}>
                        Hosts
                    </Button>
                    panel.
                    {/* <span tw='italic text-xs'>(🤫 Cushy Cloud is coming soon)</span> */}
                </div>
                {/* <div>You can fill your local CushyApp database by indexing all apps in the `./library` folder</div> */}
                {/* <IndexAllAppsBtnUI /> */}
                <div tw='divider mx-8'></div>
                2. To get started, try those apps ?
                <div tw='flex flex-wrap gap-2'>
                    {[
                        //
                        'library/built-in/CushyDiffusion.ts',
                        'library/built-in/quick-actions/quick-add-gradient-background.ts',
                    ].map((path) => (
                        <StandaloneAppBtnUI //
                            key={path}
                            path={path as RelativePath}
                        />
                    ))}
                </div>
                <div tw='divider mx-8'></div>
                <div>
                    <div>
                        <div>3. Time to create your own app ? </div>
                        <div>
                            It's super-easy: <CreateAppBtnUI />
                        </div>
                    </div>
                    <div>and if you're feeling lost, check the </div>
                    <Button icon='mdiOpenInNew'>SDK examples</Button> or the <Button icon='mdiOpenInNew'>Documentation</Button>{' '}
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
    useEffect(() => void file.extractScriptFromFileAndUpdateApps(), [])

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
        // <div key={path}>
        <AppCardUI //
            // active={st.library.selectionCursor === ix}
            // deck={card.pkg}
            app={app}
        />
        // </div>
    )
})
