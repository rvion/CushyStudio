import * as path from '@tauri-apps/api/path'
import * as fs from '@tauri-apps/api/fs'

export async function syncFile(diskPath: string, contents: string) {
    const folder = await path.dirname(diskPath)
    const folderExists = await fs.exists(folder)
    if (!folderExists) await fs.createDir(folder, { recursive: true })
    const prevExists = await fs.exists(diskPath)
    const prev = prevExists ? await fs.readTextFile(diskPath) : null
    if (prev != contents) await fs.writeFile({ path: diskPath, contents })
}
