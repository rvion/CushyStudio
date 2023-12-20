import { LogfileService } from 'logfile-service'

export const logger = new LogfileService({ tag: 'debug', utc: false })
