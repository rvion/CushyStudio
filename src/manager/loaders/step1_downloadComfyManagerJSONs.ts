import { downloadFile } from '../../utils/fs/downloadFile'
import { wrapBox } from '../_utils/_wrapBox'

export async function DownloadComfyManagerJSONs(): Promise<void> {
   await SYNC_modelList()
   await SYNC_customNodeList()
   await SYNC_extensionNodeMap()
   await SYNC_alterList()
   await SYNC_githubStats()

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
}
