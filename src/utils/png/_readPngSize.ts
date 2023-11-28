export function _readPngSize(buffer: ArrayBuffer): { width: number; height: number } {
    const dataView = new DataView(buffer)

    // Check the PNG signature
    const hasSignature = [137, 80, 78, 71, 13, 10, 26, 10].every((byte, index) => dataView.getUint8(index) === byte)

    if (!hasSignature) {
        throw new Error('Not a PNG file.')
    }

    // The IHDR chunk is located at offset 8 (after the 8-byte signature)
    const length = dataView.getUint32(8) // Should be 13 for IHDR
    const type = dataView.getUint32(12) // Should be 'IHDR' (0x49484452)

    if (type === 1229472850) {
        // 'IHDR' in hex
        // IHDR chunk found, read the width and height
        const width = dataView.getUint32(16) // Width: Offset 16 to 19
        const height = dataView.getUint32(20) // Height: Offset 20 to 23
        return { width, height }
    } else {
        throw new Error('IHDR chunk not found.')
    }
}
