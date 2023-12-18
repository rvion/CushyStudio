export type ComfyNodeID = Tagged<string, 'ComfyNodeID'>

export type ComfyNodeMetadata = {
    id?: Maybe<ComfyNodeID>
    tag?: string
    storeAs?: string
}
