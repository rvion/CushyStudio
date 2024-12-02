import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'

import { Button } from '../../csuite/button/Button'
import { PanelHeaderUI } from '../../csuite/panel/PanelHeaderUI'
import { CreateAppBtnUI } from './CreateAppBtnUI'
import { ForceUpdateAllAppsBtnUI, IndexAllAppsBtnUI } from './LibraryHeaderUI'
import { StandaloneAppBtnUI } from './StandaloneAppBtnUI'

export const PanelWelcomeUI = observer(function PanelWelcomeUI_(p: {}) {
   useEffect(() => void cushy.showConfettiAndBringFun())

   return (
      <div tw='relative'>
         <PanelHeaderUI></PanelHeaderUI>
         <section tw='flex flex-col items-center gap-2 px-8 py-2 text-center'>
            <h1 tw='text-2xl'>Welcome to CushyStudio !</h1>
            <div tw='text-sm italic'>
               Psss. You're early; this app is still in Beta. It update often, and break sometimes. Hope
               you'll have fun !
            </div>
            <div tw='divider mx-8'></div>
            <div tw='flex gap-1'>
               <IndexAllAppsBtnUI />
               <ForceUpdateAllAppsBtnUI />
            </div>
            <div>
               1. First thing first, make sure you have some ComfyUI server you can connect to in the
               <Button icon='mdiOpenInNew' onClick={() => cushy.layout.open('Hosts', {})}>
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
                  // 'library/built-in/CushyDiffusion.ts',
                  'library/built-in/SDXL/cushySDXL.tsx',
                  'library/built-in/SD3/cushySD3.ts',
                  'library/built-in/Cascade/cushyCascade.ts',
                  'library/built-in/Flux/cushyFlux.ts',
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
               <Button icon='mdiOpenInNew'>SDK examples</Button> or the{' '}
               <Button icon='mdiOpenInNew'>Documentation</Button> website
            </div>
         </section>
      </div>
   )
})
