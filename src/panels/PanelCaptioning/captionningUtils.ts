import fs from 'fs'
import path from 'path'

export function updateActiveDirectory(dirPath: string): Array<string> {
   return fs
      .readdirSync(dirPath, { withFileTypes: true })
      .filter((file) => {
         const ext = path.extname(file.name).toLowerCase()
         return ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'].includes(ext)
      })
      .map((val) => {
         return val.name
      })
}

export function updateActiveCaption(path: string): Array<string> {
   if (!fs.existsSync(path)) {
      return []
   }

   return fs.readFileSync(path, 'utf-8').split('\n')
}

export function renameFile(oldName: string, newName: string): void {
   if (!fs.existsSync(oldName)) {
      return
   }

   fs.renameSync(oldName, newName)
}
