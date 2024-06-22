import { mdiGithub, mdiPost } from '@mdi/js'
import { Icon } from '@mdi/react'
import { observer } from 'mobx-react-lite'

import { Dropdown } from '../csuite/dropdown/Dropdown'
import { MenuItem } from '../csuite/dropdown/MenuItem'
import { Ikon } from '../csuite/icons/iconHelpers'

export const MenuHelpUI = observer(function MenuHelpUI_(p: {}) {
    return (
        <Dropdown
            // startIcon={<span className='material-symbols-outlined'>help_center</span>}
            title='Help'
            content={() => (
                <>
                    <MenuItem
                        onClick={() =>
                            window.require('electron').shell.openExternal('https://github.com/rvion/CushyStudio#readme')
                        }
                        icon='mdiGithub'
                        label='Open Github'
                    />
                    <MenuItem
                        onClick={() => window.require('electron').shell.openExternal('https://www.CushyStudio.com')}
                        icon='mdiGithub'
                        label='Open Website'
                    />
                    <MenuItem
                        onClick={() => window.require('electron').shell.openExternal('https://www.CushyStudio.com/blog')}
                        icon='mdiPost'
                        label='Open blog'
                    />
                </>
            )}
        />
    )
})
