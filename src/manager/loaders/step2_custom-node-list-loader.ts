import type { ComfyManagerRepository } from '../ComfyManagerRepository'
import type { KnownComfyPluginTitle } from '../generated/KnownComfyPluginTitle'
import type { ComfyManagerPluginID } from '../types/ComfyManagerPluginID'
import type { ComfyManagerPluginInfo } from '../types/ComfyManagerPluginInfo'

import { readFileSync, writeFileSync } from 'fs'
import * as v from 'valibot'

import { printValibotResultInConsole } from '../../csuite/utils/printValibotResult'
import { RecoveryVerbosity, tryRecovering } from '../../csuite/utils/tryExtracting'
import { githubRegexpV1 } from '../_utils/githubRegexes'
import { ComfyPluginExtra } from '../json/custom-node-list.extra'
import {
   type ComfyManagerFilePluginList,
   ComfyManagerFilePluginList_valibot,
} from '../types/ComfyManagerFilePluginList'

export type GetKnownPluginProps = {
   //
   updateCache?: boolean
   check?: boolean
   genTypes?: boolean
}

export const _getKnownPlugins = (DB: ComfyManagerRepository): void => {
   let totalFileSeen = 0
   let totalPluginSeen = 0

   // load raw json
   const knownPluginFile: ComfyManagerFilePluginList = JSON.parse(
      readFileSync('src/manager/json/custom-node-list.json', 'utf8'),
   )

   // merge with extra
   const knownPluginList: ComfyManagerPluginInfo[] = knownPluginFile.custom_nodes.concat(ComfyPluginExtra)

   // auto-fix the (more often than not) json file
   // please... add validation or CI check or something!
   for (const plugin of knownPluginList) {
      plugin.id ??= tryRecoveringPluginId(plugin, RecoveryVerbosity.info)
      plugin.title ??= tryRecoveringPluginTitle(plugin, RecoveryVerbosity.info)
   }

   // validate file is well-formed
   const res = v.safeParse(ComfyManagerFilePluginList_valibot, knownPluginFile)
   let hasErrors = false
   if (DB.opts.check) {
      if (!res.success) {
         hasErrors = true
         printValibotResultInConsole(res)
         process.exit(1)
      }
   }

   for (const plugin of knownPluginList) {
      // INITIALIZATION ------------------------------------------------------------
      totalPluginSeen++
      if (DB.opts.check && DB.plugins_byTitle.has(plugin.title))
         console.log(`   ❌ plugin.title: "${plugin.title}" is duplicated`)
      DB.plugins_byTitle.set(plugin.title, plugin)
      for (const pluginURI of plugin.files) {
         totalFileSeen++
         if (DB.opts.check && DB.plugins_byFile.has(pluginURI))
            console.log(`   ❌ plugin.file: "${pluginURI}" is duplicated`)
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
      // out2 += '\n'
      writeFileSync('src/manager/generated/KnownComfyPluginURL.ts', out2, 'utf-8')
   }

   // INDEXING CHECKS ------------------------------------------------------------
   if (DB.opts.check) {
      // console.log(`${knownModelList.length} models found`)
      console.log(`   - ${totalPluginSeen} CustomNodes in file`)
      console.log(`   - ${DB.plugins_byTitle.size} CustomNodes registered in map`)
      console.log(`   - ${totalFileSeen} CustomNodes-File Seen`)
      console.log(`   - ${DB.plugins_byFile.size} CustomNodes-File registered in map`)
   }
}

function tryRecoveringPluginTitle(
   plugin: ComfyManagerPluginInfo,
   verbose = RecoveryVerbosity.Quiet,
): KnownComfyPluginTitle {
   return tryRecovering<KnownComfyPluginTitle>({
      property: 'plugin.title',
      verbose,
      hacks: [
         {
            attempt: 'id',
            fn: (): Maybe<KnownComfyPluginTitle> => plugin.id as KnownComfyPluginTitle,
         },
         {
            attempt: 'github repo name',
            fn: (): Maybe<KnownComfyPluginTitle> => plugin.reference as KnownComfyPluginTitle,
         },
      ],
   })
}

function tryRecoveringPluginId(
   //
   plugin: ComfyManagerPluginInfo,
   verbose = RecoveryVerbosity.Quiet,
): string {
   return tryRecovering<ComfyManagerPluginID>({
      property: 'plugin.id',
      verbose,
      hacks: [
         {
            level: RecoveryVerbosity.Verbose,
            attempt: 'title',
            fn: (): Maybe<ComfyManagerPluginID> => plugin.title as ComfyManagerPluginInfo['title'],
         },
         {
            attempt: 'github repo name',
            fn: (): Maybe<string> => plugin.reference.match(githubRegexpV1)?.[2],
         },
      ],
   })
}
