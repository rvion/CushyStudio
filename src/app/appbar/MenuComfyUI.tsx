import { observer } from 'mobx-react-lite'
import { Dropdown, MenuItem } from 'src/rsuite/Dropdown'
import { useSt } from '../../state/stateContext'

export const MenuComfyUI = observer(function MenuComfyUI_(p: {}) {
    const st = useSt()
    const isConnected = st.ws?.isOpen ?? false
    return (
        <Dropdown
            tw={[isConnected ? null : 'text-error-content bg-error']}
            startIcon={<span className='material-symbols-outlined text-blue-400'>account_tree</span>}
            title='ComfyUI'
        >
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
            <div className='divider'>hosts</div>
            {st.hosts.map((host) => {
                const isMain = host.id === st.configFile.value.mainComfyHostID
                return (
                    <MenuItem
                        //
                        icon={
                            <span
                                tw={[isMain ? (isConnected ? 'text-green-500' : 'text-red-500') : null]}
                                className='material-symbols-outlined'
                            >
                                desktop_mac
                            </span>
                        }
                        onClick={() => host.electAsPrimary()}
                        key={host.id}
                    >
                        <div tw='flex-grow'>{host.data.name}</div>
                        <div className='join'>
                            <div
                                className='btn btn-xs'
                                onClick={(ev) => {
                                    ev.preventDefault()
                                    ev.stopPropagation()
                                    st.layout.FOCUS_OR_CREATE('Hosts', {})
                                }}
                            >
                                <span className='material-symbols-outlined'>settings</span>
                            </div>
                            <div
                                className='btn btn-xs'
                                onClick={(ev) => {
                                    ev.preventDefault()
                                    ev.stopPropagation()
                                    st.layout.FOCUS_OR_CREATE('ComfyUI', {})
                                }}
                            >
                                <span className='material-symbols-outlined'>open_in_browser</span>
                            </div>
                            <div
                                className='btn btn-xs'
                                onClick={(ev) => {
                                    ev.preventDefault()
                                    ev.stopPropagation()
                                    st.layout.FOCUS_OR_CREATE('ComfyUI', {}, 'full')
                                }}
                            >
                                <span className='material-symbols-outlined'>open_in_full</span>
                            </div>
                        </div>
                    </MenuItem>
                )
            })}
        </Dropdown>
    )
})
