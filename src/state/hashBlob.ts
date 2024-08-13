import crypto from 'crypto'

export const hashBlob = async (blob: Blob): Promise<string> => {
    const buffer = await blob.arrayBuffer()
    return crypto.createHash('sha1').update(Buffer.from(buffer)).digest('hex')
}
