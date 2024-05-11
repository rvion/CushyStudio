import { mdiGithub, mdiPost } from '@mdi/js'
import Icon from '@mdi/react'
import { observer } from 'mobx-react-lite'

import { Dropdown, MenuItem } from '../../rsuite/Dropdown'

export const MenuHelpUI = observer(function MenuHelpUI_(p: {}) {
    return (
        <Dropdown
            // startIcon={<span className='material-symbols-outlined'>help_center</span>}
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
                        icon={<Icon path={mdiGithub} size={1} />}
                        label='Open Github'
                    />
                    <MenuItem
                        onClick={() => {
                            window.require('electron').shell.openExternal('https://www.CushyStudio.com')
                        }}
                        icon={<Icon path={mdiGithub} size={1} />}
                        label='Open Website'
                    />
                    <MenuItem
                        onClick={() => {
                            window.require('electron').shell.openExternal('https://www.CushyStudio.com/blog')
                        }}
                        icon={
                            <Icon path={mdiPost} size={1} />
                            // <span className='material-symbols-outlined text-purple-300'>web</span>
                        }
                        label='Open blog'
                    />
                </>
            )}
        />
    )
})
