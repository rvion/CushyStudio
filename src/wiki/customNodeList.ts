import { Value, ValueError } from '@sinclair/typebox/value'
import { Static, Type } from '@sinclair/typebox'
import { readFileSync, writeFileSync } from 'fs'

// prettier-ignore
export type PluginInfo = {
    // always present           // EXAMPLES
    "author"         : string   // "Dr.Lt.Data",
    "title"          : string   // "ComfyUI-Manager",
    "reference"      : string   // "https://github.com/ltdrdata/ComfyUI-Manager",
    "files"          : string[] // ["https://github.com/ltdrdata/ComfyUI-Manager"],
    "install_type"   : string   // "git-clone",
    "description"    : string   // "ComfyUI-Manager itself is also a custom node."

    // optional
    pip             ?: string[] // [ "ultralytics" ],
    nodename_pattern?: string   // "Inspire$",
    apt_dependency  ?: string[] // [ "rustc", "cargo" ],
    js_path         ?: string   // "strimmlarn",
}

export const CustomNodesInfo_Schema = Type.Object(
    {
        author: Type.String(),
        title: Type.String(),
        reference: Type.String(),
        files: Type.Array(Type.String()),
        install_type: Type.String(),
        description: Type.String(),
        //
        pip: Type.Optional(Type.Array(Type.String())),
        nodename_pattern: Type.Optional(Type.String()),
        apt_dependency: Type.Optional(Type.Array(Type.String())),
        js_path: Type.Optional(Type.String()),
    },
    { additionalProperties: false },
)

/* ✅ */ type PluginInfo2 = Static<typeof CustomNodesInfo_Schema>
/* ✅ */ const _t1: PluginInfo = 0 as any as PluginInfo2
/* ✅ */ const _t2: PluginInfo2 = 0 as any as PluginInfo

export type CustomNodeFile = {
    custom_nodes: PluginInfo[]
}

type KnownPluginMap = Map<string, PluginInfo>
let knownPlugins: Maybe<{
    byTitle: KnownPluginMap
    byURI: KnownPluginMap
}> = null // = knownCustomNodesFile.custom_nodes

export const getKnownPlugins = (p?: {
    //
    updateCache?: boolean
    check?: boolean
    genTypes?: boolean
}) => {
    if (knownPlugins != null && !p?.updateCache) return knownPlugins

    let totalFileSeen = 0
    let totalPluginSeen = 0

    const knownPluginFile: CustomNodeFile = JSON.parse(readFileSync('src/wiki/jsons/custom-node-list.json', 'utf8'))
    const knownPluginList: PluginInfo[] = knownPluginFile.custom_nodes
    knownPlugins = {
        byTitle: new Map(),
        byURI: new Map(),
    }

    let hasErrors = false
    for (const plugin of knownPluginList) {
        // JSON CHECKS ------------------------------------------------------------
        if (!hasErrors && p?.check) {
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
        if (knownPlugins.byTitle.has(plugin.title)) console.log(`❌ plugin.title: "${plugin.title}" is duplicated`)
        knownPlugins.byTitle.set(plugin.title, plugin)
        for (const pluginURI of plugin.files) {
            totalFileSeen++
            if (knownPlugins.byURI.has(pluginURI)) console.log(`❌ plugin.file: "${pluginURI}" is duplicated`)
            knownPlugins.byURI.set(pluginURI, plugin)
        }
    }

    // CODEGEN ------------------------------------------------------------
    if (p?.genTypes) {
        let out = ''
        // TitleType
        const allTitles = [...knownPlugins.byTitle.keys()]
        const sortedPluginTitles = allTitles.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
        out += 'export type ComfyUIManagerKnownCustomNode_Title =\n'
        for (const pluginTitle of sortedPluginTitles) out += `    | ${JSON.stringify(pluginTitle)}\n`
        out += '\n'

        // FileType
        const allFileNames = [...knownPlugins.byURI.keys()]
        const sortedFileNames = allFileNames.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
        out += 'export type ComfyUIManagerKnownCustomNode_Files =\n'
        for (const fileName of sortedFileNames) out += `    | ${JSON.stringify(fileName)}\n`
        out += '\n'

        writeFileSync('src/wiki/customNodeListTypes.ts', out + '\n', 'utf-8')
    }

    // INDEXING CHECKS ------------------------------------------------------------
    if (p?.check) {
        //
        // console.log(`${knownModelList.length} models found`)
        console.log(`${totalPluginSeen} CustomNodes in file`)
        console.log(`${knownPlugins.byTitle.size} CustomNodes registered in map`)
        // if (totalPluginSeen !== knownPlugins.byTitle.size)
        //     console.log(`❌ some customNodes are either duplicated or have overlapping titles`)

        console.log(`${totalFileSeen} CustomNodes-File Seen`)
        console.log(`${knownPlugins.byURI.size} CustomNodes-File registered in map`)
        // if (totalFileSeen !== knownPlugins.byURI.size)
        //     console.log(`❌ some customNodes are either duplicated or have overlapping files`)

        if (hasErrors) console.log(`❌ some CustomNodes don't match schema`)
        else console.log(`✅ all CustomNodes match schema`)
    }

    return knownPlugins
}
