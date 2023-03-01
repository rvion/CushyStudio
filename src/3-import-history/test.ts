import { saveJSONFile } from '../0-utils/saveTsFile.ts'
import { demo } from './history-entry-as-code.ts'

console.log(demo.toJSON())

saveJSONFile('./src/3-import-history/history-entry.out.json', demo)
