export type ComfyNodeUID = string

let nextUID = 1

export const getUID = () => (nextUID++).toString()
