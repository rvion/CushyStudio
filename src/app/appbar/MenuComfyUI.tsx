import type { HostL } from '../../models/Host'

import { observer } from 'mobx-react-lite'

import { Dropdown, MenuItem } from '../../rsuite/Dropdown'
import { useSt } from '../../state/stateContext'
import { openFolderInOS } from '../layout/openExternal'

export const MenuComfyUI = observer(function MenuComfyUI_(p: {}) {
    const st = useSt()
    const isConnected = st.ws?.isOpen ?? false
    return (
        <Dropdown
            tw={[isConnected ? null : 'text-error-content bg-error']}
            startIcon={<span className='material-symbols-outlined text-blue-400'>account_tree</span>}
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
                        <div
                            className='btn btn-xs'
                            onClick={(ev) => {
                                ev.stopPropagation()
                                ev.preventDefault()
                                openFolderInOS(`${cushy.rootPath}/schema/hosts/${host.id}` as AbsolutePath)
                            }}
                        >
                            <span className='material-symbols-outlined'>open_in_new</span>
                        </div>
                    </div>
                )}
            </div>
            <div className='join'>
                <div
                    className='btn btn-xs'
                    onClick={(ev) => {
                        ev.preventDefault()
                        ev.stopPropagation()
                        cushy.layout.FOCUS_OR_CREATE('Hosts', {})
                    }}
                >
                    <span className='material-symbols-outlined'>settings</span>
                </div>
                <div
                    className='btn btn-xs'
                    onClick={(ev) => {
                        ev.preventDefault()
                        ev.stopPropagation()
                        cushy.layout.FOCUS_OR_CREATE('ComfyUI', {})
                    }}
                >
                    <span className='material-symbols-outlined'>open_in_browser</span>
                </div>
                <div
                    className='btn btn-xs'
                    onClick={(ev) => {
                        ev.preventDefault()
                        ev.stopPropagation()
                        cushy.layout.FOCUS_OR_CREATE('ComfyUI', {}, 'full')
                    }}
                >
                    <span className='material-symbols-outlined'>open_in_full</span>
                </div>
            </div>
        </MenuItem>
    )
})
