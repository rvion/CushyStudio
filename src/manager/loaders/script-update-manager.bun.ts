import { ComfyManagerRepository } from '../ComfyManagerRepository'

const skipDL = process.argv.includes('--skip-download')

// should take care of the code generation
ComfyManagerRepository.DownloadAndUpdate(!skipDL)
