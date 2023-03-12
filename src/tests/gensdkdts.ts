import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'

execSync(`tsc -p tsconfig.decl.json`, { stdio: 'inherit' })
const originalDefPath = 'dts/Comfy.d.ts'
const originalDefContent = readFileSync(originalDefPath, 'utf8')
// console.log(originalDefContent)

const outPath = 'src/ui/samples/c.ts'
let out: string = originalDefContent
out = out.replace('/// <reference types="react" />', '')
out = `export const c__:string = \`${out}\``

writeFileSync(outPath, out, 'utf8')
