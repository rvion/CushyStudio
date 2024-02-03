import { exec, execSync } from 'child_process'
import { parser } from './grammar.parser'

console.log(parser.parse('one 2 "three"').toString())

const test1 = `test (car) defun`
const parse1 = parser.parse(test1)

parse1.iterate({
    enter(nodeType) {
        console.log(`[👙] `, nodeType.name, nodeType.from, nodeType.to)
        // if () {
        //     console.log(`Error at position ${start}-${end}`)
        // }
    },
})

// console.log(`[👙]`, parse1)
// console.log(`[👙]`, parse1.toString())
