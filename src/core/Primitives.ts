export const ComfyPrimitiveMapping: { [key: string]: string } = {
    // '*': 'STAR',
    //
    Boolean: 'boolean',
    BOOLEAN: 'boolean',
    //
    FLOAT: 'number',
    Float: 'number',
    //
    INT: 'number',
    Integer: 'number',
    //
    STRING: 'string',
    //
    SchedulerName: 'string',
    SamplerName: 'string',
    IMAGE_PATH: 'string',
}

export const ComfyPrimitives: string[] = Object.keys(ComfyPrimitiveMapping)
