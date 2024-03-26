import { observer } from 'mobx-react-lite'

import { Dropdown, MenuItem } from '../../rsuite/Dropdown'
import { assets } from '../../utils/assets/assets'

export const MenuHelpUI = observer(function MenuHelpUI_(p: {}) {
    return (
        <Dropdown
            startIcon={<span className='material-symbols-outlined text-purple-500'>help_center</span>}
            title='Help'
            content={() => (
                <>
                    {/* <MenuItem
                        onClick={() => { window.require('electron').shell.openExternal('https://www.CushyStudio.com/documentation') }}
                        icon={<span className='material-symbols-outlined text-purple-300'>menu_book</span>}
                        label='Open documentation'
                    /> */}
                    <MenuItem
                        onClick={() => {
                            window.require('electron').shell.openExternal('https://github.com/rvion/CushyStudio#readme')
                        }}
                        icon={<img style={{ width: '1rem', height: '1rem' }} src={assets.GithubLogo2_png}></img>}
                        label='Open Github'
                    />
                    <MenuItem
                        onClick={() => {
                            window.require('electron').shell.openExternal('https://www.CushyStudio.com')
                        }}
                        icon={<img style={{ width: '1rem', height: '1rem' }} src={assets.GithubLogo2_png}></img>}
                        label='Open Website'
                    />
                    <MenuItem
                        onClick={() => {
                            window.require('electron').shell.openExternal('https://www.CushyStudio.com/blog')
                        }}
                        icon={<span className='material-symbols-outlined text-purple-300'>web</span>}
                        label='Open blog'
                    />
                </>
            )}
        />
    )
})
