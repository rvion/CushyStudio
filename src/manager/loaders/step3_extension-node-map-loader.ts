import type { NodeNameInComfy } from '../../comfyui/comfyui-types'
import type { ComfyManagerRepository } from '../ComfyManagerRepository'
import type { KnownComfyCustomNodeName } from '../generated/KnownComfyCustomNodeName'
import type { KnownComfyPluginURL } from '../generated/KnownComfyPluginURL'
import type { ComfyManagerPluginInfo } from '../types/ComfyManagerPluginInfo'

import chalk from 'chalk'
import { readFileSync, writeFileSync } from 'fs'
import * as v from 'valibot'

import { convertComfyModuleAndNodeNameToCushyQualifiedNodeKey } from '../../comfyui/codegen/_convertComfyModuleAndNodeNameToCushyQualifiedNodeKey'
import { printValibotResultInConsole } from '../../csuite/utils/printValibotResult'
import { githubRegexpV2 } from '../_utils/githubRegexes'
import {
   type ComfyManagerFilePluginContent,
   ComfyManagerFilePluginContent_valibot,
} from '../types/ComfyManagerFilePluginContent'
import { type ComfyManagerPluginContentMetadata } from '../types/ComfyManagerPluginContentMetadata'

export const _getCustomNodeRegistry = (DB: ComfyManagerRepository): void => {
   let totalCustomNodeSeen: number = 0

   // 1. read file
   const extensionNodeMapFile: ComfyManagerFilePluginContent = JSON.parse(
      readFileSync('src/manager/json/extension-node-map.json', 'utf8'),
   )

   // validate file is well-formed
   const res = v.safeParse(ComfyManagerFilePluginContent_valibot, extensionNodeMapFile)
   let hasErrors = false
   if (DB.opts.check) {
      if (!res.success) {
         hasErrors = true
         printValibotResultInConsole(res)
         process.exit(1)
      }
   }

   // 2. process file into something slightly more practical to use
   type ComfyManagerFilePluginContent_asObject = {
      url: string
      comfyNodeNames: NodeNameInComfy[]
      meta: ComfyManagerPluginContentMetadata
      /** should be what we will received once the plugin in installed  */
      pythonModule: string
      /** plugin that contains this url listed in files */
      plugin: ComfyManagerPluginInfo
   }

   const enmEntries: ComfyManagerFilePluginContent_asObject[] = Object.entries(extensionNodeMapFile).map(
      (
         x: [url: string, infos: [NodeNameInComfy[], ComfyManagerPluginContentMetadata]],
      ): ComfyManagerFilePluginContent_asObject => {
         const url = x[0]
         const [comfyNodeNames, meta] = x[1]
         const confyPlugin = DB.plugins_byFile.get(url as KnownComfyPluginURL)
         if (confyPlugin == null) throw new Error(`[❌] plugin not found for ${url}`)
         return {
            url,
            comfyNodeNames,
            meta,
            plugin: confyPlugin,
            pythonModule: reverseEngineerWhatComfyWillSendAsPythonModuleValueOnceInstalled(
               confyPlugin,
               url,
               meta,
            ),
         }
      },
   )

   // 3. for each file
   for (const enmEntry of enmEntries) {
      totalCustomNodeSeen += enmEntry.comfyNodeNames.length
      // JSON CHECKS ------------------------------------------------------------
      // if (!hasErrors && DB.opts.check) {
      //    const valid = Value.Check(ComfyManagerPluginContentMetadata_typebox, enmEntry.meta)
      //    if (!valid) {
      //       const errors: ValueError[] = [
      //          ...Value.Errors(ComfyManagerPluginContentMetadata_typebox, enmEntry.meta),
      //       ]
      //       console.error(`❌ extensionNodeMap doesn't match schema:`, enmEntry.meta)
      //       // console.error(`❌ errors`, errors)
      //       for (const i of errors) console.log(`❌`, JSON.stringify(i))
      //       hasErrors = true
      //    }
      // }

      // 3 ensure we have a list of nodes for this plugin
      const plugin = enmEntry.plugin
      const nodesInPlugin: KnownComfyCustomNodeName[] = DB.customNodes_byPluginName.get(plugin.title) ?? []
      DB.customNodes_byPluginName.set(plugin.title, nodesInPlugin)

      // INITIALIZATION ------------------------------------------------------------
      // 4. for each node in file
      for (const nodeNameInComfy of enmEntry.comfyNodeNames) {
         // 4.1. index the plugin for this node name
         // const prevEntry1 = DB.plugins_byNodeNameInComfy.get(nodeNameInComfy)
         // if (prevEntry1 == null) DB.plugins_byNodeNameInComfy.set(nodeNameInComfy, [plugin])
         // else prevEntry1.push(plugin)

         // 4.2 index by nodeNameInCushy
         // const nodeNameInCushy = convertComfyNodeNameToCushyNodeNameValidInJS(nodeNameInComfy)

         const nodeNameInCushy = convertComfyModuleAndNodeNameToCushyQualifiedNodeKey(
            enmEntry.pythonModule,
            nodeNameInComfy,
         )
         // console.log(`[🤠] nodeNameInCushy=`, JSON.stringify(nodeNameInCushy), enmEntry.pythonModule)
         // process.exit(2)
         const prevEntry2 = DB.plugins_byNodeNameInCushy.get(nodeNameInCushy)
         if (prevEntry2 == null) DB.plugins_byNodeNameInCushy.set(nodeNameInCushy, [plugin])
         else prevEntry2.push(plugin)

         // 4.3. index the node in the plugin (file is only giving index by files...)
         nodesInPlugin.push(nodeNameInCushy as KnownComfyCustomNodeName)
      }
   }

   // 6. CODEGEN ------------------------------------------------------------
   if (DB.opts.genTypes) {
      let out = ''

      // NameInCushy
      const allCushyNodeNames = [...DB.plugins_byNodeNameInCushy.keys()]
      const sortedCushyNames = allCushyNodeNames.sort((a, b) =>
         a.toLowerCase().localeCompare(b.toLowerCase()),
      )
      out += '// prettier-ignore\n'
      out += 'export type KnownComfyCustomNodeName =\n'
      for (const nodeName of sortedCushyNames) {
         if (nodeName === 'sd_perturbed_attention.PerturbedAttention') {
            console.log(`[🤠] 🔴`, DB.plugins_byNodeNameInCushy.get(nodeName))
         }
         out += `    | ${JSON.stringify(nodeName)}\n`
      }
      out += '\n'

      const outPath = 'src/manager/generated/KnownComfyCustomNodeName.ts'
      writeFileSync(outPath, out + '\n', 'utf-8')
      console.log(`   > generated: ${chalk.blue.underline(outPath)}`)
   }

   // // INDEXING CHECKS ------------------------------------------------------------
   if (DB.opts.check) {
      //
      // console.log(`${knownModelList.length} models found`)
      console.log(`   - ${totalCustomNodeSeen} CustomNodes unique names processed`)
      // console.log(`${CustomNodeURL.byNodeNameInComfy.size} CustomNodes registered in map`)
      // if (totalPluginSeen !== CustomNodeURL.byNodeNameInComfy.size)
      //     console.log(`❌ some customNodes are either duplicated or have overlapping titles`)

      // console.log(`${totalCustomNodeSeen} CustomNodes-File Seen`)
      // console.log(`${CustomNodeURL.byNodeNameInCushy.size} CustomNodes-File registered in map`)
      // if (totalCustomNodeSeen !== CustomNodeURL.byNodeNameInCushy.size)
      //     console.log(`❌ some customNodes are either duplicated or have overlapping files`)

      // if (hasErrors) console.log(`❌ some CustomNodes don't match schema`)
      // else console.log(`✅ all CustomNodes match schema`)
   }

   // return DB
}

// // need to be an array, because multiple custom nodes can have the same name
// type CustomNodeURL_by_NodeNameInComfy = Map<NodeNameInComfy, KnownComfyPluginURL[]>
// type CustomNodeURL_by_NodeNameInCushy = Map<NodeNameInCushy, KnownComfyPluginURL[]>
// type CustomNodes_by_PluginTitle = Map<KnownComfyPluginURL, NodeNameInCushy[]>

// type CustomNodeRegistry = {
//     byNodeNameInComfy: CustomNodeURL_by_NodeNameInComfy
//     byNodeNameInCushy: CustomNodeURL_by_NodeNameInCushy
//     byPluginName: CustomNodes_by_PluginTitle
// }

// let DB: Maybe<CustomNodeRegistry> = null // = knownCustomNodesFile.custom_nodes

function reverseEngineerWhatComfyWillSendAsPythonModuleValueOnceInstalled(
   plugin: ComfyManagerPluginInfo,
   url: string,
   meta: ComfyManagerPluginContentMetadata,
): string {
   if (plugin.id === 'nodes' && plugin.reference === 'https://github.com/comfyanonymous/ComfyUI')
      return 'nodes'

   // if (meta.pythonModule) {
   //    // console.log(`[🤠] got via pythonModule`, meta.pythonModule)
   //    return meta.pythonModule
   // }
   const repoName = plugin.reference.match(githubRegexpV2)?.[2]
   // console.log(`[🤠] ${plugin.reference} => ${repoName}`)
   if (repoName) {
      // console.log(`[🤠] got via repoName`, plugin.reference, `custom_nodes.${repoName}`)
      return `custom_nodes.${repoName}`
   }
   if (plugin.id) {
      // console.log(`[🤠] got via repoName`, plugin.id, `custom_nodes.${plugin.id}`)
      return `custom_nodes.${plugin.id}`
   }
   const pythonModule = '🔴'
   return pythonModule
}
