import type { Requirements } from '../IWidget'
import type { PluginInfo } from 'src/manager/custom-node-list/custom-node-list-types'

import { observer } from 'mobx-react-lite'

import { Button_InstallCustomNodeUI } from './Button_InstallCustomNodeUI'
import { Button_InstalModelViaManagerUI } from './Button_InstalModelViaManagerUI'
import { MessageErrorUI, MessageWarningUI } from 'src/panels/MessageUI'
import { RevealUI } from 'src/rsuite/reveal/RevealUI'
import { useSt } from 'src/state/stateContext'
import { exhaust } from 'src/utils/misc/ComfyUtils'

export const InstallRequirementsBtnUI = observer(function InstallRequirementsBtnUI_(p: {
    active: boolean
    label?: string
    requirements: Requirements[]
}) {
    const st = useSt()
    if (p.requirements.length == 0) return null
    const rr = p.requirements
    return (
        <RevealUI>
            <div
                tw={[
                    p.active && !st.mainHost.matchRequirements(rr) //
                        ? 'btn-ghost text-red-500'
                        : 'btn-ghost opacity-50',
                    p.label ? 'btn btn-sm btn-outline' : 'btn btn-square btn-xs',
                ]}
            >
                <span className='material-symbols-outlined'>scatter_plot</span>
                {p.label}
            </div>
            <div tw='[max-width:500px]'>
                <Panel_InstallRequirementsUI requirements={rr} />
            </div>
        </RevealUI>
    )
})

export const Panel_InstallRequirementsUI = observer(function Panel_InstallRequirementsUI_(p: { requirements: Requirements[] }) {
    const rr = p.requirements
    const host = useSt().mainHost
    const manager = host.manager
    const repo = manager.repository
    return (
        <div tw='flex flex-col gap-2 bg-base-300 '>
            <div tw='flex gap-1'>
                {/*
                TODO: uncomment when implemented
                <div tw='btn btn-sm flex-1' onClick={() => host.fetchAndUpdateSchema()}>
                    <span className='material-symbols-outlined'>cloud_download</span>
                    Install All
                </div>
                */}
                <RevealUI>
                    <div tw='btn btn-sm'>See Installed</div>
                    <div tw='max-h-96 overflow-auto'>
                        {(() => {
                            if (manager.pluginList == null) return <div tw='loading loading-spinner'></div>
                            return (
                                <div tw='flex flex-col'>
                                    {manager.titlesOfAllInstalledPlugins.map((name) => (
                                        <div key={name}>{name}</div>
                                    ))}
                                </div>
                            )
                        })()}
                    </div>
                </RevealUI>
                <div
                    tw='btn btn-sm'
                    onClick={() => {
                        host.fetchAndUpdateSchema()
                        host.manager.updateHostPluginsAndModels()
                    }}
                >
                    Reload Schema
                </div>
                <div tw='btn btn-sm' onClick={() => host.manager.rebootComfyUI()}>
                    Restart ComfyUI
                </div>
            </div>
            <MessageWarningUI markdown='this widget is beta; Clicking install does not show progress yet; check your ComfyUI logs' />
            <div tw='flex flex-col overflow-scroll gap-2'>
                {rr.map((req) => {
                    // ------------------------------------------------
                    if (req.type === 'customNodesByNameInCushy') {
                        const plugins: PluginInfo[] = repo.plugins_byNodeNameInCushy.get(req.nodeName) ?? []
                        if (plugins.length == 0) return <MessageErrorUI markdown={`node plugin **${req.nodeName}** not found`} />
                        if (plugins.length === 1)
                            return <Button_InstallCustomNodeUI optional={req.optional ?? false} plugin={plugins[0]} />
                        return (
                            <div tw='bd'>
                                <MessageErrorUI>
                                    <div>
                                        <div>Ambiguous node "{req.nodeName}" required</div>
                                        <div>It is found in {plugins.length} packages:</div>
                                    </div>
                                </MessageErrorUI>
                                {plugins.map((x) => {
                                    return (
                                        <Button_InstallCustomNodeUI optional={req.optional ?? false} key={x.title} plugin={x} />
                                    )
                                })}
                            </div>
                        )
                    }
                    // ------------------------------------------------
                    if (req.type === 'customNodesByTitle') {
                        const plugin = manager.repository.plugins_byTitle.get(req.title)
                        if (!plugin) {
                            console.log(`[❌] no plugin found with title "${req.title}"`)
                            return <MessageErrorUI markdown={`no plugin found with title **${req.title}** not found`} />
                        }
                        return <Button_InstallCustomNodeUI optional={req.optional ?? false} plugin={plugin} />
                    }

                    // ------------------------------------------------
                    if (req.type === 'customNodesByURI') {
                        const plugin = manager.repository.plugins_byFile.get(req.uri)
                        if (!plugin) {
                            console.log(`[❌] no plugin found with uri "${req.uri}"`)
                            return <MessageErrorUI markdown={`no plugin found with URI **${req.uri}** not found`} />
                        }
                        return <Button_InstallCustomNodeUI optional={req.optional ?? false} plugin={plugin} />
                    }

                    // ------------------------------------------------
                    // models
                    if (req.type === 'modelCustom') {
                        const modelInfo = req.infos
                        return (
                            <Button_InstalModelViaManagerUI //
                                optional={req.optional ?? false}
                                modelInfo={modelInfo}
                            />
                        )
                    }

                    // ------------------------------------------------
                    if (req.type === 'modelInCivitai') {
                        // 🔴
                        return (
                            <Button_InstalModelViaManagerUI
                                optional={req.optional ?? false}
                                modelInfo={{
                                    name: 'negative_hand Negative Embedding',
                                    type: 'embeddings',
                                    base: req.base,
                                    save_path: 'default',
                                    description:
                                        'If you use this embedding with negatives, you can solve the issue of damaging your hands.',
                                    reference: 'https://civitai.com/models/56519/negativehand-negative-embedding',
                                    filename: 'negative_hand-neg.pt',
                                    url: 'https://civitai.com/api/download/models/60938',
                                }}
                            />
                        )
                    }
                    if (req.type === 'modelInManager') {
                        const modelInfo = repo.knownModels.get(req.modelName)
                        if (!modelInfo) {
                            console.log(`[❌] no model found with name "${req.modelName}"`)
                            return <MessageErrorUI markdown={`no model found with name **${req.modelName}** not found`} />
                        }
                        return (
                            <Button_InstalModelViaManagerUI //
                                optional={req.optional ?? false}
                                modelInfo={modelInfo}
                            />
                        )
                    }
                    exhaust(req)

                    // const enumName = getModelInfoEnumName(mi, x.modelFolderPrefix ?? '')
                    // const isInstalled = false // 🔴 p.widget.possibleValues.find((x) => x === enumName.nix || x === enumName.win)
                    // const host = st.mainHost
                    // // const rootComfyUIFolder = host.absolutPathToDownloadModelsTo
                    // // const dlPath = host.manager.getModelInfoFinalFilePath(mi)
                    // return (
                    //     <div key={mi.url}>
                    //         <div
                    //             onClick={async () => {
                    //                 // 🔴 TODO
                    //                 // https://github.com/ltdrdata/ComfyUI-Manager/blob/main/js/model-downloader.js#L11
                    //                 // copy Data-it implementation
                    //                 // download file
                    //                 const res = await host.manager.installModel(mi)
                    //                 if (!res) return
                    //
                    //                 // const res = await host.downloadFileIfMissing(m.url, dlPath)
                    //                 // retrieve the enum info
                    //                 // add the new value (BRITTLE)
                    //
                    //                 // ⏸️ const enumInfo = st.schema.knownEnumsByName //
                    //                 // ⏸️     .get(p.widget.input.enumName)
                    //                 // ⏸️ enumInfo?.values.push(mi.filename)
                    //             }}
                    //             tw='btn btn-sm btn-outline btn-sm'
                    //             key={mi.name}
                    //         >
                    //             {isInstalled ? '✅' : null}
                    //             <span className='material-symbols-outlined'>cloud_download</span>
                    //             <span>{mi.name}</span>
                    //         </div>
                    //         {/* <RevealUI> */}
                    //         {/* <div>infos</div> */}
                    //         {/*
                    //         ⏸️ <div tw='text-sm italic'>
                    //         ⏸️     <div tw='italic'>enumName: {enumName.win}</div>
                    //         ⏸️     <div tw='italic'>desc: {mi.description}</div>
                    //         ⏸️     <div tw='italic'>url: {mi.url}</div>
                    //         ⏸️ </div>
                    //          */}
                    //         {/* </RevealUI> */}
                    //     </div>
                    // )
                })}
            </div>
        </div>
    )
})
