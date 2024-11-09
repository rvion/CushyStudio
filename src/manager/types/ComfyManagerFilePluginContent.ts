import type { ComfyManagerPluginContentMetadata } from './ComfyManagerPluginContentMetadata'
import type { ComfyManagerPluginContentNodeName } from './ComfyManagerPluginContentNodeName'

// FILE TYPE ------------------------------------------------------------------------
// wtf is this format...
export type ComfyManagerFilePluginContent = {
   [file: string /* KnownComfyPluginURL */]: [
      //
      ComfyManagerPluginContentNodeName[],
      ComfyManagerPluginContentMetadata,
   ]
}
