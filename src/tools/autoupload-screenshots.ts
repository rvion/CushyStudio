import chalk from 'chalk'
import { exec as exec_ } from 'child_process'
import { appendFileSync, existsSync, readFileSync, renameSync, statSync, watch } from 'fs'
import { join } from 'pathe'
import { promisify } from 'util'

import { hashArrayBuffer } from '../state/hashArrayBuffer'

const exec = promisify(exec_)

const logFile: string = join(__dirname, 'cushy-screenshots-logs.txt')
console.log(`[🧐] echo starting cushy screenshot manager!`)
const dir: "/Users/loco/S3-1" = '/Users/loco/S3-1'

console.log(`[🧐] every file pasted into ${dir} will be uploaded`)

const watcher = watch(
   dir,
   { recursive: true, persistent: true },
   async (
      //
      event,
      // e.g.
      // | bar.png
      // | foo/bar/baz.jpg
      // | foo/bar  (directory)
      _filename,
   ) => {
      if (_filename == null) return console.log(chalk.gray(`skipping null filename`))
      if (_filename.includes('_converted')) return
      if (event === 'change') return console.log(chalk.gray(`skipping change event for ${_filename}`))

      const filename = _filename
      const path = join(dir, filename)

      if (existsSync(path) === false) {
         return console.log(chalk.gray(`file deleted => skipping`))
      }

      const isDirectory = statSync(path).isDirectory()
      if (isDirectory) {
         return console.log(chalk.gray(`skipping directory ${filename}`))
      }

      console.log(`Detected ${event} in ${filename}`)
      if (filename.endsWith('.webp')) {
         return console.log(chalk.gray(`skipping webp file ${filename}`))
      }

      const ext = filename.split('.').pop()
      const hash = hashArrayBuffer(readFileSync(path))
      const fnameNoSpace = hash + '.' + ext
      const finalPath = join(dir, '_converted', fnameNoSpace)
      renameSync(path, finalPath)
      const s3Folder = `rvion`
      console.log(chalk.green(`uploading ${filename} to digitalocean...`))
      const uploadCommand = `rclone copy "${finalPath}" cushy-digitalocean-spaces:cushy/${s3Folder} --progress`
      // rclone sync /Users/loco/S3-1/old cushy-digitalocean-spaces:cushy/old --progress
      // https://cushy.fra1.cdn.digitaloceanspaces.com/old/screenshots/2023-09-29-22-40-45.png
      console.log(chalk.gray(`running: ${uploadCommand}`))
      const { stderr, stdout } = await exec(uploadCommand)
      console.log(`stderr: ${stderr}`)
      console.log(`stdout: ${stdout}`)
      // --------
      // const relPath = relative
      const url = `https://cushy.fra1.cdn.digitaloceanspaces.com/${s3Folder}/${fnameNoSpace}`
      console.log(`url: ${chalk.green(`"${url}"`)}`)
      appendFileSync(logFile, `${url}  ${_filename} \n`)
      await exec(`echo "${url}" | pbcopy`)
   },
)

// rclone copy  /Users/loco/S3-1/test1 cushy-digitalocean-spaces:cushy/test-2024-02-17 --progress
// rclone copy  /Users/loco/S3-1/ cushy-digitalocean-spaces:cushy/rvion-screenshots --progress

/*
setup:

-------
brew install rclone
brew install mozjpeg
mkdir -p ~/.config/rclone/
code ~/.config/rclone/rclone.conf

```
[cushy-digitalocean-spaces]
type = s3
provider = DigitalOcean
env_auth = false
access_key_id = DO00ZFX....
secret_access_key = .........
endpoint = fra1.digitaloceanspaces.com
acl = public-read

```

chmod 600 ~/.config/rclone/rclone.conf

-------
rclone listremotes
- cushy-digitalocean-spaces:

rclone lsd cushy-digitalocean-spaces:
rclone tree cushy-digitalocean-spaces:


upload to digitalocean spaces:
rclone copy /Users/loco/S3-1/ cushy-digitalocean-spaces:test/ --progress

sync local folder to remote space folder:
rclone sync /Users/loco/S3-1/ cushy-digitalocean-spaces:test/ --progress


https://github.com/skyzyx/homebrew-webp
brew install webp
brew install jpeg

*/

// ⏸️ if (
// ⏸️     // re-encode to webp
// ⏸️     filename.endsWith('.png') ||
// ⏸️     filename.endsWith('.jpg')
// ⏸️ ) {
// ⏸️     console.log(chalk.green(`converting ${filename} to webp...`))
// ⏸️     const fNameWebp =
// ⏸️         filename //
// ⏸️             .split('.')
// ⏸️             .slice(0, -1)
// ⏸️             .join('.')
// ⏸️             .replaceAll(' ', '-')
// ⏸️             .replaceAll('(', '')
// ⏸️             .replaceAll(')', '') + '.webp'
// ⏸️     const pathWebp = join(dir, fNameWebp)
// ⏸️     await exec(`cwebp -q 85 "${path}" -o "${pathWebp}"`)
// ⏸️     const oldSize = await exec(`du -sh "${path}"`)
// ⏸️     const newSize = await exec(`du -sh "${pathWebp}"`)
// ⏸️     console.log(`size: ${oldSize.stdout} => ${newSize.stdout}`)
// ⏸️     path = pathWebp
// ⏸️     filename = fNameWebp
// ⏸️ }

// ⏸️ if (
// ⏸️     // re-encode to webp
// ⏸️     filename.endsWith('.png') ||
// ⏸️     filename.endsWith('.jpg')
// ⏸️ ) {
// ⏸️     console.log(chalk.green(`converting ${filename} to jpg...`))
// ⏸️     const fNameJpeg =
// ⏸️         filename //
// ⏸️             .split('.')
// ⏸️             .slice(0, -1)
// ⏸️             .join('.')
// ⏸️             .replaceAll(' ', '-')
// ⏸️             .replaceAll('(', '')
// ⏸️             .replaceAll(')', '') + '.jpg'
// ⏸️     mkdirSync(join(dir, '_converted'), { recursive: true })
// ⏸️     const pathJpeg = join(dir, '_converted', fNameJpeg)
// ⏸️     await exec(`cjpeg -quality 85 -quant-table 2 -outfile "${pathJpeg}" "${path}"`)
// ⏸️     const oldSize = await exec(`du -sh "${path}"`)
// ⏸️     const newSize = await exec(`du -sh "${pathJpeg}"`)
// ⏸️     console.log(`size: ${oldSize.stdout} => ${newSize.stdout}`)
// ⏸️     path = pathJpeg
// ⏸️     filename = fNameJpeg
// ⏸️ }
