// test/selectorCompiler.test.ts

import type { Field_string } from '../fields/string/FieldString'

import { describe, expect, it } from 'vitest'

import { simpleBuilder } from '../simple/SimpleFactory'
import { FieldSelector } from './selector'

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
root.value.foo.test = ['a', 'b', 'c']
const foo = root._.foo
const bar = root._.foo._.bar
const baz = root._.foo._.baz
const qux = root._.qux
const test2nd = root._.foo._.test.items[1]!

baz.updateFieldCustom((t) => ({ abcdefgh: true })) // makes @.custom.abcdefgh be true

describe('SelectorCompiler Tests', () => {
   it('works with indexes', () => {
      expect(root.selectFirstOrThrow<Field_string>('$.foo.test')?.path).toBe('$.foo.test')
      expect(root.selectFirstOrThrow<Field_string>('$.foo.test[0]')?.path).toBe(
         `$.foo.test.${root._.foo._.test.at(0)?.mountKey}`,
      )
      expect([1, 2, 3].at(-1)).toBe(3)
      expect(root.selectFirstOrThrow<Field_string>('$.foo.test[-1]')?.path).toBe(
         `$.foo.test.${root._.foo._.test.at(2)?.mountKey}`,
      )
   })
   it('test', () => {
      expect(root.select('>@list.@optional.@str').map((f) => f.path)).toMatchObject([
         expect.stringMatching(/\$\.foo\.test\.[a-z0-9_-]+\.child/i),
         expect.stringMatching(/\$\.foo\.test\.[a-z0-9_-]+\.child/i),
         expect.stringMatching(/\$\.foo\.test\.[a-z0-9_-]+\.child/i),
      ])
      expect(root.select('>@list.@optional.@str^^').map((f) => f.path)).toMatchObject(['$.foo.test'])
      expect(root.select('>@list.@optional.^^').map((f) => f.path)).toMatchObject([
         '$.foo.test',
         '$.foo.test2',
      ])
      expect(root.select('>@list.@optional^').map((f) => f.path)).toMatchObject(['$.foo.test', '$.foo.test2'])
      expect(root.select('>@str^@optional^@list').map((f) => f.path)).toMatchObject(['$.foo.test'])
   })

   it('can filter entry-node', () => {
      expect(root.contains('?(@.childrenAll.length === 1)')).toBe(false)
      expect(root.contains('?(@.childrenAll.length === 2)')).toBe(true)
      expect(root.select('>@list?(@.length >3)')).toHaveLength(1)
      expect(root.select('>@list?(@.length >2)')).toHaveLength(2)
   })

   it('should select direct children with "." axis', () => {
      const selected = root.select('.').map((f) => f.path)
      expect(selected).toMatchObject(['$.foo', '$.qux'])
   })

   it('should correctly select children with a key containing `-` or `_`', () => {
      const schema = b.fields({
         'foo-bar': b.fields({
            baz_qux: b.string(),
         }),
      })
      const root = schema.create()

      const selected = root.select('$.foo-bar.baz_qux')

      expect(selected).toHaveLength(1)
   })

   it('match for both path and pathExt', () => {
      // path
      expect(root.select(foo.path)[0]).toBe(foo)
      expect(root.select(bar.path)[0]).toBe(bar)
      expect(root.select(baz.path)[0]).toBe(baz)
      expect(root.select(qux.path)[0]).toBe(qux)
      expect(root.select(test2nd.path)[0]).toBe(test2nd)
      // pathExt
      expect(root.select(foo.pathExt)[0]).toBe(foo)
      expect(root.select(bar.pathExt)[0]).toBe(bar)
      expect(root.select(baz.pathExt)[0]).toBe(baz)
      expect(root.select(qux.pathExt)[0]).toBe(qux)
      expect(root.select(test2nd.pathExt)[0]).toBe(test2nd)
   })

   it('should select all descendants with ">" axis', () => {
      const selected = root.select('>').map((f) => f.path)
      expect(selected).toMatchObject([
         '$.foo',
         '$.foo.bar',
         '$.foo.baz',
         '$.foo.test',
         expect.stringMatching(/\$\.foo\.test\.[0-9a-z_-]+$/i),
         expect.stringMatching(/\$\.foo\.test\.[0-9a-z_-]+\.child$/i),
         expect.stringMatching(/\$\.foo\.test\.[0-9a-z_-]+$/i),
         expect.stringMatching(/\$\.foo\.test\.[0-9a-z_-]+\.child$/i),
         expect.stringMatching(/\$\.foo\.test\.[0-9a-z_-]+$/i),
         expect.stringMatching(/\$\.foo\.test\.[0-9a-z_-]+\.child$/i),
         '$.foo.test2',
         expect.stringMatching(/\$\.foo\.test2\.[0-9a-z_-]+$/i),
         expect.stringMatching(/\$\.foo\.test2\.[0-9a-z_-]+\.child$/i),
         expect.stringMatching(/\$\.foo\.test2\.[0-9a-z_-]+$/i),
         expect.stringMatching(/\$\.foo\.test2\.[0-9a-z_-]+\.child$/i),
         expect.stringMatching(/\$\.foo\.test2\.[0-9a-z_-]+$/i),
         expect.stringMatching(/\$\.foo\.test2\.[0-9a-z_-]+\.child$/i),
         expect.stringMatching(/\$\.foo\.test2\.[0-9a-z_-]+$/i),
         expect.stringMatching(/\$\.foo\.test2\.[0-9a-z_-]+\.child$/i),
         '$.qux',
      ])
   })

   it('should abort at any step without children', () => {
      // abort after the ^
      expect(root.select('^.').map((f) => f.path)).toMatchObject([])
      expect(root.select('.^').map((f) => f.path)).toMatchObject(['$'])
   })

   it('should select all ancestors of a node with "<" axis', () => {
      const selected = root._.foo._.test2.items[0]!.select('<').map((f) => f.path)
      expect(selected).toMatchObject(['$.foo.test2', '$.foo', '$'])
   })

   it('should select root node with "$" axis', () => {
      const selected = root.select('$').map((f) => f.path)
      expect(selected).toMatchObject(['$'])
   })

   it('should select nodes with specific mountKey', () => {
      const selected = root.select('.foo').map((f) => f.path)
      expect(selected).toMatchObject(['$.foo'])
   })

   it('should select nodes with specific mountKey and type', () => {
      const selected = root.select('.foo@group').map((f) => f.path)
      expect(selected).toMatchObject(['$.foo'])
   })

   it('should not select nodes with incorrect type', () => {
      const selected = root.select('.foo@string').map((f) => f.path)
      expect(selected).toMatchObject([])
   })

   it('should select nodes based on expression filter', () => {
      const selected = root.select('.foo.bar?(node.value === "33")').map((f) => f.path)
      expect(selected).toMatchObject(['$.foo.bar'])
   })

   it('should select nodes with multiple filters connected by "|"', () => {
      const selected = root.select('.{foo|qux}').map((f) => f.path)
      expect(selected).toMatchObject(['$.foo', '$.qux'])
   })

   it('should handle complex expression filters with custom properties', () => {
      const selected = root.select('.foo.baz?(@.custom.abcdefgh === true)').map((f) => f.path)
      expect(selected).toMatchObject(['$.foo.baz'])
   })

   it('should select ancestor nodes based on child conditions', () => {
      const selected = root.select('.foo.baz<').map((f) => f.path)
      expect(selected).toMatchObject(['$.foo', '$'])
   })

   it('should handle selectors that do not match any nodes', () => {
      const selected = root.select('.nonexistent').map((f) => f.path)
      expect(selected).toMatchObject([])
   })

   it('should correctly use "contains" to verify node conditions', () => {
      expect(root.contains('?(@.childrenAll.length === 2)')).toBe(true)
      expect(root.contains('?(@.childrenAll.length === 1)')).toBe(false)
      expect(root.contains('.foo.baz?(@.custom.abcdefgh === true)')).toBe(true)
      expect(root.contains('.foo.baz?(@.custom.abcdefgh === false)')).toBe(false)
   })

   it('should match itself when selector is emtpy', () => {
      expect(root.contains('')).toBe(true)
      expect(root.select('')).toHaveLength(1)
      expect(root.select('')[0]).toBe(root)

      expect(foo.contains('')).toBe(true)
      expect(foo.select('')).toHaveLength(1)
      expect(foo.select('')[0]).toBe(foo)

      expect(foo.matches('')).toBe(true)
      expect(bar.matches('')).toBe(true)
      expect(root.matches('')).toBe(true)
   })
})
