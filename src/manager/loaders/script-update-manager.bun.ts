import chalk from 'chalk'

import { ComfyManagerRepository } from '../ComfyManagerRepository'

const skipDL = process.argv.includes('--skip-download')

console.clear()
console.log(chalk.bold.greenBright('UPDADING COMFY MANAGER JSONS'))
// should take care of the code generation
ComfyManagerRepository.DownloadAndUpdate(!skipDL)
