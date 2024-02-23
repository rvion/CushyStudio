import { readdirSync, readFileSync, writeFileSync } from 'fs'

import { CodeBuffer } from 'src/utils/codegen/CodeBuffer'

const files = readdirSync('tmp/wildcards')
const names = files.map((y) => y.replace(/.ts/g, '').replace(/-/g, '_').replace(/.txt/g, ''))
const b1 = new CodeBuffer()
b1.w(`// FILE GENERATED: do not edit. Changes made manually will be overwritten.\n`)
b1.w(`export type Wildcards = {`)
for (const name of names) b1.w(`    "${name}": string[],`)
b1.w(`}`)

b1.w(`export const wildcards: Wildcards = {`)
// for (const name of names) b1.w(`    "${name}": string[],`)
// b1.w(`} = {`)
for (const x of files) {
    const name = x.replace(/.ts/g, '').replace(/-/g, '_').replace(/.txt/g, '')
    const file = readFileSync(`tmp/wildcards/${x}`, 'utf8')
    const lines = file.split(/\r?\n/)

    b1.w(`"${name}": ${JSON.stringify(lines)},`)
}
b1.w(`}`)
writeFileSync('src/embeds/wildcards.ts', b1.content, 'utf-8')
