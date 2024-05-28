import { observer } from 'mobx-react-lite'
import { resolve } from 'pathe'

import { SQLITE_false } from '../db/SQLITE_boolean'
import { SelectUI } from '../rsuite/SelectUI'
import { Surface } from '../rsuite/shims'
import { useSt } from '../state/stateContext'
import { asAbsolutePath } from '../utils/fs/pathUtils'
import { HostUI } from './host/HostUI'

export const Panel_ComfyUIHosts = observer(function Panel_ComfyUIHosts_(p: { hostID?: HostID }) {
    const st = useSt()
    const allHosts = st.hosts
    const mainHost = st.mainHost

    return (
        <Surface tw='w-full h-full flex flex-col gap-2 p-2'>
            {/* <div tw='flex flex-wrap gap-2'>
                <SelectUI<HostL>
                    label='Current Host'
                    options={() => allHosts}
                    value={() => mainHost}
                    onChange={null}
                    getLabelText={(h) => h.data.name || h.id}
                />
            </div> */}
            <div tw='flex gap-1'>
                <div tw='virtualBorder p-2 rounded flex items-center gap-2 bg-info-2'>
                    <span className='material-symbols-outlined'>info</span>
                    The Primary host is the one used for typigns, and to send prompts to by default.
                </div>
            </div>
            <div className='line'>
                <div>Primary Host:</div>
                <SelectUI
                    //
                    options={() => allHosts}
                    value={() => mainHost}
                    getLabelText={(host) => host.data.name}
                    onChange={(host) => host.electAsPrimary()}
                />
            </div>
            <div tw='text-xl font-bold'>
                My Custom Hosts <AddHostBtnUI />
            </div>
            <div tw='flex flex-wrap gap-2'>
                {allHosts
                    ?.filter((g) => !g.isReadonly)
                    .map((host) => {
                        return <HostUI key={host.id} host={host} />
                    })}
            </div>
            <div tw='divider'></div>
            <div tw='text-xl font-bold'>Pre-configured Hosts</div>
            <div tw='flex flex-wrap gap-2'>
                {allHosts
                    ?.filter((g) => g.isReadonly)
                    .map((host) => {
                        return <HostUI key={host.id} host={host} />
                    })}
            </div>
        </Surface>
    )
})

export const AddHostBtnUI = observer(function AddHostBtnUI_(p: {}) {
    const st = useSt()
    return (
        <div
            tw='btn-sm btn btn-primary'
            onClick={() => {
                st.configFile.update(() => {
                    st.db.host.create({
                        hostname: '192.168.1.19',
                        port: 8188,
                        name: '192.168.1.19',
                        isLocal: SQLITE_false,
                        useHttps: SQLITE_false,
                        absolutePathToComfyUI: asAbsolutePath(resolve('comfy')),
                        isVirtual: SQLITE_false,
                        isReadonly: SQLITE_false,
                    })
                })
            }}
        >
            <span className='material-symbols-outlined'>add</span>
            Add Host
        </div>
    )
})

// <div
//     tw='btn-sm btn btn-primary'
//     onClick={() => {
//         st.db.hosts.create({
//             name: `cloud_${nanoid()}`,
//             hostname: `...`,
//             port: 443,
//             isLocal: SQLITE_false,
//             useHttps: SQLITE_true,
//             absolutePathToComfyUI: asAbsolutePath(resolve('comfy')),
//             isVirtual: SQLITE_false,
//             isReadonly: SQLITE_false,
//         })
//     }}
// >
//     <span className='material-symbols-outlined'>add</span>
//     Add (cloud)
// </div>
