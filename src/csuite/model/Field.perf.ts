import chalk from 'chalk'
import { Bench } from 'tinybench'

import { sb } from '../simple/SimpleFactory'

const SIMPLE = true
// #region test case
const b = sb
const makeDoc = ():
   | Z.Bool
   | Z.Record<{
        a: Z.String
        b: Z.String
        arr: Z.List<
           Z.Record<{
              x: Z.String
              y: Z.Number
           }>
        >
     }> =>
   SIMPLE
      ? b.bool()
      : b.fields({
           a: b.string(),
           b: b.string(),
           arr: b
              .fields({
                 x: b.string(),
                 y: b.int(),
              })
              .list({ min: 2 }),
        })

// #region benchark
const bench = new Bench({ time: 1000 })
const schema1 = makeDoc().withConfig({
   instanciationOption: { altMobx: true },
})
const schema2 = makeDoc()

const memUsage1: number[] = []
const memUsage2: number[] = []

bench
   .add('field (altMobx)', () => {
      const memBedfore = process.memoryUsage()
      /* for (let i = 0; i < 1000; i++) */ schema1.create()
      const memAfter = process.memoryUsage()
      const kb = (memAfter.heapUsed - memBedfore.heapUsed) / 1024
      memUsage1.push(Math.round(kb))
   })
   .add('field', () => {
      const memBedfore = process.memoryUsage()
      /* for (let i = 0; i < 1000; i++) */ schema2.create()
      const memAfter = process.memoryUsage()
      const kb = (memAfter.heapUsed - memBedfore.heapUsed) / 1024
      memUsage2.push(Math.round(kb))
   })
// .todo('unimplemented bench')

console.log(`[🤠] warmup`)
// await bench.warmupConcurrently()

// await bench.warmup() // make results more reliable, ref: https://github.com/tinylibs/tinybench/pull/50
console.log(`[🤠] run`)
// await bench.runConcurrently()

// show results
const table = bench.table()
console.table(table)

// #region MEMORY
const sample1 = memUsage1.filter((i) => i > 0).slice(0, 100)
const average1 = average(sample1)
console.log(`[🤠] Avg memory allocation`, average1, chalk.gray(`(${sample1.slice(0, 10).join(',')}...)`))
const sample2 = memUsage2.filter((i) => i > 0).slice(0, 100)
const average2 = average(sample2)
console.log(`[🤠] Avg memory allocation`, average2, chalk.gray(`(${sample2.slice(0, 10).join(',')}...)`))

function average(arr: number[]): number {
   return arr.reduce((a, b) => a + b, 0) / arr.length
}

// #region SPEEDUP
function getNum(entry: any): number { return parseInt(entry['ops/sec'].replaceAll(' ', ''), 10) } // prettier-ignore
// @ts-ignore
const speedupBetween0And1 = (getNum(table[0]) / getNum(table[1])).toFixed(1)
const memoryReductionBetween0And1 = (average2 / average1).toFixed(1)
console.log(`------------------------------------------------------------`)
console.log(`[🤠] speedup between 0 and 1: ${speedupBetween0And1}`)
console.log(`[🤠] memory reduction between 0 and 1: ${memoryReductionBetween0And1}`)
