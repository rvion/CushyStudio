import type { ComfyManagerRepository } from '../ComfyManagerRepository'

import { Value, ValueError } from '@sinclair/typebox/value'
import { readFileSync, writeFileSync } from 'fs'

import { CustomNodeFile, CustomNodesInfo_Schema, PluginInfo } from './custom-node-list-types'

export type GetKnownPluginProps = {
    //
    updateCache?: boolean
    check?: boolean
    genTypes?: boolean
}

export const _getKnownPlugins = (DB: ComfyManagerRepository): void => {
    let totalFileSeen = 0
    let totalPluginSeen = 0

    const knownPluginFile: CustomNodeFile =      JSON.parse(readFileSync('src/manager/custom-node-list/custom-node-list.json',       'utf8')) // prettier-ignore
    const knownPluginFileExtra: CustomNodeFile = JSON.parse(readFileSync('src/manager/custom-node-list/custom-node-list.extra.json', 'utf8')) // prettier-ignore
    const knownPluginList: PluginInfo[] = knownPluginFile.custom_nodes.concat(knownPluginFileExtra.custom_nodes)

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
        if (DB.opts.check && DB.plugins_byTitle.has(plugin.title)) console.log(`❌ plugin.title: "${plugin.title}" is duplicated`)
        DB.plugins_byTitle.set(plugin.title, plugin)
        for (const pluginURI of plugin.files) {
            totalFileSeen++
            if (DB.opts.check && DB.plugins_byFile.has(pluginURI)) console.log(`❌ plugin.file: "${pluginURI}" is duplicated`)
            DB.plugins_byFile.set(pluginURI, plugin)
        }
    }

    // CODEGEN ------------------------------------------------------------
    if (DB.opts.genTypes) {
        let out1 = ''
        // TitleType
        const allTitles = [...DB.plugins_byTitle.keys()]
        const sortedPluginTitles = allTitles.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
        out1 += '// prettier-ignore\n'
        out1 += 'export type KnownCustomNode_Title =\n'
        for (const pluginTitle of sortedPluginTitles) out1 += `    | ${JSON.stringify(pluginTitle)}\n`
        out1 += '\n'
        writeFileSync('src/manager/custom-node-list/KnownCustomNode_Title.ts', out1 + '\n', 'utf-8')

        // FileType
        let out2 = ''
        const allFileNames = [...DB.plugins_byFile.keys()]
        const sortedFileNames = allFileNames.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
        out2 += '// prettier-ignore\n'
        out2 += 'export type KnownCustomNode_File =\n'
        for (const fileName of sortedFileNames) out2 += `    | ${JSON.stringify(fileName)}\n`
        out2 += '\n'
        writeFileSync('src/manager/custom-node-list/KnownCustomNode_File.ts', out2 + '\n', 'utf-8')
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
