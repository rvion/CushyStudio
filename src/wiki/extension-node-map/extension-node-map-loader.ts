import { Value, ValueError } from '@sinclair/typebox/value'
import { readFileSync, writeFileSync } from 'fs'
import { NodeNameInComfy, NodeNameInCushy } from 'src/models/Schema'
import { ComfyUIManagerKnownCustomNode_Files } from '../customNodeListTypes'
import { ExtensionNodeMapFile, ENMInfos_Schema, ENMInfos } from './extension-node-map-types'
import { bang } from 'src/utils/misc/bang'
import { normalizeJSIdentifier } from 'src/core/normalizeJSIdentifier'

// need to be an array, because multiple custom nodes can have the same name
type CustomNodeURL_by_NodeNameInComfy = Map<NodeNameInComfy, ComfyUIManagerKnownCustomNode_Files[]>
type CustomNodeURL_by_NodeNameInCushy = Map<NodeNameInCushy, ComfyUIManagerKnownCustomNode_Files[]>

type CustomNodeRegistry = {
    byNodeNameInComfy: CustomNodeURL_by_NodeNameInComfy
    byNodeNameInCushy: CustomNodeURL_by_NodeNameInCushy
}

let customNodeRegistry: Maybe<CustomNodeRegistry> = null // = knownCustomNodesFile.custom_nodes

export const getCustomNodeRegistry = (p?: {
    //
    updateCache?: boolean
    check?: boolean
    genTypes?: boolean
}): CustomNodeRegistry => {
    if (customNodeRegistry != null && !p?.updateCache) return customNodeRegistry

    let totalCustomNodeSeen = 0

    const extensionNodeMapFile: ExtensionNodeMapFile = JSON.parse(
        readFileSync('src/wiki/extension-node-map/extension-node-map.json', 'utf8'),
    )
    type ENMEntry = { url: string; comfyNodeNames: NodeNameInComfy[]; meta: ENMInfos }
    const enmEntries: ENMEntry[] = Object.entries(extensionNodeMapFile).map(
        (x: [url: string, infos: [NodeNameInComfy[], ENMInfos]]): ENMEntry => {
            const url = x[0]
            const [comfyNodeNames, meta] = x[1]
            return { url, comfyNodeNames, meta }
        },
    )

    customNodeRegistry = {
        byNodeNameInComfy: new Map(),
        byNodeNameInCushy: new Map(),
    }

    let hasErrors = false
    for (const enmEntry of enmEntries) {
        // JSON CHECKS ------------------------------------------------------------
        if (!hasErrors && p?.check) {
            const valid = Value.Check(ENMInfos_Schema, enmEntry.meta)
            if (!valid) {
                const errors: ValueError[] = [...Value.Errors(ENMInfos_Schema, enmEntry.meta)]
                console.error(`❌ customNode doesn't match schema:`, enmEntry.meta)
                console.error(`❌ errors`, errors)
                for (const i of errors) console.log(`❌`, JSON.stringify(i))
                hasErrors = true
                // debugger
            }
        }

        // INITIALIZATION ------------------------------------------------------------
        // if (CustomNodeURL.byNodeNameInComfy.has(plugin.title)) console.log(`❌ plugin.title: "${plugin.title}" is duplicated`)
        // CustomNodeURL.byNodeNameInComfy.set(plugin.title, plugin)
        // CustomNodeURL.byNodeNameInComfy
        for (const nodeNameInComfy of enmEntry.comfyNodeNames) {
            // index by nodeNameInComfy
            const entry1 = customNodeRegistry.byNodeNameInComfy.get(nodeNameInComfy)
            if (entry1 == null) {
                customNodeRegistry.byNodeNameInComfy.set(nodeNameInComfy, [enmEntry.url as ComfyUIManagerKnownCustomNode_Files])
            } else {
                console.log(`[👙] duplicated node ${nodeNameInComfy}`)
                entry1.push(enmEntry.url as ComfyUIManagerKnownCustomNode_Files)
            }

            // index by nodeNameInCushy
            const nodeInCushy = normalizeJSIdentifier(nodeNameInComfy, ' ')
            const entry2 = customNodeRegistry.byNodeNameInCushy.get(nodeInCushy)
            if (entry2 == null) {
                customNodeRegistry.byNodeNameInCushy.set(nodeInCushy, [enmEntry.url as ComfyUIManagerKnownCustomNode_Files])
            } else {
                console.log(`[👙] duplicated node ${nodeInCushy}`)
                entry2.push(enmEntry.url as ComfyUIManagerKnownCustomNode_Files)
            }
        }
    }

    // CODEGEN ------------------------------------------------------------
    if (p?.genTypes) {
        let out = ''

        // NameInComfy
        const allComfyNames = [...customNodeRegistry.byNodeNameInComfy.keys()]
        const sortedComfyNames = allComfyNames.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
        out += 'export type KnownInstallableCustomNodeComfyName =\n'
        for (const pluginTitle of sortedComfyNames) out += `    | ${JSON.stringify(pluginTitle)}\n`
        out += '\n'

        // NameInCushy
        const allCushyNodeNames = [...customNodeRegistry.byNodeNameInCushy.keys()]
        const sortedCushyNames = allCushyNodeNames.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
        out += 'export type KnownInstallableCustomNodeCushyName =\n'
        for (const fileName of sortedCushyNames) out += `    | ${JSON.stringify(fileName)}\n`
        out += '\n'

        writeFileSync('src/wiki/extension-node-map/extension-node-map-enums.ts', out + '\n', 'utf-8')
    }

    // // INDEXING CHECKS ------------------------------------------------------------
    if (p?.check) {
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

    return customNodeRegistry
}
