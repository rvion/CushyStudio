/** code copy-pasted from ComfyUI repo */

import type { ComfyClient } from './ComfyClient'

export type TextChunks = {
    [key: string]: string
}

export function getPngMetadata(client: ComfyClient, file: File): Promise<TextChunks> {
    return new Promise<TextChunks>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (event) => {
            // A. ensure we properly loaded the file
            const res = event.target?.result
            if (res == null) {
                client.notify('ERROR: no reader.onload have no result')
                return reject('file load error')
            }

            // B. ensure we don't have a string
            if (typeof res === 'string') {
                client.notify('ERROR: received a string instead of an array buffer')
                return reject('file load error')
            }

            // C. Get the PNG data as a Uint8Array
            const pngData = new Uint8Array(res)
            const dataView = new DataView(pngData.buffer)

            // Check that the PNG signature is present
            if (dataView.getUint32(0) !== 0x89504e47) {
                client.notify('Not a valid PNG file')
                return reject('Not a valid PNG file')
            }

            // Start searching for chunks after the PNG signature
            let offset = 8

            let txt_chunks: TextChunks = {}

            // Loop through the chunks in the PNG file
            while (offset < pngData.length) {
                // Get the length of the chunk
                const length = dataView.getUint32(offset)
                // Get the chunk type
                const type = String.fromCharCode(...pngData.slice(offset + 4, offset + 8))
                if (type === 'tEXt') {
                    // Get the keyword
                    let keyword_end = offset + 8
                    while (pngData[keyword_end] !== 0) {
                        keyword_end++
                    }
                    const keyword = String.fromCharCode(...pngData.slice(offset + 8, keyword_end))
                    // Get the text
                    const text = String.fromCharCode(...pngData.slice(keyword_end + 1, offset + 8 + length))
                    txt_chunks[keyword] = text
                }

                offset += 12 + length
            }

            resolve(txt_chunks)
        }

        reader.readAsArrayBuffer(file)
    })
}
