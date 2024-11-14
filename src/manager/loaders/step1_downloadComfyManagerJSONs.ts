import chalk from 'chalk'

import { downloadFile } from '../../utils/fs/downloadFile'

export async function DownloadComfyManagerJSONs(): Promise<void> {
   await SYNC_modelList()
   await SYNC_customNodeList()
   await SYNC_extensionNodeMap()
   await SYNC_alterList()
   await SYNC_githubStats()

   async function SYNC_modelList(): Promise<void> {
      await downloadFile(
         'https://raw.githubusercontent.com/ltdrdata/ComfyUI-Manager/main/model-list.json',
         'src/manager/json/model-list.json',
         `- downloading ynchronizing model-list.json...`,
      )
      console.log(`  saved at ${chalk.blue('src/manager/json/model-list.json')}`)
   }

   async function SYNC_customNodeList(): Promise<void> {
      await downloadFile(
         'https://raw.githubusercontent.com/ltdrdata/ComfyUI-Manager/main/custom-node-list.json',
         'src/manager/json/custom-node-list.json',
         `- downloading synchronizing custom-node-list.json...`,
      )
      console.log(`  saved at ${chalk.blue('src/manager/json/custom-node-list.json')}`)
   }

   async function SYNC_extensionNodeMap(): Promise<void> {
      await downloadFile(
         'https://raw.githubusercontent.com/ltdrdata/ComfyUI-Manager/main/extension-node-map.json',
         'src/manager/json/extension-node-map.json',
         `- downloading synchronizing extension-node-map.json...`,
      )
      console.log(`  saved at ${chalk.blue('src/manager/json/extension-node-map.json')}`)
   }

   async function SYNC_alterList(): Promise<void> {
      await downloadFile(
         'https://raw.githubusercontent.com/ltdrdata/ComfyUI-Manager/main/alter-list.json',
         'src/manager/json/alter-list.json',
         `- downloading synchronizing alter-list.json...`,
      )
      console.log(`  saved at ${chalk.blue('src/manager/json/alter-list.json')}`)
   }

   async function SYNC_githubStats(): Promise<void> {
      await downloadFile(
         'https://raw.githubusercontent.com/ltdrdata/ComfyUI-Manager/refs/heads/main/github-stats.json',
         'src/manager/json/github-stats.json',
         `- downloading ynchronizing githubStats.json...`,
      )
      console.log(`  saved at ${chalk.blue('src/manager/json/github-stats.json')}`)
   }
}
