import { Dropdown } from '../csuite/dropdown/Dropdown'
import { MenuItem } from '../csuite/dropdown/MenuItem'
import { JsonViewUI } from '../csuite/json/JsonViewUI'
import { RevealUI } from '../csuite/reveal/RevealUI'

export const MenuAboutUI = obs(function MenuAboutUI_(p: {}) {
   return (
      <Dropdown
         title='About'
         content={() => (
            <>
               {/* 🔴 */}
               <MenuItem
                  onClick={() => {
                     void window
                        .require('electron')
                        .shell.openExternal('https://github.com/rvion/CushyStudio#readme')
                  }}
                  icon={IKONS.mdiGithub}
                  label='Github'
               />
               <MenuItem
                  onClick={() => {
                     void window.require('electron').shell.openExternal('https://www.CushyStudio.com')
                  }}
                  icon={IKONS.mdiWeb}
                  label='Documentation'
               />
               <MenuItem
                  onClick={() => {
                     void window.require('electron').shell.openExternal('https://www.CushyStudio.com/blog')
                  }}
                  icon={IKONS.mdiPost}
                  label='Blog'
               />
               {/* Github Integration */}
               {cushy.auth.isConnected ? (
                  <MenuItem //
                     icon={IKONS.mdiLogout}
                     onClick={() => cushy.auth.logout()}
                     label='Logout'
                  />
               ) : (
                  <MenuItem //
                     icon={IKONS.mdiLogin}
                     onClick={() => void cushy.auth.startLoginFlowWithGithub()}
                     label='Login with Github'
                  />
               )}
               {/* // TODO(bird_d): Github integration should be moved inside the CushyStudio "Button" when that's a thing. */}
               {/* <MenuDivider></MenuDivider> */}
               <RevealUI content={() => <JsonViewUI value={cushy.auth.user} />}>
                  <MenuItem //
                     icon={IKONS.mdiInformation}
                     label={cushy.auth.user?.email ?? '<no-email>'}
                  />
               </RevealUI>
            </>
         )}
      />
   )
})
