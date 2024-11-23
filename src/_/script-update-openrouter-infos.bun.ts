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

const response = await fetch('https://openrouter.ai/api/v1/models', {
   method: 'GET',
   headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
   },
})

const models: OpenRouter_GetModelInfos_Response = await response.json()
const targetJsonFilePath = 'src/csuite/openrouter/OpenRouter_models.json'
writeJSON(targetJsonFilePath, models)
console.log(`[🤠] ${models.data.length} models found`)
console.log(`[🤠] wrote ${chalk.blueBright(targetJsonFilePath)}`)

const res = v.safeParse(OpenRouter_GetModelInfos_Response_valibot, models)
if (!res.success) {
   printValibotResultInConsole(res)
}
const modelEnumTypeFile = 'src/csuite/openrouter/OpenRouter_models.ts'
let modelEnumTypeContent = `export type OpenRouter_Models =`

const sortedModels = models.data.sort((a, b) => a.id.localeCompare(b.id))
for (const model of sortedModels) {
   modelEnumTypeContent += `\n   | '${model.id}'`
}

writeFileSync(modelEnumTypeFile, modelEnumTypeContent)
console.log(`[🤠] wrote ${chalk.blueBright(modelEnumTypeFile)}`)

console.log(`[🤠] ${chalk.greenBright('DONE')}`)
