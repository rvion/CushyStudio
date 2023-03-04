// ▶️ f5
// ▶️ y sample

import { writeFileSync } from 'fs'

const x = await fetch('http://192.168.1.19:8188/history', {}).then((x) => x.json())

const def = (Object.values(x)[0] as any).prompt[2]
writeFileSync('./src/compiler/entry.in.json', JSON.stringify(def, null, 4))
