import fs, { mkdirSync } from 'fs'
import https from 'https'
import { dirname } from 'pathe'
import { stdout } from 'process'

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
export function downloadFile(
   //
   url: string,
   outputPath: AbsolutePath | string,
   logPrefix = '  - ',
): Promise<true> {
   const baseDir = dirname(outputPath)
   mkdirSync(baseDir, { recursive: true })

   return new Promise<true>((resolve, reject) => {
      const request = https.get(url, (response) => {
         // initial response --------------------------------------------
         // Check for redirect
         if (response.statusCode === 302 || response.statusCode === 301) {
            // Follow the redirect and call downloadFile recursively
            const newUrl = response.headers.location!
            console.log(`Redirected to ${newUrl}`)
            resolve(downloadFile(newUrl, outputPath))
            return
         }

         if (response.statusCode !== 200) {
            reject(`Failed to download file: Status Code ${response.statusCode}`)
            return
         }

         // progress --------------------------------------------------
         const rawLen = response.headers['content-length']
         if (rawLen == null) {
            console.warn(
               `download file: progress not available because no content-length header in response.`,
            )
         } else {
            const totalSize = parseInt(rawLen, 10)
            let downloaded = 0
            let lastLoggedPercentage = 0

            response.on('data', (chunk) => {
               downloaded += chunk.length
               const percentage = Math.round((downloaded / totalSize) * 100)
               if (percentage >= lastLoggedPercentage + 1) {
                  // console.log(`${percentage}% downloaded`)
                  stdout.write(`\r${logPrefix}${percentage}% downloaded`)
                  lastLoggedPercentage = percentage
               }
            })
         }

         // file stream -------------------------------------------
         const fileStream = fs.createWriteStream(outputPath)
         response.pipe(fileStream)

         fileStream.on('finish', () => {
            console.log(` (DONE)`)
            fileStream.close()
            resolve(true)
         })
      })

      request.on('error', (err) => reject(err))
   })
}
