import { downloadFile } from 'src/utils/fs/downloadFile'
import { getKnownCheckpoints, getKnownModels } from './modelList'
import { getKnownPlugins } from './customNodeList'
import { getCustomNodeRegistry } from './extension-node-map/extension-node-map-loader'
import { wrapBox } from './_wrapBox'

// ------------------------------------------------------------------------------
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

// ------------------------------------------------------------------------------
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

// ------------------------------------------------------------------------------
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

// alter ------------------------------------------------------------------------------
console.log(wrapBox(`[🎹] synchronizing alter-list.json...`))
await downloadFile(
    'https://raw.githubusercontent.com/ltdrdata/ComfyUI-Manager/main/alter-list.json',
    'src/wiki/jsons/alter-list.json',
)
