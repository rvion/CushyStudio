import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'
import { sdkRewriteRules } from './sdkRewriteRules'
import { sdkStubDeps } from './sdkStubDeps'

execSync(`tsc -p tsconfig.decl.json`, { stdio: 'inherit' })
// execSync(`node src/sdk/tsc-wrapper.cjs`, { stdio: 'inherit' })
// tsc -p tsconfig.decl.json --listFiles --noEmit
const originalDefPath = 'dts/Comfy.d.ts'

const originalDefContent = readFileSync(originalDefPath, 'utf8')

const outPath = 'src/sdk/sdkTemplate.ts'
let out: string = originalDefContent
out = out.replace('/// <reference types="react" />', '')

for (const [from, to] of sdkRewriteRules) {
    out = out.replaceAll(from, to)
}
const ref = `/// <reference path="nodes.d.ts" />`
out = `export const sdkTemplate: string = \`${ref}\n${sdkStubDeps}\n${out}\``

writeFileSync(outPath, out, 'utf8')
