import { Bench } from 'tinybench'

import { simpleBuilder } from '../SimpleFactory'

// #region test case
const b = simpleBuilder
const makeDoc = (): any => {
    return b.fields({
        a: b.string(),
        b: b.string(),
        arr: b
            .fields({
                x: b.string(),
                y: b.int(),
            })
            .list({ min: 2 }),
    })
}
// #region benchark
const bench = new Bench({ time: 1000 })
const schema1 = makeDoc().withConfig({
    instanciationOption: {
        skipMobx: true,
        skipMobxAutoBind: true,
    },
})
const schema2 = makeDoc()

bench
    .add('faster task', () => {
        schema1.create()
    })
    .add('slower task', () => {
        schema2.create()
    })
    .todo('unimplemented bench')

await bench.warmup() // make results more reliable, ref: https://github.com/tinylibs/tinybench/pull/50
await bench.run()

// show results
console.table(bench.table())

export const x = 0
