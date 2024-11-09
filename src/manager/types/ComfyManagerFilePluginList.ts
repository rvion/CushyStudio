import * as v from 'valibot'

import { type ComfyManagerPluginInfo, ComfyManagerPluginInfo_valibot } from './ComfyManagerPluginInfo'

export type ComfyManagerFilePluginList = {
   custom_nodes: ComfyManagerPluginInfo[]
}

// #region valibot
export const ComfyManagerFilePluginList_valibot = v.strictObject({
   custom_nodes: v.array(ComfyManagerPluginInfo_valibot),
})
