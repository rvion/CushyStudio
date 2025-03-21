import { Bench } from 'tinybench'

import { simpleBuilder } from '../SimpleFactory'

// #region test case
const b = simpleBuilder
const makeDoc = (): Z.Record<{
   a: Z.String
   b: Z.String
   arr: Z.List<
      Z.Record<{
         x: Z.String
         y: Z.Number
      }>
   >
}> => {
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
      // skipMobx: true,
      // skipMobxAutoBind: true,
      altMobx: true,
   },
})
const schema2 = makeDoc()

bench
   .add('field (altMobx)', () => {
      schema1.create()
   })
   .add('field', () => {
      schema2.create()
   })
// .todo('unimplemented bench')

// await bench.warmup() // make results more reliable, ref: https://github.com/tinylibs/tinybench/pull/50
await bench.run()

// show results
console.table(bench.table())

export const x: 0 = 0
