import { writeFile } from 'fs'

export const writeFileAsync = async (path: string, data: string, fmt: 'utf-8') => {
   return new Promise<void>((resolve, reject) => {
      writeFile(path, data, fmt, (err) => {
         if (err) {
            reject(err)
         } else {
            resolve()
         }
      })
   })
}
