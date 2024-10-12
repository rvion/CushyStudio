import { observer } from 'mobx-react-lite'

import { KEYS } from '../app/shortcuts/shorcutKeys'
import { Dropdown } from '../csuite/dropdown/Dropdown'
import { MenuItem } from '../csuite/dropdown/MenuItem'
import { useSt } from '../state/stateContext'

// const cmd_posemy = new Command({
//
// })
// const MenuUtilsV2 = new Menu({
//     title: 'Utils',
//     icon: 'mdiPuzzle',
//     entries: () => [],
// })

export const MenuUtilsUI = observer(function MenuUtilsUI_(p: {}) {
    const st = useSt()
    return (
        <Dropdown
            title='Utils'
            content={() => (
                <>
                    <MenuItem
                        onClick={() => st.layout.open('Models', {})}
                        icon='cdiExternalCivitai'
                        localShortcut={KEYS.openPage_Models}
                        label='Civitai (fast and clean)'
                    />
                    <MenuItem
                        onClick={() => st.layout.open('Civitai', {})}
                        icon='cdiExternalCivitai'
                        localShortcut={KEYS.openPage_Civitai}
                        label='Civitai (iframe)'
                    />

                    <MenuItem
                        onClick={() => st.layout.open('Squoosh', {})}
                        icon={'cdiExternalSquoosh'}
                        localShortcut={KEYS.openPage_Squoosh}
                        label='Squoosh'
                    />
                    <MenuItem
                        onClick={() => st.layout.open('IFrame', { url: 'https://app.posemy.art/' })}
                        iconClassName='text-red-400'
                        icon='mdiBrush'
                        localShortcut={KEYS.openPage_Posemy}
                        label='3d Poser (posemy.art)'
                    />
                    <MenuItem
                        onClick={() => st.layout.open('Paint', {})}
                        iconClassName='text-red-400'
                        icon='mdiBrush'
                        localShortcut={KEYS.openPage_Paint}
                        label='Minipaint'
                    />
                    <MenuItem
                        onClick={() =>
                            st.layout.open('IFrame', {
                                url: 'https://www.photopea.com/',
                            })
                        }
                        iconClassName='text-red-400'
                        icon='mdiBrush'
                        localShortcut={KEYS.openPage_Paint}
                        label='Photopea'
                    />
                    <MenuItem
                        onClick={() => st.layout.open('IFrame', { url: 'https://unsplash.com/' })}
                        iconClassName='text-purple-400'
                        icon='mdiImageSearch'
                        localShortcut={KEYS.openPage_Unsplash}
                        label='Unsplash - Free images'
                    />
                </>
            )}
        />
    )
})
