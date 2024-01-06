import { downloadFile } from 'src/utils/fs/downloadFile'

await downloadFile(
    'https://raw.githubusercontent.com/ltdrdata/ComfyUI-Manager/main/node_db/new/alter-list.json',
    'src/wiki/alter-list.json',
)
await downloadFile(
    'https://raw.githubusercontent.com/ltdrdata/ComfyUI-Manager/main/node_db/new/custom-node-list.json',
    'src/wiki/custom-node-list.json',
)
await downloadFile(
    'https://raw.githubusercontent.com/ltdrdata/ComfyUI-Manager/main/node_db/new/extension-node-map.json',
    'src/wiki/extension-node-map.json',
)
await downloadFile(
    'https://raw.githubusercontent.com/ltdrdata/ComfyUI-Manager/main/node_db/new/model-list.json',
    'src/wiki/model-list.json',
)
