import chalk from 'chalk'
import * as X from 'child_process'
import { existsSync, watch } from 'fs'
import { join, relative } from 'pathe'
import { promisify } from 'util'

const exec = promisify(X.exec)

console.log(`[👙] echo starting cushy screenshot manager!`)
const dir = '/Users/loco/S3-1'

const watcher = watch(dir, { recursive: true, persistent: true }, async (event, _filename) => {
    if (_filename == null) {
        return console.log(chalk.gray(`skipping null filename`))
    }

    if (event === 'change') {
        return console.log(chalk.gray(`skipping change event for ${_filename}`))
    }

    let filename = _filename
    let path = join(dir, filename)

    if (existsSync(path) === false) {
        return console.log(chalk.gray(`file deleted => skipping`))
    }

    console.log(`Detected ${event} in ${filename}`)
    if (filename.endsWith('.webp')) {
        return console.log(chalk.gray(`skipping webp file ${filename}`))
    }

    if (
        // re-encode to webp
        filename.endsWith('.png') ||
        filename.endsWith('.jpg')
    ) {
        console.log(chalk.green(`converting ${filename} to webp...`))
        const fNameWebp =
            filename //
                .split('.')
                .slice(0, -1)
                .join('.')
                .replaceAll(' ', '-')
                .replaceAll('(', '')
                .replaceAll(')', '') + '.webp'
        const pathWebp = join(dir, fNameWebp)
        await exec(`cwebp -q 85 "${path}" -o "${pathWebp}"`)
        const oldSize = await exec(`du -sh "${path}"`)
        const newSize = await exec(`du -sh "${pathWebp}"`)
        console.log(`size: ${oldSize.stdout} => ${newSize.stdout}`)
        path = pathWebp
        filename = fNameWebp
    }

    const s3Folder = `rvion-screenshots`
    console.log(chalk.green(`uploading ${filename} to digitalocean...`))
    const uploadCommand = `rclone copy "${path}" cushy-digitalocean-spaces:cushy/${s3Folder} --progress`
    console.log(chalk.gray(`running: ${uploadCommand}`))
    const { stderr, stdout } = await exec(uploadCommand)
    console.log(`stderr: ${stderr}`)
    console.log(`stdout: ${stdout}`)

    // --------
    // const relPath = relative
    const url = `https://cushy.fra1.cdn.digitaloceanspaces.com/${s3Folder}/${filename}`
    console.log(`url: ${chalk.green(`"${url}"`)}`)
    await exec(`echo "${url}" | pbcopy`)
})

// rclone copy  /Users/loco/S3-1/test1 cushy-digitalocean-spaces:cushy/test-2024-02-17 --progress
// rclone copy  /Users/loco/S3-1/ cushy-digitalocean-spaces:cushy/rvion-screenshots --progress

/*
setup:

-------
brew install rclone
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

*/
