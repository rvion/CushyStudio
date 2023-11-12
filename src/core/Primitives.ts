export const ComfyPrimitiveMapping: { [key: string]: string } = {
    // BACK
    BOOLEAN: 'boolean',
    FLOAT: 'number',
    INT: 'number',
    STRING: 'string',

    // FRONT
    COMBO: 'any',
    ['INT:seed']: 'number',
    ['INT:noise_seed']: 'number',

    // ????
    // ⏸️ Boolean: 'boolean',
    // ⏸️ Float: 'number',
    // ⏸️ Integer: 'number',
    // ⏸️ SchedulerName: 'string',
    // ⏸️ SamplerName: 'string',
    // ⏸️ IMAGE_PATH: 'string',
}

export const ComfyPrimitives: string[] = Object.keys(ComfyPrimitiveMapping)

/*

export const ComfyPrimitiveMapping: { [key: string]: string } = {
    // '*': 'STAR',
    //
    // Boolean: 'boolean',
    BOOLEAN: 'boolean',
    //
    FLOAT: 'number',
    // Float: 'number',
    //
    INT: 'number',
    // Integer: 'number',
    //
    STRING: 'string',
    //
    // SchedulerName: 'string',
    // SamplerName: 'string',
    // IMAGE_PATH: 'string',
}

export const ComfyPrimitives: string[] = Object.keys(ComfyPrimitiveMapping)

*/

// "type": "VAELoader",
// "type": "VAEDecode",
// "type": "SaveImage",
// "type": "STRING",
// "type": "Reroute",
// "type": "PrimitiveNode",
// "type": "PreviewImage",
// "type": "LatentUpscaleBy",
// "type": "KSampler",
// "type": "ImageScaleBy",
// "type": "INT",
// "type": "EmptyLatentImage",
// "type": "ControlNetLoader",
// "type": "ControlNetApply",
// "type": "CheckpointLoaderSimple",
// "type": "Canny",
// "type": "CONTROL_NET",
// "type": "CONDITIONING",
// "type": "COMBO",
// "type": "CLIPTextEncode",
