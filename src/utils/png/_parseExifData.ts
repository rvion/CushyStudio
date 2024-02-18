export type ExifData = { [key: string]: any }

// inspired from https://github.com/comfyanonymous/ComfyUI/blob/dccca1daa5af1954d55918f365e83a3331019549/web/scripts/pnginfo.js#L50C1-L96C1
export function parseExifData(arrData: Uint8Array): ExifData {
    // Check for the correct TIFF header (0x4949 for little-endian or 0x4D4D for big-endian)
    const isLittleEndian = new Uint16Array(arrData.slice(0, 2))[0] === 0x4949

    // Function to read 16-bit and 32-bit integers from binary data
    function readInt(offset: number, isLittleEndian: boolean, length: number) {
        let arr = arrData.slice(offset, offset + length)
        if (length === 2) {
            return new DataView(arr.buffer, arr.byteOffset, arr.byteLength).getUint16(0, isLittleEndian)
        } else if (length === 4) {
            return new DataView(arr.buffer, arr.byteOffset, arr.byteLength).getUint32(0, isLittleEndian)
        }
    }

    // Read the offset to the first IFD (Image File Directory)
    const ifdOffset = readInt(4, isLittleEndian, 4)!

    function parseIFD(offset: number) {
        const numEntries: number = readInt(offset, isLittleEndian, 2)!
        const result: ExifData = {}

        for (let i = 0; i < numEntries; i++) {
            const entryOffset = offset + 2 + i * 12
            const tag = readInt(entryOffset, isLittleEndian, 2)!
            const type = readInt(entryOffset + 2, isLittleEndian, 2)!
            const numValues = readInt(entryOffset + 4, isLittleEndian, 4)!
            const valueOffset = readInt(entryOffset + 8, isLittleEndian, 4)!

            // Read the value(s) based on the data type
            let value
            if (type === 2) {
                // ASCII string
                value = String.fromCharCode(...arrData.slice(valueOffset, valueOffset + numValues - 1))
            }

            result[tag] = value
        }

        return result
    }

    // Parse the first IFD
    const ifdData: ExifData = parseIFD(ifdOffset)
    return ifdData
}
