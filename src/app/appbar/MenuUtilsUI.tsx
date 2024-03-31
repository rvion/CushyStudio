import { observer } from 'mobx-react-lite'

import { Dropdown, MenuItem } from '../../rsuite/Dropdown'
import { useSt } from '../../state/stateContext'
import { assets } from '../../utils/assets/assets'
import { KEYS } from '../shortcuts/shorcutKeys'

export const MenuUtilsUI = observer(function MenuUtilsUI_(p: {}) {
    const st = useSt()
    return (
        <Dropdown
            startIcon={<span className='material-symbols-outlined text-green-400'>code</span>}
            title='Utils'
            content={() => (
                <>
                    <MenuItem
                        onClick={() => st.layout.FOCUS_OR_CREATE('Models', {})}
                        icon={<img style={{ width: '1em', height: '1em' }} src={assets.CivitaiLogo_png}></img>}
                        shortcut={KEYS.openPage_Models}
                        label='Civitai (fast and clean)'
                    />

                    <MenuItem
                        onClick={() => st.layout.FOCUS_OR_CREATE('Civitai', {})}
                        icon={<img style={{ width: '1em', height: '1em' }} src={assets.CivitaiLogo_png}></img>}
                        shortcut={KEYS.openPage_Civitai}
                        label='Civitai (iframe)'
                    />

                    <MenuItem
                        onClick={() => st.layout.FOCUS_OR_CREATE('Squoosh', {})}
                        icon={<img style={{ width: '1em', height: '1em' }} src={assets.logos_squoosh_png}></img>}
                        shortcut={KEYS.openPage_Squoosh}
                        label='Squoosh'
                    />
                    <MenuItem
                        onClick={() => st.layout.FOCUS_OR_CREATE('IFrame', { url: 'https://app.posemy.art/' })}
                        icon={<span className='material-symbols-outlined text-red-400'>brush</span>}
                        shortcut={KEYS.openPage_Posemy}
                        label='3d Poser (posemy.art)'
                    />
                    <MenuItem
                        onClick={() => st.layout.FOCUS_OR_CREATE('Paint', {})}
                        icon={<span className='material-symbols-outlined text-red-400'>brush</span>}
                        shortcut={KEYS.openPage_Paint}
                        label='Minipaint'
                    />
                    <MenuItem
                        onClick={() => st.layout.FOCUS_OR_CREATE('IFrame', { url: 'https://unsplash.com/' })}
                        icon={<span className='material-symbols-outlined text-purple-400'>image_search</span>}
                        shortcut={KEYS.openPage_Unsplash}
                        label='Unsplash - Free images'
                    />
                </>
            )}
        />
    )
})
