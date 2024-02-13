import type { ComfyManagerRepository } from '../ComfyManagerRepository'

import { Value, ValueError } from '@sinclair/typebox/value'

// https://github.com/ltdrdata/ComfyUI-Manager/blob/main/model-list.json
import { readFileSync, writeFileSync } from 'fs'
import { ComfyUIManagerKnownModelNames } from './modelListType'
import { ModelInfo, ModelInfo_Schema } from './model-list-loader-types'

export type ModelFile = {
    models: ModelInfo[]
}

export const _getKnownModels = (
    DB: ComfyManagerRepository /* {
} */,
): void => {
    const knownModelsFile: ModelFile = JSON.parse(readFileSync('src/wiki/jsons/model-list.json', 'utf8'))
    const knownModelsFileExtra: ModelFile = JSON.parse(readFileSync('src/wiki/jsons/model-list.extra.json', 'utf8'))
    const knownModelList = knownModelsFile.models.concat(knownModelsFileExtra.models)

    let hasErrors = false

    for (const modelInfo of knownModelList) {
        // INITIALIZATION ------------------------------------------------------------
        DB.knownModels.set(modelInfo.name as ComfyUIManagerKnownModelNames, modelInfo)

        // JSON CHECKS -----------------------------------------------------------
        if (!hasErrors && DB.opts.check) {
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
    if (DB.opts.genTypes) {
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
    if (DB.opts.check) {
        //
        console.log(`${knownModelList.length} models found`)
        console.log(`${DB.knownModels.size} models registered map`)
        if (knownModelList.length !== DB.knownModels.size)
            console.log(`❌ some models are either duplicated or have overlapping indexing keys`)
        //
        if (hasErrors) console.log(`❌ some models don't match schema`)
        else console.log(`✅ all models match schema`)
    }

    // return DB.knownModels
}
