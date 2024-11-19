import { defineMenu, type Menu } from '../../csuite/menu/Menu'
import { menuCommands } from './menuCommands'

/*

/>
               <MenuItem

               />
               <MenuItem
                  onClick={() => {
                     void window.require('electron').shell.openExternal('https://www.CushyStudio.com/blog')
                  }}
                  icon={'mdiPost'}
                  label='Blog'
               />
               {cushy.auth.isConnected ? (
                  <MenuItem //
                     icon='mdiLogout'
                     onClick={() => cushy.auth.logout()}
                     label='Logout'
                  />
               ) : (
                  <MenuItem //
                     icon='mdiLogin'
                     onClick={() => void cushy.auth.startLoginFlowWithGithub()}
                     label='Login with Github'
                  />
               )}



*/
export const helpMenu: Menu = defineMenu({
   title: 'Help',
   entries: (b) => [
      //
      menuCommands,

      b.Divider,
      b.SimpleMenuAction({
         label: 'Github',
         icon: 'mdiGithub',
         onClick: () => {
            void window.require('electron').shell.openExternal('https://github.com/rvion/CushyStudio#readme')
         },
      }),
      b.SimpleMenuAction({
         label: 'Documentation',
         icon: 'mdiWeb',
         onClick: () => {
            void window.require('electron').shell.openExternal('https://www.CushyStudio.com')
         },
      }),
      b.SimpleMenuAction({
         label: 'Blog',
         icon: 'mdiPost',
         onClick: () => {
            void window.require('electron').shell.openExternal('https://www.CushyStudio.com/blog')
         },
      }),
      b.Divider,
      cushy.auth.isConnected
         ? b.SimpleMenuAction({
              icon: 'mdiLogout',
              label: 'Logout',
              onClick: () => cushy.auth.logout(),
           })
         : b.SimpleMenuAction({
              icon: 'mdiLogin',
              label: 'Login with Github',
              onClick: () => void cushy.auth.startLoginFlowWithGithub(),
           }),
   ],
   // TODO(bird): Properly do this
   /**<RevealUI content={() => <JsonViewUI value={cushy.auth.user} />}>
                  <MenuItem //
                     icon='mdiInformation'
                     label={cushy.auth.user?.email ?? '<no-email>'}
                  />
               </RevealUI> */
})
