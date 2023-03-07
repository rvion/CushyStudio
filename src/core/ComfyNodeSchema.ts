export type ComfyNodeSchema = {
    input: NodeInput[]
    outputs: NodeOutput[]
    category: string
}
export type NodeInput = { name: string; type: string; opts?: any }
export type NodeOutput = { type: string; name: string }
