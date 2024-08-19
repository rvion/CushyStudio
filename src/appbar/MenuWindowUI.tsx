import type { MenuEntry } from '../csuite/menu/MenuEntry'

import { menuWithoutProps } from '../csuite/menu/Menu'
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
): Record<Key, X[]> => arr.reduce<Record<string, X[]>>((a, b, i) => ((a[getKey(b, i, arr)] ||= []).push(b), a), {})

// const XXX = ['Civitai', 'Squoosh']
const menuPanels = menuWithoutProps({
    title: 'Panels',
    entries: (): MenuEntry[] => {
        const byCategory = groupBy(allPanels, (v) => v.category)
        return [
            // Alphabetically
            menuWithoutProps({
                title: 'Alphabetically',
                entries: () => allPanels.flatMap((panel) => panel.menuEntries).toSorted((a, b) => a.title.localeCompare(b.title)),
                icon: 'mdiSortAlphabeticalVariant',
            }).bind(),

            // By categories
            ...Object.entries(byCategory).map(([category, panels]) => {
                return menuWithoutProps({
                    title: capitalize(category),
                    entries: () => panels.flatMap((p) => p.menuEntries),
                    icon: getPanelCategoryIcon(category as PanelCategory),
                }).bind()
            }),

            // menuWithoutProps({
            //     title: 'FooBar',
            //     entries: () => allPanels.filter((v) => !XXX.includes(v.name)).flatMap((panel) => panel.menuEntries),
            // }).bind(),

            // menuWithoutProps({
            //     title: 'Utils',
            //     entries: () => allPanels.filter((v) => XXX.includes(v.name)).flatMap((panel) => panel.menuEntries),
            // }).bind(),
        ]
    },
})

export const MenuPanelsUI = (): JSX.Element => <menuPanels.UI />
