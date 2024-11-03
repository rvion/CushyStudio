import fs from 'fs'
import path from 'path'

export function getImagesInDirectory(dirPath: string): Array<string> {
   return fs
      .readdirSync(dirPath, { withFileTypes: true })
      .filter((file) => {
         const ext = path.extname(file.name).toLowerCase()
         return ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'].includes(ext)
      })
      .map((val) => val.name)
}

export function getCaptionsForImageAt(path: string): Array<string> {
   if (!fs.existsSync(path)) {
      console.log(`[🔴] no path for`, path)
      return []
   }
   return fs.readFileSync(path, 'utf-8').split('\n')
}

export function renameFile(oldName: string, newName: string): void {
   if (!fs.existsSync(oldName)) return
   fs.renameSync(oldName, newName)
}
