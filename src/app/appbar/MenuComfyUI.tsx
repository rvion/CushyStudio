import type { HostL } from '../../models/Host'

import { observer } from 'mobx-react-lite'

import { Button } from '../../rsuite/button/Button'
import { Dropdown } from '../../rsuite/dropdown/Dropdown'
import { MenuItem } from '../../rsuite/dropdown/MenuItem'
import { useSt } from '../../state/stateContext'
import { openFolderInOS } from '../layout/openExternal'

export const MenuComfyUI = observer(function MenuComfyUI_(p: {}) {
    const st = useSt()
    const isConnected = st.ws?.isOpen ?? false
    return (
        <Dropdown
            tw={[isConnected ? null : 'text-error-content bg-error']}
            // startIcon={<span /* tw='text-blue-400' */ className='material-symbols-outlined'>account_tree</span>}
            theme={isConnected ? undefined : { chroma: 0.1, hue: 0, contrast: 1 }}
            title='ComfyUI'
            content={() => (
                <>
                    <MenuItem
                        onClick={() => st.layout.FOCUS_OR_CREATE('ComfyUI', {})}
                        label='ComfyUI'
                        icon={<span className='material-symbols-outlined text-cyan-400'>account_tree</span>}
                    />
                    <MenuItem
                        onClick={() => st.layout.FOCUS_OR_CREATE('ComfyUINodeExplorer', {})}
                        icon={<span className='material-symbols-outlined text-cyan-400'>explore</span>}
                        label='Nodes Explorer'
                    />
                    {/* {Boolean(st.configFile.value.comfyUIHosts?.length) ? null : (
                        <MenuItem
                            onClick={() => st.layout.FOCUS_OR_CREATE('Hosts', {})}
                            icon={<span className='material-symbols-outlined text-cyan-400'>settings</span>}
                            label='ComfyUI Hosts'
                        />
                    )} */}
                    <HostMenuItemUI host={st.mainHost} showID />
                    <div className='divider'>All hosts</div>
                    {st.hosts.map((host) => {
                        return <HostMenuItemUI key={host.id} host={host} />
                    })}
                </>
            )}
        />
    )
})

export const HostMenuItemUI = observer(function HostMenuItemUI_(p: { host: HostL; showID?: boolean }) {
    const host = p.host
    const isMain = host.id === cushy.configFile.value.mainComfyHostID
    return (
        <MenuItem
            icon={
                <span
                    tw={[isMain && (cushy.ws?.isOpen ?? false ? 'text-green-500' : 'text-red-500')]}
                    className='material-symbols-outlined'
                >
                    desktop_mac
                </span>
            }
            onClick={() => host.electAsPrimary()}
        >
            <div tw='flex-grow'>
                <div>{host.data.name}</div>
                {p.showID && (
                    <div tw='opacity-50 text-xs'>
                        {host.id}
                        <Button
                            onClick={(ev) => {
                                ev.stopPropagation()
                                ev.preventDefault()
                                return openFolderInOS(`${cushy.rootPath}/schema/hosts/${host.id}` as AbsolutePath)
                            }}
                        >
                            <span className='material-symbols-outlined'>open_in_new</span>
                        </Button>
                    </div>
                )}
            </div>
            <div className='join'>
                <Button
                    subtle
                    icon='mdiOpenInApp'
                    onClick={(ev) => {
                        ev.preventDefault()
                        ev.stopPropagation()
                        cushy.layout.FOCUS_OR_CREATE('Hosts', {})
                    }}
                />
                <Button
                    subtle
                    icon='mdiOpenInNew'
                    onClick={(ev) => {
                        ev.preventDefault()
                        ev.stopPropagation()
                        cushy.layout.FOCUS_OR_CREATE('ComfyUI', {})
                    }}
                />
                <Button
                    subtle
                    icon='mdiFullscreen'
                    onClick={(ev) => {
                        ev.preventDefault()
                        ev.stopPropagation()
                        cushy.layout.FOCUS_OR_CREATE('ComfyUI', {}, 'full')
                    }}
                ></Button>
            </div>
        </MenuItem>
    )
})
