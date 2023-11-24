import { observer } from 'mobx-react-lite'
import {
    ComfyHostDef,
    ComfyHostID,
    DEFAULT_COMFYUI_INSTANCE_ID,
    mkCloudHostConfig,
    mkLocalNetworkHostConfig,
} from 'src/config/ComfyHostDef'
import { Button, Input, Joined, Panel, Toggle } from 'src/rsuite/shims'
import { useSt } from 'src/state/stateContext'

export const LabelUI = observer(function LabelUI_(p: { children: React.ReactNode }) {
    return <div tw='whitespace-nowrap'>{p.children}: </div>
})
export const Panel_ComfyUIHosts = observer(function Panel_ComfyUIHosts_(p: {}) {
    const st = useSt()
    const config = st.configFile.value

    const mainHostID = config.mainComfyHostID ?? DEFAULT_COMFYUI_INSTANCE_ID
    const mainHost = config.comfyUIHosts?.find((h) => h.id === mainHostID)

    const allHosts = config.comfyUIHosts ?? []

    // const mainComfyHost = config.comfyHost
    // const mainComfyPort = config.comfyPort
    // const machines = st.configFile.value.comfyUIHosts
    return (
        <Panel>
            <div>current machine {mainHostID}</div>
            <Joined>
                <Button
                    size='sm'
                    onClick={() => {
                        st.configFile.update(() => {
                            config.comfyUIHosts?.push(mkLocalNetworkHostConfig())
                        })
                    }}
                >
                    Add (local network)
                </Button>
                <Button
                    size='sm'
                    onClick={() => {
                        st.configFile.update(() => {
                            config.comfyUIHosts?.push(mkCloudHostConfig())
                        })
                    }}
                >
                    Add (cloud)
                </Button>
            </Joined>
            <div tw='flex flex-wrap gap-2 p-2'>
                {allHosts?.map((host) => {
                    return <HostUI host={host} />
                })}
            </div>
        </Panel>
    )
})

export const HostUI = observer(function MachineUI_(p: { host: ComfyHostDef }) {
    const st = useSt()
    const config = st.configFile.value
    const host = p.host
    const isMain = host.id === config.mainComfyHostID

    return (
        <div
            tw={[
                //
                'p-2 bg-base-100 w-96 shadow-xl',
                isMain && 'bg-base-300',
            ]}
        >
            <div className='p-2 flex flex-col gap-1'>
                {/* SELECT BTN */}
                <Joined tw='flex gap-3'>
                    <div
                        tw={[`btn btn-md btn-${isMain ? 'primary' : ''} flex-grow font-bold`]}
                        onClick={() => st.configFile.update({ mainComfyHostID: host.id })}
                    >
                        {host.name ?? `${host.hostname}:${host.port}`}
                    </div>
                    <div
                        tw='btn btn-error btn-error'
                        onClick={() => {
                            st.configFile.update(() => {
                                if (config.mainComfyHostID === host.id) config.mainComfyHostID = null
                                const index = config.comfyUIHosts?.indexOf(host)
                                if (index != null) config.comfyUIHosts?.splice(index, 1)
                            })
                        }}
                    >
                        <span className='material-symbols-outlined'>delete_forever</span>
                    </div>
                </Joined>

                {/* NAME */}
                <div tw='flex gap-2'>
                    <LabelUI>name</LabelUI>
                    <input
                        tw='input input-bordered input-sm w-full'
                        onChange={(ev) => {
                            const next = ev.target.value
                            host.name = next
                        }}
                        value={host.name ?? 'unnamed'}
                    ></input>
                </div>

                {/* NAME */}
                <div tw='flex gap-2'>
                    <LabelUI>name</LabelUI>
                    <input
                        disabled
                        tw='input input-bordered input-sm w-full'
                        onChange={(ev) => {
                            const next = ev.target.value
                            host.id = next as ComfyHostID
                        }}
                        value={host.id ?? 'unnamed'}
                    ></input>
                </div>

                {/* HOST */}
                <div tw='flex items-center gap-1'>
                    <LabelUI>Host</LabelUI>
                    <input
                        tw='input input-bordered input-sm w-full' //
                        onChange={(ev) => {
                            const next = ev.target.value
                            host.hostname = next
                            st.configFile.save()
                        }}
                        value={host.hostname}
                    ></input>
                </div>

                {/* PORT */}
                <div tw='flex items-center gap-1'>
                    <LabelUI>Port</LabelUI>
                    <input
                        tw='input input-bordered input-sm w-full' //
                        value={host.port}
                    ></input>
                </div>

                {/* HTTPS */}
                <div tw='flex gap-2'>
                    <LabelUI>use HTTPS</LabelUI>
                    <Toggle //
                        checked={host.useHttps}
                        onChange={(ev) => {
                            const next = ev.target.checked
                            host.useHttps = next
                            st.configFile.save()
                        }}
                        name='useHttps'
                    />
                </div>

                {/* LOCAL PATH */}
                <div tw='flex items-center gap-1'>
                    <LabelUI>is local</LabelUI>
                    <Toggle
                        onChange={(ev) => {
                            const next = ev.target.checked
                            host.isLocal = next
                        }}
                        checked={host.isLocal ?? false}
                    />
                    <input
                        tw='input input-bordered input-sm w-full'
                        type='string'
                        disabled={!Boolean(host.isLocal)}
                        value={host.localPath}
                    ></input>
                </div>
            </div>
        </div>
    )
})
