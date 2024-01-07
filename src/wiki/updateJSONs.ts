import { downloadFile } from 'src/utils/fs/downloadFile'
import { getKnownModels } from './modelList'

await downloadFile(
    'https://raw.githubusercontent.com/ltdrdata/ComfyUI-Manager/main/alter-list.json',
    'src/wiki/jsons/alter-list.json',
)
await downloadFile(
    'https://raw.githubusercontent.com/ltdrdata/ComfyUI-Manager/main/custom-node-list.json',
    'src/wiki/jsons/custom-node-list.json',
)
await downloadFile(
    'https://raw.githubusercontent.com/ltdrdata/ComfyUI-Manager/main/extension-node-map.json',
    'src/wiki/jsons/extension-node-map.json',
)
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
