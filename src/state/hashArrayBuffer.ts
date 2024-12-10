import crypto from 'crypto'

export const hashArrayBuffer = (buffer: /* ArrayBuffer |  */ Uint8Array): string => {
   const data = Buffer.from(buffer)
   return crypto.createHash('sha1').update(data).digest('hex')
}
