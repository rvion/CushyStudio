import type { ComfyManagerRepository } from '../ComfyManagerRepository'
import type { KnownCustomNode_CushyName } from './KnownCustomNode_CushyName'
import type { NodeNameInComfy } from 'src/models/Schema'

import { Value, ValueError } from '@sinclair/typebox/value'
import { readFileSync, writeFileSync } from 'fs'

import { KnownCustomNode_File } from '../custom-node-list/KnownCustomNode_File'
import { ENMInfos, ENMInfos_Schema, ExtensionNodeMapFile } from './extension-node-map-types'
import { normalizeJSIdentifier } from 'src/core/normalizeJSIdentifier'

export const _getCustomNodeRegistry = (DB: ComfyManagerRepository): void => {
    let totalCustomNodeSeen = 0

    // 1. read file
    const extensionNodeMapFile: ExtensionNodeMapFile = JSON.parse(
        readFileSync('src/manager/extension-node-map/extension-node-map.json', 'utf8'),
    )

    // 2. process file into something slightly more practical to use
    type ENMEntry = {
        url: string
        comfyNodeNames: NodeNameInComfy[]
        meta: ENMInfos
    }

    const enmEntries: ENMEntry[] = Object.entries(extensionNodeMapFile).map(
        (x: [url: string, infos: [NodeNameInComfy[], ENMInfos]]): ENMEntry => {
            const url = x[0]
            const [comfyNodeNames, meta] = x[1]
            return {
                url,
                comfyNodeNames,
                meta,
            }
        },
    )

    let hasErrors = false
    // 3. for each file
    for (const enmEntry of enmEntries) {
        // JSON CHECKS ------------------------------------------------------------
        if (!hasErrors && DB.opts.check) {
            const valid = Value.Check(ENMInfos_Schema, enmEntry.meta)
            if (!valid) {
                const errors: ValueError[] = [...Value.Errors(ENMInfos_Schema, enmEntry.meta)]
                console.error(`❌ customNode doesn't match schema:`, enmEntry.meta)
                console.error(`❌ errors`, errors)
                for (const i of errors) console.log(`❌`, JSON.stringify(i))
                hasErrors = true
            }
        }

        // 3.1 ensure there is a plugin associated to this file
        const plugin = DB.plugins_byFile.get(enmEntry.url as KnownCustomNode_File)
        if (plugin == null) throw new Error(`[❌] plugin not found for ${enmEntry.url}`)

        // 3.2 ensure we have a list of nodes for this plugin
        let nodesInPlugin: KnownCustomNode_CushyName[] = DB.customNodes_byPluginName.get(plugin.title) ?? []
        DB.customNodes_byPluginName.set(plugin.title, nodesInPlugin)

        // INITIALIZATION ------------------------------------------------------------
        // 4. for each node in file
        for (const nodeNameInComfy of enmEntry.comfyNodeNames) {
            // 4.1. index the plugin for this node name
            const prevEntry1 = DB.plugins_byNodeNameInComfy.get(nodeNameInComfy)
            if (prevEntry1 == null) DB.plugins_byNodeNameInComfy.set(nodeNameInComfy, [plugin])
            else prevEntry1.push(plugin)

            // 4.2 index by nodeNameInCushy
            const nodeNameInCushy = normalizeJSIdentifier(nodeNameInComfy, ' ')
            const prevEntry2 = DB.plugins_byNodeNameInCushy.get(nodeNameInCushy)
            if (prevEntry2 == null) DB.plugins_byNodeNameInCushy.set(nodeNameInCushy, [plugin])
            else prevEntry2.push(plugin)

            // 4.3. index the node in the plugin (file is only giving index by files...)
            nodesInPlugin.push(nodeNameInCushy as KnownCustomNode_CushyName)
        }
    }

    // 5. log duplicates
    if (DB.opts.check) {
        for (const [k, v] of DB.plugins_byNodeNameInComfy.entries()) {
            if (v.length > 1) {
                if (DB.opts.check) console.log(`❌ DUPLICATE: ${k}`)
                for (const file of v) console.log(`    | ${file}`)
            }
        }
    }

    // 6. CODEGEN ------------------------------------------------------------
    if (DB.opts.genTypes) {
        let out = ''

        // NameInCushy
        const allCushyNodeNames = [...DB.plugins_byNodeNameInCushy.keys()]
        const sortedCushyNames = allCushyNodeNames.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
        out += '// prettier-ignore\n'
        out += 'export type KnownCustomNode_CushyName =\n'
        for (const fileName of sortedCushyNames) out += `    | ${JSON.stringify(fileName)}\n`
        out += '\n'

        writeFileSync('src/manager/extension-node-map/KnownCustomNode_CushyName.ts', out + '\n', 'utf-8')
    }

    // // INDEXING CHECKS ------------------------------------------------------------
    if (DB.opts.check) {
        //
        // console.log(`${knownModelList.length} models found`)
        console.log(`${totalCustomNodeSeen} CustomNodes unique names processed`)
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
// type CustomNodeURL_by_NodeNameInComfy = Map<NodeNameInComfy, KnownCustomNode_File[]>
// type CustomNodeURL_by_NodeNameInCushy = Map<NodeNameInCushy, KnownCustomNode_File[]>
// type CustomNodes_by_PluginTitle = Map<KnownCustomNode_File, NodeNameInCushy[]>

// type CustomNodeRegistry = {
//     byNodeNameInComfy: CustomNodeURL_by_NodeNameInComfy
//     byNodeNameInCushy: CustomNodeURL_by_NodeNameInCushy
//     byPluginName: CustomNodes_by_PluginTitle
// }

// let DB: Maybe<CustomNodeRegistry> = null // = knownCustomNodesFile.custom_nodes
