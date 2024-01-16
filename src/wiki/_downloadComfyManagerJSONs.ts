import { downloadFile } from 'src/utils/fs/downloadFile'
import { wrapBox } from './_wrapBox'
import { getKnownPlugins } from './customNodeList'
import { getCustomNodeRegistry } from './extension-node-map/extension-node-map-loader'
import { getKnownModels } from './modelList'

const args = process.argv.slice(2)
const onlyRegistry = args.includes('--only-registry')

if (onlyRegistry) {
    await SYNC_extensionNodeMap()
    process.exit(0)
}

await SYNC_modelList()
await SYNC_customNodeList()
await SYNC_extensionNodeMap()
await SYNC_alterList()

// ------------------------------------------------------------------------------
async function SYNC_modelList() {
    console.log(wrapBox(`[🎹] synchronizing model-list.json...`))
    await downloadFile(
        'https://raw.githubusercontent.com/ltdrdata/ComfyUI-Manager/main/model-list.json',
        'src/wiki/jsons/model-list.json',
    )

    getKnownModels({
        //
        updateCache: true,
        check: true,
        genTypes: true,
    })
}
// ------------------------------------------------------------------------------
async function SYNC_customNodeList() {
    console.log(wrapBox(`[🎹] synchronizing custom-node-list.json...`))
    await downloadFile(
        'https://raw.githubusercontent.com/ltdrdata/ComfyUI-Manager/main/custom-node-list.json',
        'src/wiki/jsons/custom-node-list.json',
    )
    getKnownPlugins({
        //
        updateCache: true,
        check: true,
        genTypes: true,
    })
}
// ------------------------------------------------------------------------------
async function SYNC_extensionNodeMap() {
    console.log(wrapBox(`[🎹] synchronizing extension-node-map.json...`))
    await downloadFile(
        'https://raw.githubusercontent.com/ltdrdata/ComfyUI-Manager/main/extension-node-map.json',
        'src/wiki/extension-node-map/extension-node-map.json',
    )
    getCustomNodeRegistry({
        //
        updateCache: true,
        check: true,
        genTypes: true,
    })
}
// alter ------------------------------------------------------------------------------
async function SYNC_alterList() {
    console.log(wrapBox(`[🎹] synchronizing alter-list.json...`))
    await downloadFile(
        'https://raw.githubusercontent.com/ltdrdata/ComfyUI-Manager/main/alter-list.json',
        'src/wiki/jsons/alter-list.json',
    )
}
