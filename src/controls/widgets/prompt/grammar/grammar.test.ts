import { exec, execSync } from 'child_process'
import { parser } from './grammar.parser'

console.log(parser.parse('one 2 "three"').toString())

const test1 = `@a[1]`
// (masterpiece, tree)x-0.8, (*color)x0.6 @"xl\pxll.safetensors"[.2,.8]`
const parse1 = parser.parse(test1)

parse1.iterate({
    enter(nodeType) {
        const icon =
            nodeType.name === 'Number' //
                ? '🔢'
                : nodeType.name === 'Lora'
                ? '🔵'
                : '  '
        console.log(`[${icon}] `, nodeType.name, nodeType.from, nodeType.to)
        // if () {
        //     console.log(`Error at position ${start}-${end}`)
        // }
    },
})

// console.log(`[👙]`, parse1)
// console.log(`[👙]`, parse1.toString())
