import type { ComfyManagerRepository } from '../ComfyManagerRepository'
import type { ComfyManagerFilePluginList } from '../types/ComfyManagerFilePluginList'
import type { ComfyManagerPluginInfo } from '../types/ComfyManagerPluginInfo'
import type { ValueError } from '@sinclair/typebox/value'

import { Value } from '@sinclair/typebox/value'
import { readFileSync, writeFileSync } from 'fs'

import { CustomNodesInfo_Schema } from '../types/ComfyManagerPluginInfo'

export type GetKnownPluginProps = {
   //
   updateCache?: boolean
   check?: boolean
   genTypes?: boolean
}

export const _getKnownPlugins = (DB: ComfyManagerRepository): void => {
   let totalFileSeen = 0
   let totalPluginSeen = 0

   const knownPluginFile: ComfyManagerFilePluginList =      JSON.parse(readFileSync('src/manager/json/custom-node-list.json',       'utf8')) // prettier-ignore
   const knownPluginFileExtra: ComfyManagerFilePluginList = JSON.parse(readFileSync('src/manager/json/custom-node-list.extra.json', 'utf8')) // prettier-ignore
   const knownPluginList: ComfyManagerPluginInfo[] = knownPluginFile.custom_nodes.concat(
      knownPluginFileExtra.custom_nodes,
   )

   let hasErrors = false
   for (const plugin of knownPluginList) {
      // JSON CHECKS ------------------------------------------------------------
      if (!hasErrors && DB.opts.check) {
         const valid = Value.Check(CustomNodesInfo_Schema, plugin)
         if (!valid) {
            const errors: ValueError[] = [...Value.Errors(CustomNodesInfo_Schema, plugin)]
            console.error(`❌ customNode doesn't match schema:`, plugin)
            console.error(`❌ errors`, errors)
            for (const i of errors) console.log(`❌`, JSON.stringify(i))
            hasErrors = true
            // debugger
         }
      }

      // INITIALIZATION ------------------------------------------------------------
      totalPluginSeen++
      if (DB.opts.check && DB.plugins_byTitle.has(plugin.title))
         console.log(`❌ plugin.title: "${plugin.title}" is duplicated`)
      DB.plugins_byTitle.set(plugin.title, plugin)
      for (const pluginURI of plugin.files) {
         totalFileSeen++
         if (DB.opts.check && DB.plugins_byFile.has(pluginURI))
            console.log(`❌ plugin.file: "${pluginURI}" is duplicated`)
         DB.plugins_byFile.set(pluginURI, plugin)
      }
   }

   // CODEGEN ------------------------------------------------------------
   if (DB.opts.genTypes) {
      let out1 = ''
      // TitleType
      const allPlugins = [...DB.plugins_byTitle.values()]
      const allPluginsSortedByTitles = allPlugins.sort((a, b) =>
         (a.title ?? '❌missing-title')
            .toLowerCase()
            .localeCompare((b.title ?? '❌missing-title').toLowerCase()),
      )
      out1 += '// prettier-ignore\n'
      out1 += 'export type KnownComfyPluginTitle =\n'
      for (const plugin of allPluginsSortedByTitles) {
         out1 += `    /** ${plugin.id} - ${plugin.reference} */\n`
         out1 += `    | ${JSON.stringify(plugin.title)}\n`
      }
      out1 += '\n'
      writeFileSync('src/manager/generated/KnownComfyPluginTitle.ts', out1 + '\n', 'utf-8')

      // FileType
      let out2 = ''
      const allFileNames = [...DB.plugins_byFile.keys()]
      const sortedFileNames = allFileNames.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
      out2 += '// prettier-ignore\n'
      out2 += 'export type KnownComfyPluginURL =\n'
      for (const fileName of sortedFileNames) out2 += `    | ${JSON.stringify(fileName)}\n`
      out2 += '\n'
      writeFileSync('src/manager/generated/KnownComfyPluginURL.ts', out2 + '\n', 'utf-8')
   }

   // INDEXING CHECKS ------------------------------------------------------------
   if (DB.opts.check) {
      // console.log(`${knownModelList.length} models found`)
      console.log(`${totalPluginSeen} CustomNodes in file`)
      console.log(`${DB.plugins_byTitle.size} CustomNodes registered in map`)
      console.log(`${totalFileSeen} CustomNodes-File Seen`)
      console.log(`${DB.plugins_byFile.size} CustomNodes-File registered in map`)
      if (hasErrors) console.log(`❌ some CustomNodes don't match schema`)
      else console.log(`✅ all CustomNodes match schema`)
   }
}
