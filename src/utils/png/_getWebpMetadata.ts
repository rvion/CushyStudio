import { type ExifData, parseExifData } from './_parseExifData'

export function getWebpMetadata(file: File): Promise<ExifData> {
    return new Promise<any>((r, reject) => {
        const reader = new FileReader()
        reader.onload = (event) => {
            const res = event.target?.result
            // A. ensure we properly loaded the file
            if (res == null) return reject('file load error')
            // B. ensure we don't have a string
            if (typeof res === 'string') return reject('file load error')
            // C. Get the PNG data as a Uint8Array
            const webp = new Uint8Array(res)

            r(getWebpMetadataFromFile(webp))
            // const webp = new Uint8Array(event.target.result)
        }

        reader.readAsArrayBuffer(file)
    })
}

const getWebpMetadataFromFile = (webp: Uint8Array): Maybe<ExifData> => {
    const dataView = new DataView(webp.buffer)

    // Check that the WEBP signature is present
    if (dataView.getUint32(0) !== 0x52494646 || dataView.getUint32(8) !== 0x57454250) {
        console.error('Not a valid WEBP file')
        // r()
        return null
    }

    // Start searching for chunks after the WEBP signature
    let offset = 12
    let txt_chunks: ExifData = {}
    // Loop through the chunks in the WEBP file
    while (offset < webp.length) {
        const chunk_length = dataView.getUint32(offset + 4, true)
        const chunk_type = String.fromCharCode(...webp.slice(offset, offset + 4))
        if (chunk_type === 'EXIF') {
            if (String.fromCharCode(...webp.slice(offset + 8, offset + 8 + 6)) == 'Exif\0\0') {
                offset += 6
            }
            let data = parseExifData(webp.slice(offset + 8, offset + 8 + chunk_length))
            for (var key in data) {
                var value = data[key]
                let index = value.indexOf(':')
                txt_chunks[value.slice(0, index)] = value.slice(index + 1)
            }
        }

        offset += 8 + chunk_length
    }

    return txt_chunks
}
