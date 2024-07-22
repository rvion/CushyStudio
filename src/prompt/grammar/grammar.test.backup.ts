import { parser } from './grammar.parser'

console.log(parser.parse('one 2 "three"').toString())

const test1 = `@a[1] (foo, bar)*1.2`
// (masterpiece, tree)x-0.8, (*color)x0.6 @"xl\pxll.safetensors"[.2,.8]`

const parse1 = parser.parse(test1)

let indent = -1
parse1.iterate({
    leave(nodeType) {
        indent--
    },
    enter(nodeType) {
        indent++
        const icon =
            nodeType.name === 'Number' //
                ? '🔢'
                : nodeType.name === 'Lora'
                  ? '🔵'
                  : '  '
        console.log(`[${icon}] `, new Array(indent).fill('   ').join('') + nodeType.name, nodeType.from, nodeType.to)
        // if () {
        //     console.log(`Error at position ${start}-${end}`)
        // }
    },
})

// console.log(`[🧐]`, parse1)
// console.log(`[🧐]`, parse1.toString())
