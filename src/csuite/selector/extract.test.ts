// test/selectorCompiler.test.ts

import { describe, expect, it } from 'vitest'

import { expectJSON } from '../model/TESTS/utils/expectJSON'
import { simpleBuilder } from '../simple/SimpleFactory'
import { FieldSelector } from './selector'

function selector(str: string): FieldSelector {
   return FieldSelector.from(str)
}

const b = simpleBuilder
const S1 = b.fields({
   foo: b.fields({
      bar: b.string({ default: '33' }),
      baz: b.number({ default: 42 }),
      test: b.string().optional(true).list({ min: 3 }),
      test2: b.int().optional(true).list({ min: 4 }),
   }),
   qux: b.string({ default: 'hello' }),
})
const root = S1.create()
root.ϟvalue.foo.test = ['a', 'b', 'c']
root.ϟvalue.foo.test2 = [1, 2, 3, 4]
const foo = root.ϟfields.foo
const bar = root.ϟfields.foo.ϟfields.bar
const baz = root.ϟfields.foo.ϟfields.baz
const qux = root.ϟfields.qux
const test2nd = root.ϟfields.foo.ϟfields.test.items[1]!

baz.ϟupdateFieldCustom((t) => ({ abcdefgh: true })) // makes @.custom.abcdefgh be true

describe('SelectorCompiler Tests', () => {
   it('properly reduces stuff', () => {
      expectJSON(root.ϟvalue).toMatchObject({
         foo: {
            bar: '33',
            baz: 42,
            test: ['a', 'b', 'c'],
            test2: [1, 2, 3, 4],
         },
         qux: 'hello',
      })

      const X = '>@str=(this.map(v=>v.value).join("-"))'
      expect(selector(X).parse()).toMatchObject({
         steps: [
            { type: 'axis', axis: '>' },
            { type: 'filterType', fieldType: 'str' },
            { type: 'collect' /* collectCode: '(this.map(v=>v.value).join("-"))' */ },
         ],
      })
      expect(root.ϟextractLastOrThrow(X)).toBe('33-a-b-c-hello')
      expect(root.ϟextractLastOrThrow('>@number=(this.reduce((r,a)=>r+a.value,0))')).toBe(52)
   })
})
