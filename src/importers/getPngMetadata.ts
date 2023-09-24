// import * as vscode from 'vscode'
import { resultFailure, Result, resultSuccess } from '../utils/Either'

// const showErrorMessage = vscode.window.showErrorMessage

export type TextChunks = {
    [key: string]: string
}

export function getPngMetadataFromFile(file: File): Promise<TextChunks> {
    return new Promise<TextChunks>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (event) => {
            // A. ensure we properly loaded the file
            const res = event.target?.result
            if (res == null) {
                // 🔴 showErrorMessage('no reader.onload have no result')
                return reject('file load error')
            }

            // B. ensure we don't have a string
            if (typeof res === 'string') {
                // 🔴 showErrorMessage('received a string instead of an array buffer')
                return reject('file load error')
            }

            // C. Get the PNG data as a Uint8Array
            const pngData = new Uint8Array(res)
            const result = getPngMetadata(pngData)
            if (result.type === 'failure') {
                // 🔴 showErrorMessage(result.value)
                return reject(result.value)
            }
            resolve(result.value)
        }

        reader.readAsArrayBuffer(file)
    })
}

export const getPngMetadata = (pngData: Uint8Array): Result<string, TextChunks> => {
    const dataView = new DataView(
        pngData.buffer,
        pngData.byteOffset, // <-- it just doesn't work without this
        pngData.byteLength, // <-- it just doesn't work without this
    )

    // console.log('🟢', dataView.getUint32(0))
    // console.log('🟢', dataView)

    // Check that the PNG signature is present
    if (dataView.getUint32(0) !== 0x89504e47) {
        // 🔴 showErrorMessage('Not a valid PNG file')
        return resultFailure('Not a valid PNG file')
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

    return resultSuccess(txt_chunks)
}
