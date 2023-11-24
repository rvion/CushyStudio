import { writeFileSync } from 'fs'

const raw = await fetch('http://192.168.1.19:8199/object_info')
console.log(raw)
const result = await raw.json()
writeFileSync('schema/object_info.default.json', JSON.stringify(result, null, 4), 'utf8')
