import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'

import { LabelUI } from '../LabelUI'
import { SQLITE_false, SQLITE_true } from 'src/db/SQLITE_boolean'
import { HostL } from 'src/models/Host'
import { HostSchemaIndicatorUI } from 'src/panels/host/HostSchemaIndicatorUI'
import { HostWebsocketIndicatorUI } from 'src/panels/host/HostWebsocketIndicatorUI'
import { Joined, Toggle } from 'src/rsuite/shims'
import { useSt } from 'src/state/stateContext'

export const HostUI = observer(function MachineUI_(p: { host: HostL }) {
    const st = useSt()
    const config = st.configFile.value
    const host: HostL = p.host
    const isMain = host.id === config.mainComfyHostID
    const disabled = host.data.isVirtual ? true : false
    return (
        <div
            tw={[
                //
                'virtualBorder',
                'p-2 bg-base-200 w-96 shadow-xl',
                isMain && 'bg-primary bg-opacity-30',
            ]}
        >
            {/* {host.data.isReadonly ? (
                <div tw='bg-secondary text-secondary-content p-0.5 opacity-50'>Readonly Host (Built-in)</div>
            ) : (
                <div tw='bg-base-100 p-0.5'>Custom Host</div>
            )} */}
            <div tw='flex gap-1'>
                <HostWebsocketIndicatorUI showIcon host={host} />
                {host.data.isVirtual ? (
                    <div tw='bg-info text-info-content p-0.5 opacity-50'>Virtual Host (Types Only)</div>
                ) : (
                    <HostSchemaIndicatorUI showIcon showSize host={host} />
                )}
            </div>

            <div className='p-2 flex flex-col gap-1'>
                {/* SELECT BTN */}
                <Joined tw='flex '>
                    <div
                        tw={[
                            //
                            isMain ? 'btn-success' : 'btn-info btn-outline',
                            `btn btn-sm flex-grow font-bold`,
                        ]}
                        onClick={() => host.electAsPrimary()}
                    >
                        Set Primary
                        {/* {host.data.name ?? `${host.data.hostname}:${host.data.port}`} */}
                    </div>
                    <div onClick={() => host.CONNECT()} tw='btn btn-sm btn-outline'>
                        {host.isConnected ? 'Re-Connect' : 'Connect'}
                    </div>
                    <div
                        tw={['btn btn-outline btn-square btn-sm', host.isReadonly && 'btn-disabled']}
                        onClick={() => {
                            if (host.isReadonly) return
                            runInAction(() => {
                                host.schema.delete()
                                host.delete()
                            })
                            // st.configFile.update(() => {
                            //     if (config.mainComfyHostID === host.id) config.mainComfyHostID = null
                            //     const index = config.comfyUIHosts?.indexOf(host)
                            //     if (index != null) config.comfyUIHosts?.splice(index, 1)
                            // })
                        }}
                    >
                        <span className='material-symbols-outlined'>delete_forever</span>
                    </div>
                </Joined>

                {/* <div tw='divider m-1'></div> */}
                {/* <div tw='font-bold under'>Configuration</div> */}
                {/* NAME */}
                <div tw='flex gap-1 items-center'>
                    <div tw='w-14'>name</div>
                    <input
                        disabled={disabled}
                        tw='input input-bordered input-sm w-full'
                        onChange={(ev) => host.update({ name: ev.target.value })}
                        value={host.data.name ?? 'unnamed'}
                    ></input>
                </div>

                {/* HOST */}
                <div tw='flex gap-1 items-center'>
                    <div tw='w-14'>Host</div>
                    <input
                        disabled={disabled}
                        tw='input input-bordered input-sm w-full' //
                        onChange={(ev) => host.update({ hostname: ev.target.value })}
                        value={host.data.hostname ?? ''}
                    ></input>
                </div>

                {/* PORT */}
                <div tw='flex gap-1 items-center'>
                    <div tw='w-14'>Port</div>
                    <input
                        disabled={disabled}
                        tw='input input-bordered input-sm w-full' //
                        value={host.data.port ?? 8188}
                        onChange={(ev) => {
                            const next = ev.target.value
                            host.update({ port: parseInt(next, 10) })
                        }}
                    ></input>
                </div>

                {/* HTTPS */}
                <div tw='flex gap-2'>
                    <Toggle //
                        disabled={disabled}
                        checked={host.data.useHttps ? true : false}
                        onChange={(ev) => host.update({ useHttps: ev.target.checked ? SQLITE_true : SQLITE_false })}
                        name='useHttps'
                    />
                    <LabelUI>use HTTPS</LabelUI>
                </div>

                {/* LOCAL PATH */}
                <div tw='flex items-center gap-1'>
                    <Toggle
                        //
                        disabled={disabled}
                        onChange={(ev) => host.update({ isLocal: ev.target.checked ? SQLITE_true : SQLITE_false })}
                        checked={host.data.isLocal ? true : false}
                    />
                    <LabelUI>is local</LabelUI>
                </div>
                <div tw='flex flex-col'>
                    <LabelUI>absolute path to ComfyUI install folder</LabelUI>
                    <input
                        disabled={disabled}
                        tw='input input-bordered input-sm w-full'
                        type='string'
                        onChange={(ev) => host.update({ absolutePathToComfyUI: ev.target.value })}
                        value={host.data.absolutePathToComfyUI ?? ''}
                    ></input>
                </div>
                <div tw='flex flex-col'>
                    <LabelUI>Absolute path to model folder</LabelUI>
                    <input
                        tw='input input-bordered input-sm w-full'
                        type='string'
                        disabled={disabled}
                        onChange={(ev) => host.update({ absolutPathToDownloadModelsTo: ev.target.value })}
                        value={host.data.absolutPathToDownloadModelsTo ?? ''}
                    ></input>
                </div>
                {/* ID */}
                <div tw='flex'>
                    <div tw='italic text-xs text-opacity-50'>id: {host.id}</div>
                </div>
            </div>
            {/* <div tw='divider m-1'></div> */}
            {/* <div tw='font-bold under'>Status</div> */}
            {/* STATUS */}
            {/* <div tw='flex gap-1'>
                <HostWebsocketIndicatorUI showIcon host={host} />
                <HostSchemaIndicatorUI showIcon showSize host={host} />
            </div> */}
            {/* <div>
                <div>isLoaded: {host.isConnected ? 'true' : 'false'}</div>
            </div> */}
            {/* STATUS */}
        </div>
    )
})
