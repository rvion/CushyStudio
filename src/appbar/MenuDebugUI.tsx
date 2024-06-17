import { observer } from 'mobx-react-lite'

import { KEYS } from '../app/shortcuts/shorcutKeys'
import { activityManager } from '../csuite/activity/ActivityManager'
import { Dropdown } from '../csuite/dropdown/Dropdown'
import { MenuDividerUI_ } from '../csuite/dropdown/MenuDividerUI'
import { MenuItem } from '../csuite/dropdown/MenuItem'
import { Ikon } from '../csuite/icons/iconHelpers'
import { getDBStats } from '../db/getDBStats'
import { quickBench } from '../db/quickBench'
import { DEMO_ACTIVITY } from '../operators/useDebugActivity'
import { useSt } from '../state/stateContext'

export const MenuDebugUI = observer(function MenuDebugUI_(p: {}) {
    const st = useSt()
    return (
        <Dropdown
            // startIcon={<span className='material-symbols-outlined'>sync</span>}
            title='Debug'
            content={() => (
                <>
                    <MenuItem
                        icon={<Ikon.mdiAutoFix className='text-green-500' />}
                        onClick={st.layout.resetCurrent}
                        shortcut={KEYS.resetLayout}
                        label='Fix Layout'
                    />
                    <MenuItem
                        icon={<span className='material-symbols-outlined text-green-500'>panorama_horizontal</span>}
                        onClick={st.resizeWindowForVideoCapture}
                        shortcut={KEYS.resizeWindowForVideoCapture}
                        label='set screen size to 1920 x 1080'
                    />
                    <MenuItem
                        icon={<span className='material-symbols-outlined text-green-500'>panorama_horizontal</span>}
                        onClick={st.resizeWindowForLaptop}
                        shortcut={KEYS.resizeWindowForLaptop}
                        label='set screen size to 1280 x 720'
                    />
                    <MenuItem //
                        icon={<span className='material-symbols-outlined text-green-500'>bug_report</span>}
                        onClick={st.electronUtils.toggleDevTools}
                        label='console'
                    />
                    <MenuItem //
                        icon={<span className='material-symbols-outlined text-green-500'>bug_report</span>}
                        onClick={() => activityManager.startActivity(DEMO_ACTIVITY)}
                        label='Start debug activity'
                    />
                    <MenuItem
                        icon={<span className='material-symbols-outlined text-orange-500'>sync</span>}
                        onClick={st.reloadCushyMainWindow}
                        shortcut='mod+R'
                        label='Reload'
                    />
                    <MenuDividerUI_ />
                    <MenuItem
                        onClick={() => st.layout.FOCUS_OR_CREATE('Playground', {})}
                        icon={<span className='material-symbols-outlined text-yellow-500'>play_for_work</span>}
                    >
                        Show Dev Playground Page
                    </MenuItem>
                    <MenuItem
                        onClick={() => getDBStats(st.db)}
                        icon={<span className='material-symbols-outlined text-yellow-500'>account_balance</span>}
                    >
                        print DB stats
                    </MenuItem>
                    <MenuItem
                        onClick={() => quickBench.printAllStats()}
                        icon={<span className='material-symbols-outlined text-yellow-500'>account_balance</span>}
                    >
                        print QuickBench stats
                    </MenuItem>
                    <MenuItem
                        onClick={st.auth.__testCB}
                        icon={<span className='material-symbols-outlined text-yellow-500'>account_balance</span>}
                    >
                        Test Auth CB page
                    </MenuItem>
                    <MenuDividerUI_ />
                    <MenuItem
                        onClick={() => st.wipeOuputTopLevelImages()}
                        icon={<span className='material-symbols-outlined text-red-500'>image_not_supported</span>}
                    >
                        remove all images
                    </MenuItem>
                    <MenuItem
                        onClick={() => st.wipeOuputTopLevelImages()}
                        icon={<span className='material-symbols-outlined text-red-500'>image_not_supported</span>}
                    >
                        remove top-level images
                    </MenuItem>
                    <MenuDividerUI_ />
                    <MenuItem
                        //
                        // tw={[st.db.healthColor]}
                        onClick={() => {
                            st.db.reset()
                            st.reloadCushyMainWindow()
                        }}
                        icon={<span className='material-symbols-outlined text-red-500'>sync</span>}
                    >
                        Reset DB
                    </MenuItem>
                    <MenuItem
                        icon={<span className='material-symbols-outlined text-red-500'>sync</span>}
                        onClick={st.fullReset_eraseConfigAndSchemaFilesAndDB}
                        label='Full Reset'
                    />
                    <MenuDividerUI_ />
                    <MenuItem //
                        icon={<span className='material-symbols-outlined text-purple-500'>storage</span>}
                        onClick={st.db.migrate}
                        label='Migrate'
                    />
                    <MenuItem //
                        icon={<span className='material-symbols-outlined text-purple-500'>group_work</span>}
                        onClick={st.db.runCodegen}
                        label='CodeGen'
                    />
                </>
            )}
        />
    )
})
