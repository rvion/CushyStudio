import { observer } from 'mobx-react-lite'
import { RevealUI } from 'src/rsuite/reveal/RevealUI'
import { useSt } from 'src/state/stateContext'
import { getModelInfoEnumName } from 'src/wiki/modelList'
import { RecommendedModelDownload, extractDownloadCandidates } from '../EnumDefault'

export const InstallModelBtnUI = observer(function InstallModelBtnUI_<K extends KnownEnumNames>(p: {
    // widget: Widget_enum<K> | Widget_enumOpt<K>
    // modelFolderPrefix: string
    models: RecommendedModelDownload
}) {
    const st = useSt()
    const x = p.models
    const models = extractDownloadCandidates(x)
    if (models.length === 0) return null
    return (
        <RevealUI>
            <div tw='btn btn-square btn-sm'>
                <span className='material-symbols-outlined'>cloud_download</span>
            </div>
            <div tw='flex flex-col flex-wrap gap-1'>
                {/* {models.length} */}
                {/* <pre>{JSON.stringify(p.widget.input.default)}</pre> */}
                {models.map((mi) => {
                    const enumName = getModelInfoEnumName(mi, x.modelFolderPrefix ?? '')
                    const isInstalled = false // 🔴 p.widget.possibleValues.find((x) => x === enumName.nix || x === enumName.win)
                    const host = st.mainHost
                    // const rootComfyUIFolder = host.absolutPathToDownloadModelsTo
                    // const dlPath = host.getComfyUIManager()?.getModelInfoFinalFilePath(mi)
                    return (
                        <div>
                            <div
                                onClick={async () => {
                                    // 🔴 TODO
                                    // https://github.com/ltdrdata/ComfyUI-Manager/blob/main/js/model-downloader.js#L11
                                    // copy Data-it implementation
                                    // download file
                                    const res = await host.getComfyUIManager()?.installModel(mi)
                                    if (!res) return

                                    // const res = await host.downloadFileIfMissing(m.url, dlPath)
                                    // retrieve the enum info
                                    // add the new value (BRITTLE)

                                    // ⏸️ const enumInfo = st.schema.knownEnumsByName //
                                    // ⏸️     .get(p.widget.input.enumName)
                                    // ⏸️ enumInfo?.values.push(mi.filename)
                                }}
                                tw='btn btn-sm btn-outline btn-sm'
                                key={mi.name}
                            >
                                {isInstalled ? '✅' : null}
                                <span className='material-symbols-outlined'>cloud_download</span>
                                <span>{mi.name}</span>
                            </div>
                            {/* <RevealUI> */}
                            {/* <div>infos</div> */}
                            <div tw='text-sm italic'>
                                <div tw='italic'>enumName: {enumName.win}</div>
                                <div tw='italic'>desc: {mi.description}</div>
                                <div tw='italic'>url: {mi.url}</div>
                            </div>
                            {/* </RevealUI> */}
                        </div>
                    )
                })}
            </div>
        </RevealUI>
    )
})
