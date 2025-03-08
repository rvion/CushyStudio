import { describe, expect, it } from 'vitest'

import { locoSchemaBuilder, type LocoSchemaBuilder } from '../../../../front/form/LocoSchemaBuilder'
import { CSchema } from './CSchema'

// 💬 2025-02-17 rvion: this wasn't properly cached
export const ui_ticketPriority = (ui: LocoSchemaBuilder): Z.OneOf_<'Semaine' | 'Jour' | 'Mois'> =>
   ui.selectOneString(['Jour', 'Semaine', 'Mois'], { default: 'Semaine', label: 'Urgence' })

const b = locoSchemaBuilder
const getSchema = (): Z.Schema<any> => {
   return b.fields({
      foo: b.fields({
         arg: ui_ticketPriority(b),
         bar: b.string({ default: '33' }),
         baz: b.number({ default: 42 }),
         test: b.string().optional(true).list({ min: 3 }),
         test2: b.int().optional(true).list({ min: 4 }),
         xx: b
            .choices({
               a1: b.dateTimeZoned(),
               a2: b.datePlain(),
               a3: b.date(),
               a4: b.stringDate(),
               a5: b.stringDatetime(),
            })
            .optional()
            .list(),
      }),
      qux: b.string({ default: 'hello' }),
   })
}

describe('schema caching', () => {
   it('do not cause memory leak', () => {
      const t0 = Date.now()
      CSchema.CacheReset()
      const TOTAL = 2_000
      // const memoryAt0 = Math.round(process.memoryUsage().heapUsed / 1024)

      for (let i = 0; i < TOTAL; i++) b.string({ default: `hello-${i}` })
      expect(CSchema.Cache.size).toBe(CSchema.CacheBufferSize)
      expect(CSchema.CacheSeen).toBe(TOTAL)
      expect(CSchema.CacheHits).toBe(0)
      expect(CSchema.CacheMisses).toBe(TOTAL)
      // const memoryAt1 = Math.round(process.memoryUsage().heapUsed / 1024)

      const obj = { default: `hello-${TOTAL - 10}` }
      for (let i = 0; i < TOTAL; i++) b.string(obj)
      expect(CSchema.Cache.size).toBe(CSchema.CacheBufferSize)
      expect(CSchema.CacheSeen).toBe(TOTAL)
      expect(CSchema.CacheHits).toBe(TOTAL)
      expect(CSchema.CacheMisses).toBe(TOTAL)
      // const memoryAt2 = Math.round(process.memoryUsage().heapUsed / 1024)

      // console.log(`[🤠] step1 ${(memoryAt1 - memoryAt0).toString().padStart(8, ' ')}`)
      // console.log(`[🤠] step2 ${(memoryAt2 - memoryAt1).toString().padStart(8, ' ')}`)
      const t1 = Date.now()
      expect(t1 - t0).toBeLessThan(200 /* ~8ms on m1 */)
   })

   it('works too', () => {
      const S1 = ui_ticketPriority(b)
      const S2 = ui_ticketPriority(b)
      expect(S1).toBe(S2)
   })
   it('works', () => {
      const S1 = getSchema()
      expect(S1.codeForTypescriptValue()).toBe(`\
{
   foo: {
      arg /* Urgence */: Z.SelectOne<"Jour" | "Semaine" | "Mois">,
      bar: string,
      baz: number,
      test: Maybe<string>[],
      test2: Maybe<number>[],
      xx: Maybe<{
         a1?: Temporal.ZonedDateTime,
         a2?: Temporal.PlainDate,
         a3?: Date,
         a4?: Z.FL_string_date,
         a5?: Z.FL_string_datetime-local,
      }>[],
   },
   qux: string,
}`)

      const S2 = getSchema()
      // should be able to retrieve nested schema
      expect(S2.children.get(['foo', 'bar'])?.type).toBe('str')
      expect(S2.children.get(['foo', 'bar'])).toBe(S2.children.get(['foo', 'bar']))

      // should be able to retrive schema at specific index (required for tupples)
      expect(S2.children.get(['foo', 'test', '0', 'child'])?.type).toBe('str')

      // should be able to check that deepest string are properly equal
      // should be able to check that group are equal if all their child are
      expect(S2.children.get(['foo'])).toBe(S2.children.get(['foo']))
      expect(S2.children.get(['foo'])?.uid).toBe(S2.children.get(['foo'])?.uid)

      expect(S1).toBe(S2)
   })
})
