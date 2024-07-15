import { observer } from 'mobx-react-lite'

import { allLayoutCommands } from '../app/shortcuts/cmd_layout'
import { menuWithoutProps } from '../csuite/menu/Menu'
import { allPanels } from '../router/PANELS'
import { useSt } from '../state/stateContext'

// const XXX = ['Civitai', 'Squoosh']
const menuPanels = menuWithoutProps({
    title: 'Panels',
    entries: () => [
        // menuWithoutProps({
        //     title: 'FooBar',
        //     entries: () => allPanels.filter((v) => !XXX.includes(v.name)).flatMap((panel) => panel.menuEntries),
        // }).bind(),

        // menuWithoutProps({
        //     title: 'Utils',
        //     entries: () => allPanels.filter((v) => XXX.includes(v.name)).flatMap((panel) => panel.menuEntries),
        // }).bind(),
        ...allPanels.flatMap((panel) => panel.menuEntries),
    ],
})

const layoutShortcuts = menuWithoutProps({
    title: 'shortcuts',
    entries: () => [...allLayoutCommands],
    // entries: () => [...allLayoutCommands],
})

export const MenuPanelsUI = observer(function MenuPanelsUI_(p: {}) {
    const st = useSt()
    return (
        <>
            {/* <MenuUI menu={menu.UI} /> */}
            {/* <menu.UI /> */}
            <menuPanels.UI />
            <layoutShortcuts.UI />
        </>
    )
})
