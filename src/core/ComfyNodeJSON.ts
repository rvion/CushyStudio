export type ComfyNodeJSON = {
    inputs: { [key: string]: any }
    class_type: string
}

export type ComfyProjectJSON = {
    [key: string]: ComfyNodeJSON
}
