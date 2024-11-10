import * as v from 'valibot'

import {
   type ComfyManagerPluginContentMetadata,
   ComfyManagerPluginContentMetadata_valibot,
} from './ComfyManagerPluginContentMetadata'
import {
   type ComfyManagerPluginContentNodeName,
   ComfyManagerPluginContentNodeName_valibot,
} from './ComfyManagerPluginContentNodeName'

// FILE TYPE ------------------------------------------------------------------------
// wtf is this format...
export type ComfyManagerFilePluginContent = {
   [file: string /* KnownComfyPluginURL */]: [
      //
      ComfyManagerPluginContentNodeName[],
      ComfyManagerPluginContentMetadata,
   ]
}

export const ComfyManagerFilePluginContent_valibot = v.record(
   v.string(),
   v.tuple([
      //
      v.array(ComfyManagerPluginContentNodeName_valibot),
      ComfyManagerPluginContentMetadata_valibot,
   ]),
)
