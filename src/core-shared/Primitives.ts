export const ComfyPrimitiveMapping: { [key: string]: string } = {
    FLOAT: 'number',
    INT: 'number',
    STRING: 'string',
}

export const ComfyPrimitives: string[] = Object.keys(ComfyPrimitiveMapping)
