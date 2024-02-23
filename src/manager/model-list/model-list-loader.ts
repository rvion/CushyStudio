import type { ComfyManagerRepository } from '../ComfyManagerRepository'

import { Value, ValueError } from '@sinclair/typebox/value'
// https://github.com/ltdrdata/ComfyUI-Manager/blob/main/model-list.json
import { readFileSync, writeFileSync } from 'fs'

import { KnownModel_Name } from './KnownModel_Name'
import { ModelInfo, ModelInfo_Schema } from './model-list-loader-types'

export type ModelFile = {
    models: ModelInfo[]
}

export const _getKnownModels = (
    DB: ComfyManagerRepository /* {
} */,
): void => {
    const knownModelsFile: ModelFile = JSON.parse(readFileSync('src/manager/model-list/model-list.json', 'utf8'))
    const knownModelsFileExtra: ModelFile = JSON.parse(readFileSync('src/manager/model-list/model-list.extra.json', 'utf8'))
    const knownModelList = knownModelsFile.models.concat(knownModelsFileExtra.models)

    let hasErrors = false

    for (const modelInfo of knownModelList) {
        // INITIALIZATION ------------------------------------------------------------
        DB.knownModels.set(modelInfo.name as KnownModel_Name, modelInfo)

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
        // type ---------------------------
        let out1 = ''
        const uniqCategories: { [key: string]: number } = knownModelList.reduce((acc, cur) => {
            if (acc[cur.type] != null) acc[cur.type] += 1
            else acc[cur.type] = 1
            return acc
        }, {} as { [key: string]: number })
        out1 += `// prettier-ignore\n`
        out1 += 'export type KnownModel_Type =\n'
        for (const [cat, count] of Object.entries(uniqCategories))
            out1 += `    | ${JSON.stringify(cat).padEnd(20)} // x ${count.toString().padStart(3)}\n`
        out1 += '\n'
        writeFileSync('src/manager/model-list/KnownModel_Type.ts', out1 + '\n', 'utf-8')

        // savepath ---------------------------
        let out4 = ''
        const uniqSavePath: { [key: string]: number } = knownModelList.reduce((acc, cur) => {
            if (acc[cur.save_path] != null) acc[cur.save_path] += 1
            else acc[cur.save_path] = 1
            return acc
        }, {} as { [key: string]: number })
        out4 += `// prettier-ignore\n`
        out4 += 'export type KnownModel_SavePath =\n'
        for (const [cat, count] of Object.entries(uniqSavePath))
            out4 += `    | ${JSON.stringify(cat).padEnd(50)} // x ${count.toString().padStart(3)}\n`
        out4 += '\n'
        writeFileSync('src/manager/model-list/KnownModel_SavePath.ts', out4 + '\n', 'utf-8')

        // base ---------------------------
        let out2 = ''
        const uniqBases: { [key: string]: number } = knownModelList.reduce((acc, cur) => {
            if (acc[cur.base] != null) acc[cur.base] += 1
            else acc[cur.base] = 1
            return acc
        }, {} as { [key: string]: number })
        out2 += `// prettier-ignore\n`
        out2 += 'export type KnownModel_Base =\n'
        for (const [cat, count] of Object.entries(uniqBases))
            out2 += `    | ${JSON.stringify(cat).padEnd(20)} // x ${count.toString().padStart(3)}\n`
        out2 += '\n'
        writeFileSync('src/manager/model-list/KnownModel_Base.ts', out2 + '\n', 'utf-8')

        // KnownModel_Name ----------------------
        let out3 = ''
        const sortedModels = knownModelList.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
        out3 += `// prettier-ignore\n`
        out3 += 'export type KnownModel_Name =\n'
        for (const modelInfo of sortedModels) out3 += `    | ${JSON.stringify(modelInfo.name)}\n`
        out3 += '\n'
        writeFileSync('src/manager/model-list/KnownModel_Name.ts', out3 + '\n', 'utf-8')
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
