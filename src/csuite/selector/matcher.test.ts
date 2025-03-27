// test/selectorCompiler.test.ts

import type { Field_string } from '../fields/string/FieldString'

import { describe, expect, it } from 'vitest'

import { simpleBuilder } from '../simple/SimpleFactory'

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
root.zValue.foo.test = ['a', 'b', 'c']
const foo = root.zFields.foo
const bar = root.zFields.foo.zFields.bar
const baz = root.zFields.foo.zFields.baz
const qux = root.zFields.qux
const test2nd = root.zFields.foo.zFields.test.items[1]!
root.foo.test.at(1)!.zValue = 'test'

baz.zUpdateFieldCustom((t) => ({ abcdefgh: true })) // makes @.custom.abcdefgh be true

describe('selector.match', () => {
   it('works with indexes', () => {
      expect(root.foo.test.at(1)?.zMatches('[1]')).toBeTruthy()
      expect(root.foo.test.zSelect('[1]').map((i) => i.zValue)).toEqual(['test'])
   })
   it('works', () => {
      const F = root.zFields.foo.zFields.bar
      expect(F.zPath).toBe('$.foo.bar')
      expect(F.zMatches('bar')).toBe(true)
      expect(F.zMatches('.bar')).toBe(true)
      expect(F.zMatches('$.foo.bar')).toBe(true)
      expect(F.zMatches('foo.')).toBe(true)
      expect(F.zMatches('foo')).toBe(false)

      expect(F.zMatches('$')).toBe(false)

      expect(F.zMatches('{bar|foo}')).toBe(true)
      expect(F.zMatches('{bar|bar}')).toBe(true)
      expect(F.zMatches('{quu|foo}')).toBe(false)
   })
})
describe('selector.select', () => {
   it('works with indexes', () => {
      expect(foo.zSelectFirstOrNull('$.foo.test')?.zPath).toBeUndefined()
      expect(root.zSelectFirstOrThrow<Field_string>('$.foo.test')?.zPath).toBe('$.foo.test')
      expect(root.zSelectFirstOrThrow<Field_string>('$.foo.test[0]')?.zPath).toBe(
         `$.foo.test.${root.zFields.foo.zFields.test.at(0)?.zMountKey}`,
      )
      expect([1, 2, 3].at(-1)).toBe(3)
      expect(root.zSelectFirstOrThrow<Field_string>('$.foo.test[-1]')?.zPath).toBe(
         `$.foo.test.${root.zFields.foo.zFields.test.at(2)?.zMountKey}`,
      )
   })
   it('test', () => {
      expect(root.zSelect('>@list.@optional.@str').map((f) => f.zPath)).toMatchObject([
         expect.stringMatching(/\$\.foo\.test\.[a-z0-9_-]+\.child/i),
         expect.stringMatching(/\$\.foo\.test\.[a-z0-9_-]+\.child/i),
         expect.stringMatching(/\$\.foo\.test\.[a-z0-9_-]+\.child/i),
      ])
      expect(root.zSelect('>@list.@optional.@str^^').map((f) => f.zPath)).toMatchObject(['$.foo.test'])
      expect(root.zSelect('>@list.@optional.^^').map((f) => f.zPath)).toMatchObject([
         '$.foo.test',
         '$.foo.test2',
      ])
      expect(root.zSelect('>@list.@optional^').map((f) => f.zPath)).toMatchObject([
         '$.foo.test',
         '$.foo.test2',
      ])
      expect(root.zSelect('>@str^@optional^@list').map((f) => f.zPath)).toMatchObject(['$.foo.test'])
   })

   it('can filter entry-node', () => {
      expect(root.zContains('?(@.childrenAll.length === 1)')).toBe(false)
      expect(root.zContains('?(@.childrenAll.length === 2)')).toBe(true)
      expect(root.zSelect('>@list?(@.length >3)')).toHaveLength(1)
      expect(root.zSelect('>@list?(@.length >2)')).toHaveLength(2)
   })

   it('should select direct children with "." axis', () => {
      const selected = root.zSelect('.').map((f) => f.zPath)
      expect(selected).toMatchObject(['$.foo', '$.qux'])
   })

   it('should correctly select children with a key containing `-` or `_`', () => {
      const schema = b.fields({
         'foo-bar': b.fields({
            baz_qux: b.string(),
         }),
      })
      const root = schema.create()

      const selected = root.zSelect('$.foo-bar.baz_qux')

      expect(selected).toHaveLength(1)
   })

   it('match for both path and pathExt', () => {
      // path
      expect(root.zSelect(foo.zPath)[0]).toBe(foo)
      expect(root.zSelect(bar.zPath)[0]).toBe(bar)
      expect(root.zSelect(baz.zPath)[0]).toBe(baz)
      expect(root.zSelect(qux.zPath)[0]).toBe(qux)
      expect(root.zSelect(test2nd.zPath)[0]).toBe(test2nd)
      // pathExt
      expect(root.zSelect(foo.zPathExt)[0]).toBe(foo)
      expect(root.zSelect(bar.zPathExt)[0]).toBe(bar)
      expect(root.zSelect(baz.zPathExt)[0]).toBe(baz)
      expect(root.zSelect(qux.zPathExt)[0]).toBe(qux)
      expect(root.zSelect(test2nd.zPathExt)[0]).toBe(test2nd)
   })

   it('should select all descendants with ">" axis', () => {
      const selected = root.zSelect('>').map((f) => f.zPath)
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
      expect(root.zSelect('^.').map((f) => f.zPath)).toMatchObject([])
      expect(root.zSelect('.^').map((f) => f.zPath)).toMatchObject(['$'])
   })

   it('should select all ancestors of a node with "<" axis', () => {
      const selected = root.zFields.foo.zFields.test2.items[0]!.zSelect('<').map((f) => f.zPath)
      expect(selected).toMatchObject(['$.foo.test2', '$.foo', '$'])
   })

   it('should select root node with "$" axis', () => {
      const selected = root.zSelect('$').map((f) => f.zPath)
      expect(selected).toMatchObject(['$'])
   })

   it('should select nodes with specific mountKey', () => {
      const selected = root.zSelect('.foo').map((f) => f.zPath)
      expect(selected).toMatchObject(['$.foo'])
   })

   it('should select nodes with specific mountKey and type', () => {
      const selected = root.zSelect('.foo@group').map((f) => f.zPath)
      expect(selected).toMatchObject(['$.foo'])
   })

   it('should not select nodes with incorrect type', () => {
      const selected = root.zSelect('.foo@string').map((f) => f.zPath)
      expect(selected).toMatchObject([])
   })

   it('should select nodes based on expression filter', () => {
      const selected = root.zSelect('.foo.bar?(node.value === "33")').map((f) => f.zPath)
      expect(selected).toMatchObject(['$.foo.bar'])
   })

   it('should select nodes with multiple filters connected by "|"', () => {
      const selected = root.zSelect('.{foo|qux}').map((f) => f.zPath)
      expect(selected).toMatchObject(['$.foo', '$.qux'])
   })

   it('should handle complex expression filters with custom properties', () => {
      const selected = root.zSelect('.foo.baz?(@.custom.abcdefgh === true)').map((f) => f.zPath)
      expect(selected).toMatchObject(['$.foo.baz'])
   })

   it('should select ancestor nodes based on child conditions', () => {
      const selected = root.zSelect('.foo.baz<').map((f) => f.zPath)
      expect(selected).toMatchObject(['$.foo', '$'])
   })

   it('should handle selectors that do not match any nodes', () => {
      const selected = root.zSelect('.nonexistent').map((f) => f.zPath)
      expect(selected).toMatchObject([])
   })

   it('should correctly use "contains" to verify node conditions', () => {
      expect(root.zContains('?(@.childrenAll.length === 2)')).toBe(true)
      expect(root.zContains('?(@.childrenAll.length === 1)')).toBe(false)
      expect(root.zContains('.foo.baz?(@.custom.abcdefgh === true)')).toBe(true)
      expect(root.zContains('.foo.baz?(@.custom.abcdefgh === false)')).toBe(false)
   })

   it('should match itself when selector is emtpy', () => {
      expect(root.zContains('')).toBe(true)
      expect(root.zSelect('')).toHaveLength(1)
      expect(root.zSelect('')[0]).toBe(root)

      expect(foo.zContains('')).toBe(true)
      expect(foo.zSelect('')).toHaveLength(1)
      expect(foo.zSelect('')[0]).toBe(foo)

      expect(foo.zMatches('')).toBe(true)
      expect(bar.zMatches('')).toBe(true)
      expect(root.zMatches('')).toBe(true)
   })
})
