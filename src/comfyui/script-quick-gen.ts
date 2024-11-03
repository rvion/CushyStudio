// 💬 2024-11-03 rvion:
// during codegen iteration, we really want to have a quick way to test things faster
// than just reloading the whole CushyStudio app and leaving codegen do it's thing
// this script is a bun script that continuously re-gen the .d.ts file(s) in a separate folder
// so we can monitor what it does.
import fs from 'fs'

import { ParsedObjectInfo } from './ParsedComfyUIObjectInfo'

// find . -name 'object_info.json'
const inputObjectInfoPath = 'schema/hosts/Z3LBuTxBOybwVxlb5bbCk/object_info.json'
const inputEmbeddingsPath = 'schema/hosts/Z3LBuTxBOybwVxlb5bbCk/embeddings.json'

const targetDebugFolder = `src/comfyui/script-quick-gen-output`
const _oldTxtFilePath = 'schema/hosts/Z3LBuTxBOybwVxlb5bbCk/sdk.dts.txt'
const _oldDTSFilePath = 'schema/global.d.ts'

// step 1. clean the target folder
if (fs.existsSync(targetDebugFolder)) {
   console.log(`[🤠] folder "${targetDebugFolder}" already exists: deleting...`)
   fs.rmdirSync(targetDebugFolder, { recursive: true })
}
fs.mkdirSync(targetDebugFolder)

// step 2. read the object_info.json and embeddings files
const embeddings = JSON.parse(fs.readFileSync(inputEmbeddingsPath, 'utf-8'))
const spec = JSON.parse(fs.readFileSync(inputObjectInfoPath, 'utf-8'))

// step 3. craft a parsed ObjectInfo
const parsedObjectInfo = new ParsedObjectInfo({
   id: 'test',
   spec,
   embeddings,
})

const finalSDK = parsedObjectInfo.codegenDTS({ prefix: '../../../src/' })
fs.writeFileSync(`${targetDebugFolder}/DEBUG-sdk.d.ts`, finalSDK)
console.log(`[🤠] finalSDK.length:`, finalSDK.length)

// ... profit
console.log(`🟢 done`)
