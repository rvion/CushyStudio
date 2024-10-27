// import type { ComfyNodeType } from './Comfy'

export type ComfyPromptJSON = {
   [nodeUID: string]: ComfyNodeJSON
}

export type ComfyNodeJSON = {
   inputs: {
      // prettier-ignore
      [key: string]:
            | [string, number]
            | string
            | number
            | boolean
            | null
   }
   class_type: string
}
