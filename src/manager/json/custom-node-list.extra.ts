import type { ComfyManagerFilePluginList } from '../types/ComfyManagerFilePluginList'

export const ComfyPluginExtra: ComfyManagerFilePluginList = {
   custom_nodes: [
      {
         id: 'TEMP_ComfyUI-BRIA_AI-RMBG',
         author: 'ZHO-ZHO-ZHO',
         title: 'TEMP_ComfyUI-BRIA_AI-RMBG',
         reference: 'https://github.com/ZHO-ZHO-ZHO/ComfyUI-BRIA_AI-RMBG',
         files: ['https://github.com/ZHO-ZHO-ZHO/ComfyUI-BRIA_AI-RMBG'],
         install_type: 'git-clone',
         description: 'better rembg ?',
      },
   ],
}
