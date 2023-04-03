import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'
import { sdkRewriteRules } from './sdkRewriteRules'

execSync(`tsc -p tsconfig.decl.json`, { stdio: 'inherit' })

const originalDefPath = 'dts/Comfy.d.ts'

const originalDefContent = readFileSync(originalDefPath, 'utf8')

const outPath = 'src/sdk/sdkTemplate.ts'
let out: string = originalDefContent
out = out.replace('/// <reference types="react" />', '')

for (const [from, to] of sdkRewriteRules) {
    out = out.replace(from, to)
}
out = `export const sdkTemplate: string = \`${out}\``

writeFileSync(outPath, out, 'utf8')
