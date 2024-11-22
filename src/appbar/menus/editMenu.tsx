import { defineMenu, type Menu } from '../../csuite/menu/Menu'

// const viewMenu = defineMenu({
//    title: 'View',
//    entries: () => [menuCommands],
// })
export const editMenu: Menu = defineMenu({
   title: 'Edit',
   entries: (b) => [
      // b.Divider,
      // <Frame base={{ contrast: 0.1 }} tw='h-[1px]'></Frame>,
      // Should have commands that open menus that we can re-use in spots.
      b.Divider,
      b.SimpleMenuAction({
         label: 'Preferences',
         onClick: () => cushy.layout.open('Config', {}),
         // icon: 'mdiCog',
      }),
   ],
})
