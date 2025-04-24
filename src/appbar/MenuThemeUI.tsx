import { Dropdown } from '../csuite/dropdown/Dropdown'

export const MenuThemeUI = obs(function MenuThemeUI_(p: {}) {
   return (
      <Dropdown //
         title='Theme'
         content={() => <div tw='[width:38rem]'>{cushy.preferences.theme.UI()}</div>}
      />
   )
})
