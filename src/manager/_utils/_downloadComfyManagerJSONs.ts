import { ComfyManagerRepository } from '../ComfyManagerRepository'
import { wrapBox } from './_wrapBox'
import { downloadFile } from 'src/utils/fs/downloadFile'

// import { _getKnownPlugins } from '../custom-node-list/custom-node-list-loader'
// import { _getCustomNodeRegistry } from '../extension-node-map/extension-node-map-loader'
// import { _getKnownModels } from '../model-list/model-list-loader'
// const args = process.argv.slice(2)
// const onlyRegistry = args.includes('--only-registry')
// if (onlyRegistry) {
//     await SYNC_extensionNodeMap()
//     process.exit(0)
// }

await SYNC_modelList()
await SYNC_customNodeList()
await SYNC_extensionNodeMap()
await SYNC_alterList()

// ------------------------------------------------------------------------------
async function SYNC_modelList() {
    console.log(wrapBox(`[🎹] synchronizing model-list.json...`))
    await downloadFile(
        'https://raw.githubusercontent.com/ltdrdata/ComfyUI-Manager/main/model-list.json',
        'src/manager/model-list/model-list.json',
    )
}
// ------------------------------------------------------------------------------
async function SYNC_customNodeList() {
    console.log(wrapBox(`[🎹] synchronizing custom-node-list.json...`))
    await downloadFile(
        'https://raw.githubusercontent.com/ltdrdata/ComfyUI-Manager/main/custom-node-list.json',
        'src/manager/custom-node-list/custom-node-list.json',
    )
}
// ------------------------------------------------------------------------------
async function SYNC_extensionNodeMap() {
    console.log(wrapBox(`[🎹] synchronizing extension-node-map.json...`))
    await downloadFile(
        'https://raw.githubusercontent.com/ltdrdata/ComfyUI-Manager/main/extension-node-map.json',
        'src/manager/extension-node-map/extension-node-map.json',
    )
}
// alter ------------------------------------------------------------------------------
async function SYNC_alterList() {
    console.log(wrapBox(`[🎹] synchronizing alter-list.json...`))
    await downloadFile(
        'https://raw.githubusercontent.com/ltdrdata/ComfyUI-Manager/main/alter-list.json',
        'src/manager/alter-list/alter-list.json',
    )
}

// should take care of the code generation
new ComfyManagerRepository({
    check: true,
    genTypes: true,
})
