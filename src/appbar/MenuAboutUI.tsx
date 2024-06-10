import { observer } from 'mobx-react-lite'

import { Dropdown } from '../csuite/dropdown/Dropdown'
import { MenuDivider, MenuItem } from '../csuite/dropdown/MenuItem'
import { Ikon } from '../csuite/icons/iconHelpers'
import { Button } from '../csuite/button/Button'
import { JsonViewUI } from '../widgets/workspace/JsonViewUI'

export const MenuAboutUI = observer(function MenuAboutUI_(p: {}) {
    return (
        <Dropdown
            // startIcon={<span className='material-symbols-outlined'>help_center</span>}
            title='About'
            content={() => (
                <>
                    <MenuItem
                        onClick={() => {
                            void window.require('electron').shell.openExternal('https://github.com/rvion/CushyStudio#readme')
                        }}
                        icon={<Ikon.mdiGithub />}
                        label='Github'
                    />
                    <MenuItem
                        onClick={() => {
                            void window.require('electron').shell.openExternal('https://www.CushyStudio.com')
                        }}
                        icon={<Ikon.mdiWeb />}
                        label='Documentation'
                    />
                    <MenuItem
                        onClick={() => {
                            void window.require('electron').shell.openExternal('https://www.CushyStudio.com/blog')
                        }}
                        icon={<Ikon.mdiPost />}
                        label='Blog'
                    />

                    <MenuDivider // TODO(bird_d): Github integration should be moved inside the CushyStudio "Button" when that's a thing.
                    >
                        Github Integration
                        {cushy.auth.isConnected ? (
                            <Button //
                                icon='mdiLogout'
                                onClick={() => cushy.auth.logout()}
                            />
                        ) : (
                            <Button //
                                icon='mdiLogin'
                                onClick={() => void cushy.auth.startLoginFlowWithGithub()}
                            />
                        )}
                    </MenuDivider>
                    {cushy.auth.user ? <JsonViewUI value={cushy.auth.user} /> : 'Not connected to GitHub'}
                </>
            )}
        />
    )
})
