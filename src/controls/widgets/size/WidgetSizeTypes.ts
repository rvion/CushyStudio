// prettier-ignore
export type SDModelType =
    | 'SD1.5 512'
    | 'SD2.1 768'
    | 'SDXL 1024'
    | 'custom'

export type AspectRatio =
    | '16:9'
    | '1:1'
    | '1:2'
    | '1:4'
    | '21:9'
    | '2:1'
    | '2:3'
    | '3:2'
    | '3:4'
    | '4:1'
    | '4:3'
    | '9:16'
    | '9:21'
    | 'custom'

export type CushySizeByRatio = {
    modelType: SDModelType
    aspectRatio: AspectRatio
}

export type CushySize = {
    type: 'size'
    width: number
    height: number
    modelType: SDModelType
    aspectRatio: AspectRatio
}
