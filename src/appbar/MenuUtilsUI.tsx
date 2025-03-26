import { KEYS } from '../app/shortcuts/shorcutKeys'
import { Dropdown } from '../csuite/dropdown/Dropdown'
import { MenuItem } from '../csuite/dropdown/MenuItem'

export const MenuUtilsUI = obs(function MenuUtilsUI_(p: {}) {
   return (
      <Dropdown
         title='Utils'
         content={() => (
            <>
               <MenuItem
                  onClick={() => cushy.layout.open('Models', {})}
                  icon={IKONS.cdiExternalCivitai}
                  localShortcut={KEYS.openPage_Models}
                  label='Civitai (fast and clean)'
               />
               <MenuItem
                  onClick={() => cushy.layout.open('Civitai', {})}
                  icon={IKONS.cdiExternalCivitai}
                  localShortcut={KEYS.openPage_Civitai}
                  label='Civitai (iframe)'
               />

               <MenuItem
                  onClick={() => cushy.layout.open('Squoosh', {})}
                  icon={IKONS.cdiExternalSquoosh}
                  localShortcut={KEYS.openPage_Squoosh}
                  label='Squoosh'
               />
               <MenuItem
                  onClick={() => cushy.layout.open('IFrame', { url: 'https://app.posemy.art/' })}
                  iconClassName='text-red-400'
                  icon={IKONS.mdiBrush}
                  localShortcut={KEYS.openPage_Posemy}
                  label='3d Poser (posemy.art)'
               />
               <MenuItem
                  onClick={() => cushy.layout.open('Paint', {})}
                  iconClassName='text-red-400'
                  icon={IKONS.mdiBrush}
                  localShortcut={KEYS.openPage_Paint}
                  label='Minipaint'
               />
               <MenuItem
                  onClick={() =>
                     cushy.layout.open('IFrame', {
                        url: 'https://www.photopea.com/',
                     })
                  }
                  iconClassName='text-red-400'
                  icon={IKONS.mdiBrush}
                  localShortcut={KEYS.openPage_Paint}
                  label='Photopea'
               />
               <MenuItem
                  onClick={() => cushy.layout.open('IFrame', { url: 'https://unsplash.com/' })}
                  iconClassName='text-purple-400'
                  icon={IKONS.mdiImageSearch}
                  localShortcut={KEYS.openPage_Unsplash}
                  label='Unsplash - Free images'
               />
            </>
         )}
      />
   )
})
