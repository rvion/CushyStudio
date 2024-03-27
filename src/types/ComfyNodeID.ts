import { z } from 'zod'

export type ComfyNodeID = Tagged<string, 'ComfyNodeID'>
export const ComfyNodeID$Schema = z.string({ description: 'ComfyNodeID' })

export type ComfyNodeMetadata = {
    id?: Maybe<ComfyNodeID>
    tag?: string
    tags?: string[]
    storeAs?: string
}
