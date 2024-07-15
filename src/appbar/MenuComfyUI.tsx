import type { HostL } from '../models/Host'

import { observer } from 'mobx-react-lite'

import { openFolderInOS } from '../app/layout/openExternal'
import { Button } from '../csuite/button/Button'
import { Dropdown } from '../csuite/dropdown/Dropdown'
import { MenuDivider, MenuItem } from '../csuite/dropdown/MenuItem'
import { Ikon } from '../csuite/icons/iconHelpers'
import { useSt } from '../state/stateContext'

export const MenuComfyUI = observer(function MenuComfyUI_(p: {}) {
    const st = useSt()
    const isConnected = st.ws?.isOpen ?? false
    return (
        <Dropdown
            expand
            tw={[isConnected ? null : 'text-error-content bg-error']}
            // startIcon={<span /* tw='text-blue-400' */ className='material-symbols-outlined'>account_tree</span>}
            theme={isConnected ? undefined : { chroma: 0.1, hue: 0, contrast: 1 }}
            title='ComfyUI'
            content={() => (
                <>
                    <MenuItem onClick={() => st.layout.FOCUS_OR_CREATE('ComfyUI', {})} label='ComfyUI' icon={'cdiNodes'} />
                    <MenuItem //
                        onClick={() => st.layout.FOCUS_OR_CREATE('ComfyUINodeExplorer', {})}
                        label='Nodes Explorer'
                    />
                    <MenuDivider>
                        <div
                            tw='flex' // TODO(bird_d: JOINER)
                        >
                            <Button
                                icon='mdiClipboard'
                                onClick={() => {
                                    void navigator.clipboard.writeText(cushy.configFile.value.mainComfyHostID ?? '')
                                }}
                            >
                                Primary Host
                            </Button>
                            <Button
                                icon='mdiFolderOpen'
                                onClick={(ev) => {
                                    ev.stopPropagation()
                                    ev.preventDefault()
                                    return openFolderInOS(
                                        `${cushy.rootPath}/schema/hosts/${cushy.configFile.value.mainComfyHostID}` as AbsolutePath,
                                    )
                                }}
                            />
                        </div>
                    </MenuDivider>
                    <HostMenuItemUI host={st.mainHost} />
                    <MenuDivider>
                        <Button //
                            subtle
                            onClick={() => cushy.layout.FOCUS_OR_CREATE('Hosts', {})}
                            icon='mdiOpenInApp'
                        >
                            Hosts
                        </Button>
                    </MenuDivider>
                    {st.hosts.map((host) => {
                        return <HostMenuItemUI key={host.id} host={host} />
                    })}
                </>
            )}
        />
    )
})

const HostMenuItemUI = observer(function HostMenuItemUI_(p: { host: HostL }) {
    const host = p.host
    const isMain = host.id === cushy.configFile.value.mainComfyHostID
    return (
        <MenuItem //
            icon={isMain ? 'mdiServerNetwork' : null}
            onClick={() => host.electAsPrimary()}
        >
            <div tw='flex-grow pr-3'>{host.data.name}</div>
            <Button
                subtle
                icon='cdiNodes'
                onClick={(ev) => {
                    ev.preventDefault()
                    ev.stopPropagation()
                    cushy.layout.FOCUS_OR_CREATE('ComfyUI', {})
                }}
            />
        </MenuItem>
    )
})
