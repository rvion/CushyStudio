// you can run this file with f5 in vscode
import { writeFileSync } from 'fs'

const x = await fetch('http://192.168.1.19:8188/object_info', {}).then((x) => x.json())

writeFileSync('./src/core/nodes.json', JSON.stringify(x, null, 4))
