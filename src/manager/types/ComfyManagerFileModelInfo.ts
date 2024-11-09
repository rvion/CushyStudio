import * as v from 'valibot'

import { type ComfyManagerModelInfo, ComfyManagerModelInfo_valibot } from './ComfyManagerModelInfo'

export type ComfyManagerFileModelInfo = {
   models: ComfyManagerModelInfo[]
}

// #region valibot
export const ComfyManagerFileModelInfo_valibot = v.strictObject({
   models: v.array(ComfyManagerModelInfo_valibot),
})
