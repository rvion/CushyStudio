import type { EnumValue } from 'src/models/Schema'
import { getKnownModels, type ModelInfo } from 'src/wiki/modelList'
import { type ComfyUIManagerKnownModelNames } from 'src/wiki/modelListType'

export const extractDefaultValue = <T extends KnownEnumNames>(def: EnumValue | EnumDefault): Maybe<EnumValue> => {
    if (def == null) return null
    // case value (backwards compat)
    if (typeof def === 'string') return def
    if (typeof def === 'boolean') return def
    if (typeof def === 'number') return def

    // ⏸️ // case defaultModel
    // ⏸️ const x = def.knownModel
    // ⏸️ if (x != null) {
    // ⏸️     const entry = Array.isArray(x) ? x[0] : x
    // ⏸️     const knownModels = getKnownModels()
    // ⏸️     const modelInfo = knownModels.get(entry)
    // ⏸️     if (modelInfo == null) {
    // ⏸️         console.error(`Unknown model: ${entry}`)
    // ⏸️         return null
    // ⏸️     }
    // ⏸️     return modelInfo.filename
    // ⏸️ }

    // default
    return null
}

export const extractDownloadCandidates = (
    //
    def: RecommendedModelDownload,
): ModelInfo[] => {
    const knownModels = getKnownModels()
    const OUT: ModelInfo[] = []

    // --------------------------------------
    const x = def.knownModel ?? []
    const entries = Array.isArray(x) ? x : [x]
    for (const entry of entries) {
        const modelInfo = knownModels.get(entry)
        if (modelInfo == null) continue
        OUT.push(modelInfo)
    }

    // --------------------------------------
    const y = def.customModels ?? []
    const entries2 = Array.isArray(y) ? y : [y]
    for (const entry of entries2) {
        OUT.push(entry)
    }

    // --------------------------------------
    return OUT
}

export type RecommendedModelDownload = {
    reason?: string
    modelFolderPrefix?: string
    // prettier-ignore
    knownModel?:
        | ComfyUIManagerKnownModelNames
        | ComfyUIManagerKnownModelNames[]
    customModels?: ModelInfo | ModelInfo[]
}

/**
 * this object is the new value that
 * needs to be given to an enum default.
 */
export type EnumDefault<T extends KnownEnumNames = any> = {
    /** 🔶 */
    value?: Requirable[T] | string
    /** 🔴 UNIMPLEMENTED */
    values?: string[]
    /** 🔶 */
    /** 🔴 UNIMPLEMENTED */
    find?: (candidate: string) => number
    /** 🔴 UNIMPLEMENTED */
    // customDownloads?: { [modelName: string]: ModelInfo }
}

/** showcase an example default value with all options filled */
// const example: EnumDefault<Enum_IPAdapterModelLoader_ipadapter_file> = {
//     value: 'ip-adapter_sd15.safetensors',
//     values: [
//         //
//         'ip-adapter_sd15.safetensors',
//         'ip-adapter_sd15',
//     ],
//     find: (candidate: string) => {
//         if (candidate === 'ip-adapter_sd15.safetensors') return 10
//         if (candidate.includes('ip-adapter')) return 5
//         return 0
//     },
//     knownModel: ['ip-adapter_sd15.safetensors'],
// }
