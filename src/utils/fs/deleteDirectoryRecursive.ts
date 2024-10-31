import * as fs from 'fs'

export function deleteDirectoryRecursive(path: string): void {
   if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach((file, index) => {
         const curPath = `${path}/${file}`
         if (fs.lstatSync(curPath).isDirectory()) {
            // recurse
            deleteDirectoryRecursive(curPath)
         } else {
            // delete file
            fs.unlinkSync(curPath)
         }
      })
      fs.rmdirSync(path)
   }
}
