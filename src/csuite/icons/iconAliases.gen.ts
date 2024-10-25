import { existsSync, readFileSync, writeFileSync } from 'fs'
import { camelCase } from 'tiny-case'

import { downloadFile } from '../../utils/fs/downloadFile'
import { formatSize } from '../utils/formatSize'

type Meta = {
   id: string // "CBFA6722-0EE6-49B4-B5C2-0B177A5523C2",
   baseIconId: string // "CBFA6722-0EE6-49B4-B5C2-0B177A5523C2",
   name: string // "ab-testing",
   codepoint: string // "F01C9",
   aliases: string[] //  [],
   tags: string[] //[ "Developer / Languages" ],
   styles: any[] // [],
   author: string // "Michael Richins",
   version: string // "4.0.96",
   deprecated: boolean // false,
}

const metaFile = 'tmp/icon-aliases.json'

const metaFileExists = existsSync(metaFile)
if (!metaFileExists) {
   console.log(`[💠] meta file does not exists, downloading...`)
   await downloadFile(
      //
      `https://github.com/Templarian/MaterialDesign-SVG/blob/master/meta.json`,
      metaFile,
   )
} else {
   console.log(`[💠] meta file exists`)
}

const json: Meta[] = JSON.parse(readFileSync(metaFile, 'utf-8'))

let out = `
export const iconAliases: {
    [key: string]: string[]
} = {
`

const norm = (iconName: string): string => {
   return camelCase(`mdi-${iconName}`)
}

// const allTags = new Set<string>()
for (const i of json) {
   if (i.deprecated) {
      console.log(`[💠] '${i.name}' is deprecated => skipping`)
      continue
   }
   if (i.aliases.length > 0) {
      const nameJS = norm(i.name)
      out += `    '${nameJS}': ${JSON.stringify(i.aliases)},\n`
      // out += `    '${i.name}': ${JSON.stringify(i.aliases)},\n`
   }
   // for (const t of i.tags) {
   //     allTags.add(t)
   // }
}

// console.log(`[🤠] tags`, allTags)

out += `
}
`

const outPath = 'src/csuite/icons/iconAliases.ts'
writeFileSync(outPath, out, 'utf-8')
console.log(`[🤠] `, formatSize(out.length))
console.log(`[🤠] result file is: `, outPath)
