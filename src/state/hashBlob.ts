import { sha256base64 } from 'ohash'

export const hashBlob = async (blob: Blob): Promise<string> => {
    const buffer = await blob.arrayBuffer()
    return hashArrayBuffer(buffer)
}

export const hashArrayBuffer = (buffer: ArrayBuffer): string => {
    const b64 = Buffer.from(buffer).toString('base64')
    return sha256base64(b64)
}
