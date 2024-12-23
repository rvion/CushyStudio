import crypto from 'crypto'

export async function hashBlob(blob: Blob): Promise<string> {
   const buffer = await blob.arrayBuffer()
   return crypto.createHash('sha1').update(Buffer.from(buffer)).digest('hex')
}
