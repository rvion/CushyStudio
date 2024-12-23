import chalk from 'chalk'
import { writeFileSync } from 'fs'
import * as v from 'valibot'

import {
   type OpenRouter_GetModelInfos_Response,
   OpenRouter_GetModelInfos_Response_valibot,
} from '../csuite/openrouter/OpenRouter_ModelInfo'
import { printValibotResultInConsole } from '../csuite/utils/printValibotResult'
import { readJSON, writeJSON } from '../state/jsonUtils'

const legacyConfigFile = readJSON('CONFIG.json')
const OPENROUTER_API_KEY: string = (legacyConfigFile as any).OPENROUTER_API_KEY
console.log(`[🤠] OPENROUTER_API_KEY ${OPENROUTER_API_KEY.slice(0, 16)}...`)

// #region update list
const response = await fetch('https://openrouter.ai/api/v1/models', {
   method: 'GET',
   headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
   },
})

const models: OpenRouter_GetModelInfos_Response = await response.json()

// #region validate payload
const targetJsonFilePath = 'src/csuite/openrouter/OpenRouter_models.json'
writeJSON(targetJsonFilePath, models)
console.log(`[🤠] ${models.data.length} models found`)
console.log(`[🤠] wrote ${chalk.blueBright(targetJsonFilePath)}`)

const res = v.safeParse(OpenRouter_GetModelInfos_Response_valibot, models)
if (!res.success) {
   printValibotResultInConsole(res)
}

// #region update OpenRouter_models.ts
const modelEnumTypeFile = 'src/csuite/openrouter/OpenRouter_models.ts'
let modelEnumTypeContent = `export type OpenRouter_Models =`
const sortedModels = models.data.sort((a, b) => a.id.localeCompare(b.id))
for (const model of sortedModels) {
   modelEnumTypeContent += `\n   | '${model.id}'`
}
writeFileSync(modelEnumTypeFile, modelEnumTypeContent)
console.log(`[🤠] wrote ${chalk.blueBright(modelEnumTypeFile)}`)

// #region update OpenRouter_infos.ts
const finalInfosFile = 'src/csuite/openrouter/OpenRouter_infos.ts'
const finalInfosContent: string[] = []
finalInfosContent.push(`import type { OpenRouter_ModelInfo } from './OpenRouter_ModelInfo'`)
finalInfosContent.push(`import type { OpenRouter_Models } from './OpenRouter_models'`)
finalInfosContent.push(``)
finalInfosContent.push(
   `export const openRouterInfos: { [key in OpenRouter_Models]: OpenRouter_ModelInfo } = {`,
)
for (const model of sortedModels) {
   finalInfosContent.push(`    '${model.id}': ${JSON.stringify(model)},`)
}
finalInfosContent.push(`}`)
writeFileSync(finalInfosFile, finalInfosContent.join('\n'))
console.log(`[🤠] wrote ${chalk.blueBright(finalInfosFile)}`)

// #region DONE
console.log(`[🤠] ${chalk.greenBright('DONE')}`)
