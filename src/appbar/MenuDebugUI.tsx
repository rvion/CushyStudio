import { observer } from 'mobx-react-lite'

import { KEYS } from '../app/shortcuts/shorcutKeys'
import { activityManager } from '../csuite/activity/ActivityManager'
import { Dropdown } from '../csuite/dropdown/Dropdown'
import { MenuDividerUI_ } from '../csuite/dropdown/MenuDividerUI'
import { MenuItem } from '../csuite/dropdown/MenuItem'
import { getDBStats } from '../db/getDBStats'
import { quickBench } from '../db/quickBench'
import { DEMO_ACTIVITY } from '../operators/useDebugActivity'
import { useSt } from '../state/stateContext'

export const MenuDebugUI = observer(function MenuDebugUI_(p: {}) {
    const st = useSt()
    return (
        <Dropdown
            expand
            title='Debug'
            content={() => (
                <>
                    <MenuItem
                        iconClassName='text-green-500'
                        icon='mdiAutoFix'
                        onClick={() => st.layout.resetCurrent()}
                        localShortcut={KEYS.resetLayout}
                        label='Reset Layout'
                    />
                    <MenuItem
                        iconClassName='text-green-500'
                        icon='mdiAutoFix'
                        onClick={() => st.layout.fixTabsWithNegativeArea()}
                        localShortcut={KEYS.resetLayout}
                        label='Fix Tabs with negative size'
                    />
                    <MenuItem
                        iconClassName='text-green-500'
                        icon='mdiVideo'
                        onClick={() => st.resizeWindowForVideoCapture()}
                        localShortcut={KEYS.resizeWindowForVideoCapture}
                        label='set screen size to 1920 x 1080'
                    />
                    <MenuItem
                        iconClassName='text-green-500'
                        icon='mdiLaptop'
                        onClick={() => st.resizeWindowForLaptop()}
                        localShortcut={KEYS.resizeWindowForLaptop}
                        label='set screen size to 1280 x 720'
                    />
                    <MenuItem //
                        iconClassName='text-green-500'
                        icon='mdiBug'
                        onClick={() => st.electronUtils.toggleDevTools()}
                        label='console'
                    />
                    <MenuItem //
                        iconClassName='text-green-500'
                        icon='mdiBug'
                        onClick={() => activityManager.start(DEMO_ACTIVITY)}
                        label='Start debug activity'
                    />
                    <MenuItem
                        iconClassName='text-orange-500'
                        icon='mdiSync'
                        onClick={() => st.reloadCushyMainWindow()}
                        localShortcut='mod+R'
                        label='Reload'
                    />
                    <MenuDividerUI_ />
                    <MenuItem //
                        onClick={() => st.layout.FOCUS_OR_CREATE('Playground', {})}
                        icon='mdiPlayNetwork'
                    >
                        Show Dev Playground Page
                    </MenuItem>
                    <MenuItem //
                        iconClassName='text-yellow-500'
                        onClick={() => getDBStats(st.db)}
                        icon='mdiAccount'
                    >
                        print DB stats
                    </MenuItem>
                    <MenuItem //
                        iconClassName='text-yellow-500'
                        onClick={() => quickBench.printAllStats()}
                        icon='mdiAccountOutline'
                        label='print QuickBench stats'
                    />
                    <MenuItem //
                        iconClassName='text-yellow-500'
                        onClick={st.auth.__testCB}
                        icon='mdiAccount'
                        label='Test Auth CB page'
                    />
                    <MenuDividerUI_ />
                    <MenuItem //
                        onClick={() => st.wipeOuputTopLevelImages()}
                        iconClassName='text-red-500'
                        icon='mdiImageBroken'
                        label='remove all images'
                    />
                    <MenuItem //
                        onClick={() => st.wipeOuputTopLevelImages()}
                        iconClassName='text-red-500'
                        icon='mdiImageBroken'
                        label='remove top-level images'
                    />
                    <MenuDividerUI_ />
                    <MenuItem
                        iconClassName='text-red-500'
                        icon='mdiSync'
                        label='Reset DB'
                        onClick={() => {
                            st.db.reset()
                            st.reloadCushyMainWindow()
                        }}
                    />

                    <MenuItem
                        iconClassName='text-red-500'
                        icon='mdiSync'
                        onClick={() => st.fullReset_eraseConfigAndSchemaFilesAndDB()}
                        label='Full Reset'
                    />
                    <MenuDividerUI_ />
                    <MenuItem //
                        iconClassName='text-purple-500'
                        icon='mdiStorageTankOutline'
                        onClick={st.db.migrate}
                        label='Migrate'
                    />
                    <MenuItem //
                        iconClassName='text-purple-500'
                        icon='mdiHomeGroup'
                        onClick={st.db.runCodegen}
                        label='CodeGen'
                    />
                </>
            )}
        />
    )
})
