// 💬 2024-11-03 rvion:
// during codegen iteration, we really want to have a quick way to test things faster
// than just reloading the whole CushyStudio app and leaving codegen do it's thing
// this script is a bun script that continuously re-gen the .d.ts file(s) in a separate folder
// so we can monitor what it does.
import fs from 'fs'

import { ComfyUIObjectInfoParsed } from '../comfyui/ComfyUIObjectInfoParsed'
import { readableStringify } from '../csuite/formatters/stringifyReadable'

const inputObjectInfoPath = 'src/comfyui/examples/object_info.json'

// eslint-disable-next-line no-constant-condition
if (true) {
   const controller = new AbortController()
   const timeout = setTimeout(() => controller.abort(), 500)
   try {
      const raw = await fetch('http://192.168.1.19:8188/object_info', { signal: controller.signal })
      console.log(raw)
      const result = await raw.json()
      fs.writeFileSync(inputObjectInfoPath, readableStringify(result, 3), 'utf8')
   } catch (error) {
      console.error('Fetch request timed out or failed:', error)
   } finally {
      clearTimeout(timeout)
   }
}

// find . -name 'object_info.json'
// const inputObjectInfoPath = 'schema/hosts/Z3LBuTxBOybwVxlb5bbCk/object_info.json'
const inputEmbeddingsPath = 'schema/hosts/Z3LBuTxBOybwVxlb5bbCk/embeddings.json'

// step 2. read the object_info.json and embeddings files
const embeddings = JSON.parse(fs.readFileSync(inputEmbeddingsPath, 'utf-8'))
const spec = JSON.parse(fs.readFileSync(inputObjectInfoPath, 'utf-8'))

// step 3. craft a parsed ObjectInfo
const parsedObjectInfo = new ComfyUIObjectInfoParsed({
   id: 'test',
   spec,
   embeddings,
})

const finalSDK = parsedObjectInfo.codegenDTS({
   /* prefix: '../../../src/' */
})
fs.writeFileSync(`schema/global.d.ts`, finalSDK)
fs.writeFileSync(`comfyui.typings.md`, `# Example ComfyUI Typings\n\`\`\`ts\n${finalSDK}\n\`\`\``)
// for (const { pythonModule, content } of finalSDK.pythonModules) {
//    fs.writeFileSync(`${targetDebugFolder}/${pythonModule}.d.ts`, content)
// }
// console.log(`[🤠] finalSDK.length:`, finalSDK.length)

// ... profit
console.log(`🟢 done`)
