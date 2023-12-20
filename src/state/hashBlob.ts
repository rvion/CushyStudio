export const hashBlob = async (blob: Blob): Promise<string> => {
    const buffer = await blob.arrayBuffer()
    return hashArrayBuffer(buffer)
}

export const hashArrayBuffer = async (buffer: ArrayBuffer): Promise<string> => {
    const hash = await crypto.subtle.digest('SHA-256', buffer)
    const hashArray = Array.from(new Uint8Array(hash))
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
    return hashHex
}
