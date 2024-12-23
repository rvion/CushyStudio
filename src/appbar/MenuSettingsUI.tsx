import { observer } from 'mobx-react-lite'

import { KEYS } from '../app/shortcuts/shorcutKeys'
import { Dropdown } from '../csuite/dropdown/Dropdown'
import { MenuItem } from '../csuite/dropdown/MenuItem'

export const MenuSettingsUI = observer(function MenuSettingsUI_(p: {}) {
   return (
      <Dropdown
         title='Settings'
         content={() => (
            <>
               <MenuItem
                  onClick={() => cushy.layout.open('Config', {})}
                  icon={'mdiSettingsHelper'}
                  localShortcut={KEYS.openPage_Config}
                  label='Config'
               />
               <MenuItem
                  onClick={() => cushy.layout.open('Hosts', {})}
                  icon={'mdiHospital'}
                  localShortcut={KEYS.openPage_Hosts}
                  label='ComfyUI Hosts'
               />
               <MenuItem
                  onClick={() => cushy.layout.open('Shortcuts', {})}
                  icon={'mdiKey'}
                  localShortcut={KEYS.openPage_Shortcuts}
                  label='Shortcuts'
               />
               {/* <MenuDivider />
                    <MenuDivider /> */}
               {/* <MenuDebugUI /> */}
            </>
         )}
      />
   )
})
