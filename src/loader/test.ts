import { writeFileSync } from 'fs'
import { demo } from './entry'

console.log(demo.toJSON())

writeFileSync('./src/loader/entry.out.json', JSON.stringify(demo, null, 4))
