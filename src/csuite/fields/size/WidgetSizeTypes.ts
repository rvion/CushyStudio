// ALLOWED_IN: [Cushy, FORMS]

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
    $: 'size'
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
    | '15:16'
    | '15:17'
    | '14:17'
    | '7:9'
    | '13:18'
    | '13:19'
    | '3:5'
    | '4:7'
    | '11:21'
    | '1:2'
    | '16:15'
    | '17:15'
    | '17:14'
    | '9:7'
    | '18:13'
    | '19:13'
    | '5:3'
    | '7:4'
    | '21:11'
    | '2:1'

export const aspectRatioMap: { [ar in AspectRatio]: { width: number; height: number } } = {
    '15:16': { width: 960, height: 1024 },
    '16:15': { width: 1024, height: 960 },

    '15:17': { width: 960, height: 1088 },
    '17:15': { width: 1088, height: 896 },

    '14:17': { width: 896, height: 1088 },
    '17:14': { width: 1088, height: 896 },

    '7:9': { width: 896, height: 1152 },
    '9:7': { width: 1152, height: 896 },

    '13:18': { width: 832, height: 1152 },
    '18:13': { width: 1152, height: 832 },

    '13:19': { width: 832, height: 1216 },
    '19:13': { width: 1216, height: 832 },

    '3:5': { width: 768, height: 1280 },
    '5:3': { width: 1280, height: 768 },

    '4:7': { width: 768, height: 1344 },
    '7:4': { width: 1344, height: 768 },

    '11:21': { width: 704, height: 1344 },
    '21:11': { width: 1344, height: 704 },

    '1:2': { width: 704, height: 1408 },
    '2:1': { width: 1408, height: 704 },

    '16:9': { width: 1024, height: 576 },
    '9:16': { width: 576, height: 1024 },

    '4:3': { width: 1024, height: 768 },
    '3:4': { width: 768, height: 1024 },

    '3:2': { width: 1024, height: 683 },
    '2:3': { width: 683, height: 1024 },

    '1:1': { width: 1024, height: 1024 },
}
