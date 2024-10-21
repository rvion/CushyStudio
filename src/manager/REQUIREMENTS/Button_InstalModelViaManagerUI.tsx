import type { ModelInfo } from '../../manager/model-list/model-list-loader-types'

import { observer } from 'mobx-react-lite'

import { Button } from '../../csuite/button/Button'
import { useSt } from '../../state/stateContext'
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
        <div tw={['flex rounded', isInstalled ? 'bg-success-1' : null]}>
            {/* Button ------------------------------------ */}
            <div tw='w-16 text-sm'>
                {isInstalled ? (
                    '✅'
                ) : (
                    <div>
                        {host.manager.modelsBeeingInstalled.has(mi.name) ? (
                            <div tw='loading loading-spinner'></div>
                        ) : (
                            <Button
                                children='Install'
                                onClick={async () => {
                                    const res = await host.manager.installModel(mi)
                                    if (!res) return
                                }}
                            />
                        )}
                        {renderStatus(modelStatus, p.optional)}
                    </div>
                )}
            </div>
            {/* Infos------------------------------------ */}
            <div tw='flex flex-col'>
                <div tw='flex items-center'>
                    <span tw='whitespace-nowrap text-xl font-bold text-fuchsia-500'>
                        <span className='material-symbols-outlined'>model_training</span>
                    </span>
                    <div tw='font-bold [line-height:1rem]'>{mi.name}</div>
                </div>
                <span tw='line-clamp-2 text-sm italic opacity-75'>
                    <b>{mi.size}</b> - {mi.description}
                    {/* TODO: show install method by icon? */}
                    {/* (via {plugin.install_type}) */}
                </span>
            </div>
        </div>
    )
})

// <details
//     onClick={(e) => {
//         e.stopPropagation()
//     }}
// >
//     <summary>more...</summary>
//     <div tw='flex gap-1'>
//         {/* <div tw='font-bold'>Author:</div> */}
//         {/* <div tw='opacity-75'>{plugin.author}</div> */}
//         {/* <div>{getCustomNodeRegistry()}</div> */}
//         <pre>{JSON.stringify(host.manager.modelList, null, 3)}</pre>
//     </div>
// </details>
