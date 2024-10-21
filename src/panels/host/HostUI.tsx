import type { HostL } from '../../models/Host'

import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'

import { Button } from '../../csuite/button/Button'
import { InputBoolUI } from '../../csuite/checkbox/InputBoolUI'
import { FrameWithCSuiteOverride } from '../../csuite/ctx/CSuiteOverride'
import { Frame } from '../../csuite/frame/Frame'
import { InputStringUI } from '../../csuite/input-string/InputStringUI'
import { knownOKLCHHues } from '../../csuite/tinyCSS/knownHues'
import { SQLITE_false, SQLITE_true } from '../../csuite/types/SQLITE_boolean'
import { useSt } from '../../state/stateContext'
import { LabelUI } from '../LabelUI'
import { HostSchemaIndicatorUI } from './HostSchemaIndicatorUI'
import { HostWebsocketIndicatorUI } from './HostWebsocketIndicatorUI'

export const HostUI = observer(function MachineUI_(p: { host: HostL }) {
    const st = useSt()
    const config = st.configFile.value
    const host: HostL = p.host
    const isMain = host.id === config.mainComfyHostID
    const disabled = host.data.isVirtual ? true : false
    return (
        <Frame
            base={{
                contrast: isMain ? 0.1 : 0.03,
                chroma: isMain ? 0.05 : undefined,
                hue: isMain ? knownOKLCHHues.success : undefined,
            }}
            border={10}
            tw={['w-96 p-2 shadow-xl', isMain && 'bg-primary bg-opacity-30']}
        >
            <div tw='flex gap-1'>
                <HostWebsocketIndicatorUI showIcon host={host} />
                {host.data.isVirtual ? (
                    <div tw='bg-info text-info-content p-0.5 opacity-50'>Virtual Host (Types Only)</div>
                ) : (
                    <HostSchemaIndicatorUI showIcon showSize host={host} />
                )}
            </div>

            <div className='flex flex-col gap-1 p-2'>
                {/* SELECT BTN */}
                <FrameWithCSuiteOverride line config={{ inputHeight: 3 }}>
                    <Button look='success' expand active={isMain} onClick={() => host.electAsPrimary()} children='Set Primary' />
                    <Button look='ghost' onClick={() => host.CONNECT()} children={host.isConnected ? 'Re-Connect' : 'Connect'} />
                    <Button
                        look='ghost'
                        icon='mdiContentDuplicate'
                        onClick={() => host.clone({ name: host.data.name + '-clone' })}
                        children='clone'
                    />
                    <Button
                        icon='mdiDelete'
                        disabled={host.isReadonly}
                        onClick={() => {
                            if (host.isReadonly) return
                            runInAction(() => {
                                host.schema.delete({})
                                host.delete({})
                            })
                            // st.configFile.update(() => {
                            //     if (config.mainComfyHostID === host.id) config.mainComfyHostID = null
                            //     const index = config.comfyUIHosts?.indexOf(host)
                            //     if (index != null) config.comfyUIHosts?.splice(index, 1)
                            // })
                        }}
                    ></Button>
                </FrameWithCSuiteOverride>

                {/* <div tw='divider m-1'></div> */}
                {/* <div tw='font-bold under'>Configuration</div> */}
                {/* NAME */}
                <div tw='flex items-center gap-1'>
                    <div tw='w-14'>name</div>
                    <input
                        disabled={disabled}
                        tw='csuite-basic-input w-full'
                        onChange={(ev) => host.update({ name: ev.target.value })}
                        value={host.data.name ?? 'unnamed'}
                    ></input>
                </div>

                {/* HOST */}
                <div tw='flex items-center gap-1'>
                    <div tw='w-14'>Host</div>
                    <input
                        disabled={disabled}
                        tw='csuite-basic-input w-full' //
                        onChange={(ev) => host.update({ hostname: ev.target.value })}
                        value={host.data.hostname ?? ''}
                    ></input>
                </div>

                {/* PORT */}
                <div tw='flex items-center gap-1'>
                    <div tw='w-14'>Port</div>
                    <input
                        disabled={disabled}
                        tw='csuite-basic-input w-full' //
                        value={host.data.port ?? 8188}
                        onChange={(ev) => {
                            const next = ev.target.value
                            host.update({ port: parseInt(next, 10) })
                        }}
                    ></input>
                </div>

                <InputBoolUI // HTTPS
                    toggleGroup='host-flags'
                    disabled={disabled}
                    value={host.data.useHttps ? true : false}
                    onValueChange={(next) => host.update({ useHttps: next ? SQLITE_true : SQLITE_false })}
                    text='use HTTPS'
                />
                <InputBoolUI // LOCAL PATH
                    toggleGroup='host-flags'
                    disabled={disabled}
                    onValueChange={(next) => host.update({ isLocal: next ? SQLITE_true : SQLITE_false })}
                    value={host.data.isLocal ? true : false}
                    text='Is local'
                />

                <div tw='flex flex-col'>
                    <LabelUI>absolute path to ComfyUI install folder</LabelUI>
                    <input
                        disabled={disabled}
                        tw='csuite-basic-input w-full'
                        type='string'
                        onChange={(ev) => host.update({ absolutePathToComfyUI: ev.target.value })}
                        value={host.data.absolutePathToComfyUI ?? ''}
                    ></input>
                </div>
                <div tw='flex flex-col'>
                    <LabelUI>Absolute path to model folder</LabelUI>
                    <InputStringUI
                        tw='w-full'
                        disabled={disabled}
                        setValue={(next) => host.update({ absolutPathToDownloadModelsTo: next })}
                        getValue={() => host.data.absolutPathToDownloadModelsTo ?? ''}
                    />
                </div>
                {/* ID */}
                <div tw='flex'>
                    <div tw='text-xs italic text-opacity-50'>id: {host.id}</div>
                </div>
                <Button
                    onClick={async () => {
                        const res = await host.manager.configureLogging(true)
                        console.log(`[🤠] res=`, res)
                    }}
                >
                    Forward logs via manager
                </Button>
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
        </Frame>
    )
})
