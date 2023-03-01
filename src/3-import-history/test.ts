import { saveJSONFile } from '../0-utils/saveTsFile.ts'
import { c } from './history-entry-as-code.ts'

console.log(c.toJSON())

saveJSONFile('./src/3-import-history/history-entry.out.json', c)
