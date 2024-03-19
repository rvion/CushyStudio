import crypto from 'crypto'

export const hashBlob = async (blob: Blob): Promise<string> => {
    const buffer = await blob.arrayBuffer()
    return crypto.createHash('sha1').update(Buffer.from(buffer)).digest('hex')
}

export const hashArrayBuffer = (buffer: ArrayBuffer): string => {
    const data = Buffer.from(buffer)
    return crypto.createHash('sha1').update(data).digest('hex')
}
