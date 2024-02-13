import type { ModelInfo } from 'src/manager/model-list/model-list-loader-types'

import { observer } from 'mobx-react-lite'
import { useSt } from 'src/state/stateContext'
import { renderStatus } from './renderStatus'

export const Button_InstalModelViaManagerUI = observer(function Button_InstalModelViaManagerUI_(p: {
    //
    optional: boolean
    modelInfo: ModelInfo
}) {
    const mi = p.modelInfo
    const st = useSt()
    const host = st.mainHost
    const modelStatus = host.manager.getModelStatus(p.modelInfo.name)
    const isInstalled = modelStatus === 'installed'
    return (
        <div tw={[isInstalled ? 'bg-success-1' : null, 'flex flex-col virtualBorder p-2 bg-base-100 rounded']}>
            <div tw='flex items-center'>
                <span tw='font-bold whitespace-nowrap text-xl text-fuchsia-500'>
                    <span className='material-symbols-outlined'>model_training</span>
                </span>
                <div tw='font-bold'>MODEL: {mi.name}</div>
                <div>{modelStatus}</div>
                {isInstalled ? '✅' : null}
                <div tw='flex-1'></div>
                {renderStatus(modelStatus, p.optional)}
                {!isInstalled && (
                    <div
                        tw='btn btn-sm btn-outline btn-sm'
                        onClick={async () => {
                            // 🔴 TODO
                            // https://github.com/ltdrdata/ComfyUI-Manager/blob/main/js/model-downloader.js#L11
                            // copy Data-it implementation
                            // download file
                            const res = await host.manager.installModel(mi)
                            if (!res) return

                            // const res = await host.downloadFileIfMissing(m.url, dlPath)
                            // retrieve the enum info
                            // add the new value (BRITTLE)
                            // ⏸️ const enumInfo = st.schema.knownEnumsByName //
                            // ⏸️     .get(p.widget.input.enumName)
                            // ⏸️ enumInfo?.values.push(mi.filename)
                        }}
                    >
                        <span className='material-symbols-outlined'>cloud_download</span>
                        <span>Install</span>
                    </div>
                )}
            </div>
            <span tw='italic text-sm opacity-75 line-clamp-2'>
                {mi.description}

                {/* TODO: show install method by icon? */}
                {/* (via {plugin.install_type}) */}
            </span>
            <details
                onClick={(e) => {
                    e.stopPropagation()
                }}
            >
                <summary>more...</summary>
                <div tw='flex gap-1'>
                    {/* <div tw='font-bold'>Author:</div> */}
                    {/* <div tw='opacity-75'>{plugin.author}</div> */}
                    {/* <div>{getCustomNodeRegistry()}</div> */}
                    <pre>{JSON.stringify(host.manager.modelList, null, 3)}</pre>
                </div>
            </details>
        </div>
    )
})
