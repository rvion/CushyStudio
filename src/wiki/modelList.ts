import { Static, Type } from '@sinclair/typebox'
import { Value, ValueError } from '@sinclair/typebox/value'

// https://github.com/ltdrdata/ComfyUI-Manager/blob/main/model-list.json
import { readFileSync, writeFileSync } from 'fs'
import { ComfyUIManagerKnownModelNames, ComfyUIManagerKnownModelTypes } from './modelListType'

// prettier-ignore
export type ModelInfo = {
    "name"       : ComfyUIManagerKnownModelNames , // e.g. "ip-adapter_sd15_light.safetensors",
    "type"       : ComfyUIManagerKnownModelTypes, // e.g. "IP-Adapter",
    "base"       : string, // e.g. "SD1.5",
    "save_path"  : string, // e.g. "ipadapter",
    "description": string, // e.g. "You can use this model in the [a/ComfyUI IPAdapter plus](https://github.com/cubiq/ComfyUI_IPAdapter_plus) extension.",
    "reference"  : string, // e.g. "https://huggingface.co/h94/IP-Adapter",
    "filename"   : string, // e.g. "ip-adapter_sd15_light.safetensors",
    "url"        : string, // e.g. "https://huggingface.co/h94/IP-Adapter/resolve/main/models/ip-adapter_sd15_light.safetensors"
}

export const ModelInfo_Schema = Type.Object(
    {
        name: Type.Any(Type.String()),
        type: Type.Any(Type.String()),
        base: Type.String(),
        save_path: Type.String(),
        description: Type.String(),
        reference: Type.String(),
        filename: Type.String(),
        url: Type.String(),
    },
    { additionalProperties: false },
)

/* ✅ */ type ModelInfo2 = Static<typeof ModelInfo_Schema>
/* ✅ */ const _t1: ModelInfo = 0 as any as ModelInfo2
/* ✅ */ const _t2: ModelInfo2 = 0 as any as ModelInfo

/**
 * try to replicate the logic of ComfyUIManager to extract the final
 * file path of a downloaded managed model
 */
export const getModelInfoFinalFilePath = (mi: ModelInfo): string => {
    /**
     * the wide data-lt once told:
     *
     * | if save_path is 'default'
     * | models/type'/filename
     *
     * | if type is "checkpoint"
     * | models/checkpoints/filename
     *
     * | if save_path not starting with custom node
     * | base path is models
     * | e.g. save_path is "checkpoints/SD1.5"
     * | models/checkpoints/SD1.5/filename
     * | save_path is "custom_nodes/AAA/models"
     * | custom_nodes/AAA/models/filename
     *
     */
    if (mi.save_path === 'default') return `models/${mi.type}/${mi.filename}`
    if (mi.type === 'checkpoints') return `models/checkpoints/${mi.filename}`
    if (mi.save_path.startsWith('custom_nodes')) return `${mi.save_path}/${mi.filename}`
    else return `models/${mi.save_path}/${mi.filename}`
}

export const getModelInfoEnumName = (mi: ModelInfo, prefix: string = ''): { win: string; nix: string } => {
    const relPath = getModelInfoFinalFilePath(mi)

    const winPath = relPath.replace(/\//g, '\\')
    const winPrefix = prefix?.replace(/\//g, '\\')
    const isUnderPrefixWin = winPath.startsWith(winPrefix)

    const nixPath = relPath.replace(/\\/g, '/')
    const nixPrefix = prefix?.replace(/\//g, '\\')
    const isUnderPrefixNix = nixPath.startsWith(nixPrefix)

    const isUnderPrefix = isUnderPrefixNix || isUnderPrefixWin
    return {
        win: isUnderPrefix ? winPath.slice(winPrefix.length) : mi.filename /* winRel */,
        nix: isUnderPrefix ? nixPath.slice(nixPrefix.length) : mi.filename /* nixRel */,
    }
}

export type ModelFile = {
    models: ModelInfo[]
}

type KnownModelMap = Map<ComfyUIManagerKnownModelNames, ModelInfo>
let knownModels: Maybe<KnownModelMap> = null

export const getKnownModels = (p?: {
    //
    updateCache?: boolean
    check?: boolean
    genTypes?: boolean
}): KnownModelMap => {
    if (knownModels != null && !p?.updateCache) return knownModels

    const knownModelsFile: ModelFile = JSON.parse(readFileSync('src/wiki/jsons/model-list.json', 'utf8'))
    const knownModelsFileExtra: ModelFile = JSON.parse(readFileSync('src/wiki/jsons/model-list-extra.json', 'utf8'))
    const knownModelList = knownModelsFile.models.concat(knownModelsFileExtra.models)

    let hasErrors = false

    knownModels = new Map<ComfyUIManagerKnownModelNames, ModelInfo>()

    for (const modelInfo of knownModelList) {
        // INITIALIZATION ------------------------------------------------------------
        knownModels.set(modelInfo.name as ComfyUIManagerKnownModelNames, modelInfo)

        // JSON CHECKS -----------------------------------------------------------
        if (!hasErrors && p?.check) {
            const valid = Value.Check(ModelInfo_Schema, modelInfo)
            if (!valid) {
                const errors: ValueError[] = [...Value.Errors(ModelInfo_Schema, modelInfo)]
                console.error(`❌ model doesn't match schema:`, modelInfo)
                console.error(`❌ errors`, errors)
                for (const i of errors) console.log(`❌`, JSON.stringify(i))
                hasErrors = true
                // debugger
            }
        }
    }

    // CODEGEN ------------------------------------------------------------
    if (p?.genTypes) {
        let out = ''
        // categories
        const uniqCategories: { [key: string]: number } = knownModelList.reduce((acc, cur) => {
            if (acc[cur.type] != null) acc[cur.type] += 1
            else acc[cur.type] = 1
            return acc
        }, {} as { [key: string]: number })
        out += 'export type ComfyUIManagerKnownModelTypes =\n'
        for (const [cat, count] of Object.entries(uniqCategories))
            out += `    | ${JSON.stringify(cat).padEnd(20)} // x ${count.toString().padStart(3)}\n`
        out += '\n'

        // list
        const sortedModels = knownModelList.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
        out += 'export type ComfyUIManagerKnownModelNames =\n'
        for (const modelInfo of sortedModels) out += `    | ${JSON.stringify(modelInfo.name)}\n`
        out += '\n'

        writeFileSync('src/wiki/modelListType.ts', out + '\n', 'utf-8')
    }

    // INDEXING CHECKS ------------------------------------------------------------
    if (p?.check) {
        //
        console.log(`${knownModelList.length} models found`)
        console.log(`${knownModels.size} models registered map`)
        if (knownModelList.length !== knownModels.size)
            console.log(`❌ some models are either duplicated or have overlapping indexing keys`)
        //
        if (hasErrors) console.log(`❌ some models don't match schema`)
        else console.log(`✅ all models match schema`)
    }

    return knownModels
}

export const getKnownCheckpoints = (): ModelInfo[] => {
    const knownModels = getKnownModels()
    // for (const mi of knownModels.values()) {
    //     console.log(`[👙] `, mi.type === 'checkpoint' ? '✅' : '❌', mi.name)
    // }
    return [...knownModels.values()].filter((i) => i.type === 'checkpoints')
}
