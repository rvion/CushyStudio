import { Dropdown } from '../csuite/dropdown/Dropdown'
import { MenuAppsUI } from './MenuApps'

// import { JsonViewUI } from '../widgets/workspace/JsonViewUI'
// import { MenuComfyUI } from './MenuComfyUI'

// TODO(bird_d): Settings can go here eventually, but it's a bit cluttered right now.

export const MenuEditUI = obs(function MenuEditUI_(p: {}) {
   return (
      <Dropdown
         title='Edit'
         content={() => (
            <>
               {/* <MenuComfyUI /> */}
               <MenuAppsUI />
            </>
         )}
      />
   )
})
