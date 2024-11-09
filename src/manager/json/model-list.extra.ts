import type { ComfyManagerFileModelInfo } from '../types/ComfyManagerFileModelInfo'

export const extraModels: ComfyManagerFileModelInfo = {
   models: [
      {
         name: 'TEMP_briaai_RMBG-1.4',
         type: 'controlnet',
         base: 'SDXL',
         save_path: 'custom_nodes/ComfyUI-BRIA_AI-RMBG/RMBG-1.4',
         description: '<3 stuff',
         reference: 'https://huggingface.co/briaai/RMBG-1.4',
         filename: 'model.pth',
         url: 'https://huggingface.co/briaai/RMBG-1.4/resolve/main/model.pth?download=true',
      },
      {
         name: '4x_NMKD-Siax_200k',
         type: 'upscale',
         base: 'upscale',
         save_path: 'default',
         description: '4xRealWebPhoto_v4_dat2',
         reference: 'https://openmodeldb.info/models/4x-RealWebPhoto-v4-dat2',
         filename: '4xRealWebPhoto_v4_dat2.pth',
         url: 'https://huggingface.co/gemasai/4x_NMKD-Siax_200k/resolve/main/4xRealWebPhoto_v4_dat2.pth',
      },
   ],
}
