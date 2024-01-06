import { downloadFile } from 'src/utils/fs/downloadFile'

await downloadFile(
    'https://raw.githubusercontent.com/ltdrdata/ComfyUI-Manager/main/node_db/new/alter-list.json',
    'src/wiki/jsons/alter-list.json',
)
await downloadFile(
    'https://raw.githubusercontent.com/ltdrdata/ComfyUI-Manager/main/node_db/new/custom-node-list.json',
    'src/wiki/jsons/custom-node-list.json',
)
await downloadFile(
    'https://raw.githubusercontent.com/ltdrdata/ComfyUI-Manager/main/node_db/new/extension-node-map.json',
    'src/wiki/jsons/extension-node-map.json',
)
await downloadFile(
    'https://raw.githubusercontent.com/ltdrdata/ComfyUI-Manager/main/node_db/new/model-list.json',
    'src/wiki/jsons/model-list.json',
)
