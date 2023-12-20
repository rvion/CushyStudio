import https from 'https'
import fs from 'fs'

/** Usage example
 * | ;(async () => {
 * |     try {
 * |         await downloadFile('https://example.com/file', 'folder/filename')
 * |         console.log('Download completed successfully')
 * |     } catch (error) {
 * |         console.error('Download failed:', error)
 * |     }
 * | })()
 * |
 */
export function downloadFile(url: string, outputPath: AbsolutePath | string) {
    return new Promise<true>((resolve, reject) => {
        const request = https.get(url, (response) => {
            // initial response --------------------------------------------
            if (response.statusCode !== 200) {
                reject(`Failed to download file: Status Code ${response.statusCode}`)
                return
            }

            // progress --------------------------------------------------
            const rawLen = response.headers['content-length']
            if (rawLen == null) {
                console.warn(`download file: progress not available because no content-length header in response.`)
            } else {
                const totalSize = parseInt(rawLen, 10)
                let downloaded = 0
                let lastLoggedPercentage = 0

                response.on('data', (chunk) => {
                    downloaded += chunk.length
                    const percentage = Math.round((downloaded / totalSize) * 100)
                    if (percentage >= lastLoggedPercentage + 1) {
                        console.log(`${percentage}% downloaded`)
                        lastLoggedPercentage = percentage
                    }
                })
            }

            // file stream -------------------------------------------
            const fileStream = fs.createWriteStream(outputPath)
            response.pipe(fileStream)

            fileStream.on('finish', () => {
                fileStream.close()
                resolve(true)
            })
        })

        request.on('error', (err) => reject(err))
    })
}
