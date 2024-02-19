// prettier-ignore
export type SDModelType =
    | 'SD1.5 512'
    | 'SD2.1 768'
    | 'SDXL 1024'

export type CushySizeByRatio = {
    modelType?: SDModelType
    aspectRatio?: AspectRatio
    width?: number
    height?: number
}

export type CushySize = {
    type: 'size'
    width: number
    height: number
    modelType: SDModelType
    aspectRatio: AspectRatio
}

export type ModelType = 'xl' | '1.5' | 'custom'

// prettier-ignore
export type AspectRatio =
    | '1:1'
    | '16:9' | '4:3' | '3:2'
    | '9:16' | '3:4' | '2:3'
