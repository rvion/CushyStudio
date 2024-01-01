import type { EnumValue } from 'src/models/Schema'
import { knownModels, type KnownModelName, type ModelInfo } from 'src/wiki/modelList'

export const extractDefaultValue = <T extends KnownEnumNames>(def: EnumValue | EnumDefault): Maybe<EnumValue> => {
    // case value (backwards compat)
    if (typeof def === 'string') return def
    if (typeof def === 'boolean') return def
    if (typeof def === 'number') return def

    // case defaultModel
    const x = def.knownModel
    if (x != null) {
        const entry = Array.isArray(x) ? x[0] : x
        const modelInfo = knownModels.get(entry)
        if (modelInfo == null) {
            console.error(`Unknown model: ${entry}`)
            return null
        }
        return modelInfo.filename
    }

    // default
    return null
}

// 🔴 rewrite that
export const extractDownloadCandidates = <T extends KnownEnumNames>(def: EnumValue | EnumDefault): Maybe<ModelInfo[]> => {
    if (typeof def !== 'object') return null
    if (!('knownModel' in def)) return null
    const x = def.knownModel!
    const entries = Array.isArray(x) ? x : [x]
    const OUT: ModelInfo[] = []
    for (const entry of entries) {
        const modelInfo = knownModels.get(entry)
        if (modelInfo == null) continue
        OUT.push(modelInfo)
    }
    return OUT
}

/**
 * this object is the new value that
 * needs to be given to an enum default.
 */
export type EnumDefault<T = any> = {
    /** 🔶 */
    value?: string
    /** 🔴 UNIMPLEMENTED */
    values?: string[]
    /** 🔶 */
    knownModel?: KnownModelName | KnownModelName[]
    /** 🔴 UNIMPLEMENTED */
    find?: (candidate: string) => number
    /** 🔴 UNIMPLEMENTED */
    customDownloads?: { [modelName: string]: ModelInfo }
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
