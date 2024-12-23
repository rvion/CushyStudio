import type { MenuEntry } from '../csuite/menu/MenuEntry'

import { defineMenu, type Menu } from '../csuite/menu/Menu'
import { capitalize } from '../csuite/utils/capitalize'
import { getPanelCategoryIcon, type PanelCategory } from '../router/PanelCategory'
import { allPanels } from '../router/PANELS'

// const objectEntries = <OBJ extends Record<infer A, infer B>>(obj:OBJ)  => {
//     return Object.entries(obj) as [A, B][]
// }

const groupBy = <X extends any, Key extends string>(
   /** array of items you want to group */
   arr: X[],
   /** function to get item key  */
   getKey: (v: X, i: number, x: X[]) => Key,
): Record<Key, X[]> =>
   arr.reduce<Record<string, X[]>>((a, b, i) => ((a[getKey(b, i, arr)] ||= []).push(b), a), {})

// const XXX = ['Civitai', 'Squoosh']
export const menuView: Menu = defineMenu({
   title: 'View',
   entries: (b): MenuEntry[] => {
      const byCategory = groupBy(allPanels, (v) => v.category)
      return [
         // By categories
         ...Object.entries(byCategory).map(([category, panels]) => {
            return defineMenu({
               title: capitalize(category),
               entries: () => panels.flatMap((p) => p.menuEntries),
               icon: getPanelCategoryIcon(category as PanelCategory),
            })
         }),
         b.Divider,
         // Alphabetically
         defineMenu({
            title: 'All Panels',
            entries: () =>
               allPanels
                  .flatMap((panel) => panel.menuEntries)
                  .toSorted((a, b) => a.title.localeCompare(b.title)),
            icon: 'mdiSortAlphabeticalVariant',
         }),
         // menuWithoutProps({
         //     title: 'FooBar',
         //     entries: () => allPanels.filter((v) => !XXX.includes(v.name)).flatMap((panel) => panel.menuEntries),
         // }),

         // menuWithoutProps({
         //     title: 'Utils',
         //     entries: () => allPanels.filter((v) => XXX.includes(v.name)).flatMap((panel) => panel.menuEntries),
         // }),
      ]
   },
})
