import { downloadFile } from '../../utils/fs/downloadFile'
import { ComfyManagerRepository } from '../ComfyManagerRepository'
import { wrapBox } from './_wrapBox'

const skipDL = process.argv.includes('--skip-download')

if (!skipDL) {
   await SYNC_modelList()
   await SYNC_customNodeList()
   await SYNC_extensionNodeMap()
   await SYNC_alterList()
} else {
   console.log(`[🤠] skippign DL`)
}

async function SYNC_modelList(): Promise<void> {
   console.log(wrapBox(`[🎹] synchronizing model-list.json...`))
   await downloadFile(
      'https://raw.githubusercontent.com/ltdrdata/ComfyUI-Manager/main/model-list.json',
      'src/manager/json/model-list.json',
   )
}

async function SYNC_customNodeList(): Promise<void> {
   console.log(wrapBox(`[🎹] synchronizing custom-node-list.json...`))
   await downloadFile(
      'https://raw.githubusercontent.com/ltdrdata/ComfyUI-Manager/main/custom-node-list.json',
      'src/manager/json/custom-node-list.json',
   )
}

async function SYNC_extensionNodeMap(): Promise<void> {
   console.log(wrapBox(`[🎹] synchronizing extension-node-map.json...`))
   await downloadFile(
      'https://raw.githubusercontent.com/ltdrdata/ComfyUI-Manager/main/extension-node-map.json',
      'src/manager/json/extension-node-map.json',
   )
}

async function SYNC_alterList(): Promise<void> {
   console.log(wrapBox(`[🎹] synchronizing alter-list.json...`))
   await downloadFile(
      'https://raw.githubusercontent.com/ltdrdata/ComfyUI-Manager/main/alter-list.json',
      'src/manager/json/alter-list.json',
   )
}

async function SYNC_githubStats(): Promise<void> {
   console.log(wrapBox(`[🎹] synchronizing githubStats.json...`))
   await downloadFile(
      'https://github.com/ltdrdata/ComfyUI-Manager/blob/main/github-stats.json',
      'src/manager/json/github-stats.json',
   )
}

// should take care of the code generation
new ComfyManagerRepository({ check: true, genTypes: true })
