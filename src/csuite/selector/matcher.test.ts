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
root.ϟvalue.foo.test = ['a', 'b', 'c']
const foo = root.ϟfields.foo
const bar = root.ϟfields.foo.ϟfields.bar
const baz = root.ϟfields.foo.ϟfields.baz
const qux = root.ϟfields.qux
const test2nd = root.ϟfields.foo.ϟfields.test.items[1]!
root.foo.test.at(1)!.ϟvalue = 'test'

baz.ϟupdateFieldCustom((t) => ({ abcdefgh: true })) // makes @.custom.abcdefgh be true

describe('selector.match', () => {
   it('works with indexes', () => {
      expect(root.foo.test.at(1)?.ϟmatches('[1]')).toBeTruthy()
      expect(root.foo.test.ϟselect('[1]').map((i) => i.ϟvalue)).toEqual(['test'])
   })
   it('works', () => {
      const F = root.ϟfields.foo.ϟfields.bar
      expect(F.ϟpath).toBe('$.foo.bar')
      expect(F.ϟmatches('bar')).toBe(true)
      expect(F.ϟmatches('.bar')).toBe(true)
      expect(F.ϟmatches('$.foo.bar')).toBe(true)
      expect(F.ϟmatches('foo.')).toBe(true)
      expect(F.ϟmatches('foo')).toBe(false)

      expect(F.ϟmatches('$')).toBe(false)

      expect(F.ϟmatches('{bar|foo}')).toBe(true)
      expect(F.ϟmatches('{bar|bar}')).toBe(true)
      expect(F.ϟmatches('{quu|foo}')).toBe(false)
   })
})
describe('selector.select', () => {
   it('works with indexes', () => {
      expect(foo.ϟselectFirstOrNull('$.foo.test')?.ϟpath).toBeUndefined()
      expect(root.ϟselectFirstOrThrow<Field_string>('$.foo.test')?.ϟpath).toBe('$.foo.test')
      expect(root.ϟselectFirstOrThrow<Field_string>('$.foo.test[0]')?.ϟpath).toBe(
         `$.foo.test.${root.ϟfields.foo.ϟfields.test.at(0)?.ϟmountKey}`,
      )
      expect([1, 2, 3].at(-1)).toBe(3)
      expect(root.ϟselectFirstOrThrow<Field_string>('$.foo.test[-1]')?.ϟpath).toBe(
         `$.foo.test.${root.ϟfields.foo.ϟfields.test.at(2)?.ϟmountKey}`,
      )
   })
   it('test', () => {
      expect(root.ϟselect('>@list.@optional.@str').map((f) => f.ϟpath)).toMatchObject([
         expect.stringMatching(/\$\.foo\.test\.[a-z0-9_-]+\.child/i),
         expect.stringMatching(/\$\.foo\.test\.[a-z0-9_-]+\.child/i),
         expect.stringMatching(/\$\.foo\.test\.[a-z0-9_-]+\.child/i),
      ])
      expect(root.ϟselect('>@list.@optional.@str^^').map((f) => f.ϟpath)).toMatchObject(['$.foo.test'])
      expect(root.ϟselect('>@list.@optional.^^').map((f) => f.ϟpath)).toMatchObject([
         '$.foo.test',
         '$.foo.test2',
      ])
      expect(root.ϟselect('>@list.@optional^').map((f) => f.ϟpath)).toMatchObject([
         '$.foo.test',
         '$.foo.test2',
      ])
      expect(root.ϟselect('>@str^@optional^@list').map((f) => f.ϟpath)).toMatchObject(['$.foo.test'])
   })

   it('can filter entry-node', () => {
      expect(root.ϟcontains('?(@.childrenAll.length === 1)')).toBe(false)
      expect(root.ϟcontains('?(@.childrenAll.length === 2)')).toBe(true)
      expect(root.ϟselect('>@list?(@.length >3)')).toHaveLength(1)
      expect(root.ϟselect('>@list?(@.length >2)')).toHaveLength(2)
   })

   it('should select direct children with "." axis', () => {
      const selected = root.ϟselect('.').map((f) => f.ϟpath)
      expect(selected).toMatchObject(['$.foo', '$.qux'])
   })

   it('should correctly select children with a key containing `-` or `_`', () => {
      const schema = b.fields({
         'foo-bar': b.fields({
            baz_qux: b.string(),
         }),
      })
      const root = schema.create()

      const selected = root.ϟselect('$.foo-bar.baz_qux')

      expect(selected).toHaveLength(1)
   })

   it('match for both path and pathExt', () => {
      // path
      expect(root.ϟselect(foo.ϟpath)[0]).toBe(foo)
      expect(root.ϟselect(bar.ϟpath)[0]).toBe(bar)
      expect(root.ϟselect(baz.ϟpath)[0]).toBe(baz)
      expect(root.ϟselect(qux.ϟpath)[0]).toBe(qux)
      expect(root.ϟselect(test2nd.ϟpath)[0]).toBe(test2nd)
      // pathExt
      expect(root.ϟselect(foo.ϟpathExt)[0]).toBe(foo)
      expect(root.ϟselect(bar.ϟpathExt)[0]).toBe(bar)
      expect(root.ϟselect(baz.ϟpathExt)[0]).toBe(baz)
      expect(root.ϟselect(qux.ϟpathExt)[0]).toBe(qux)
      expect(root.ϟselect(test2nd.ϟpathExt)[0]).toBe(test2nd)
   })

   it('should select all descendants with ">" axis', () => {
      const selected = root.ϟselect('>').map((f) => f.ϟpath)
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
      expect(root.ϟselect('^.').map((f) => f.ϟpath)).toMatchObject([])
      expect(root.ϟselect('.^').map((f) => f.ϟpath)).toMatchObject(['$'])
   })

   it('should select all ancestors of a node with "<" axis', () => {
      const selected = root.ϟfields.foo.ϟfields.test2.items[0]!.ϟselect('<').map((f) => f.ϟpath)
      expect(selected).toMatchObject(['$.foo.test2', '$.foo', '$'])
   })

   it('should select root node with "$" axis', () => {
      const selected = root.ϟselect('$').map((f) => f.ϟpath)
      expect(selected).toMatchObject(['$'])
   })

   it('should select nodes with specific mountKey', () => {
      const selected = root.ϟselect('.foo').map((f) => f.ϟpath)
      expect(selected).toMatchObject(['$.foo'])
   })

   it('should select nodes with specific mountKey and type', () => {
      const selected = root.ϟselect('.foo@group').map((f) => f.ϟpath)
      expect(selected).toMatchObject(['$.foo'])
   })

   it('should not select nodes with incorrect type', () => {
      const selected = root.ϟselect('.foo@string').map((f) => f.ϟpath)
      expect(selected).toMatchObject([])
   })

   it('should select nodes based on expression filter', () => {
      const selected = root.ϟselect('.foo.bar?(node.value === "33")').map((f) => f.ϟpath)
      expect(selected).toMatchObject(['$.foo.bar'])
   })

   it('should select nodes with multiple filters connected by "|"', () => {
      const selected = root.ϟselect('.{foo|qux}').map((f) => f.ϟpath)
      expect(selected).toMatchObject(['$.foo', '$.qux'])
   })

   it('should handle complex expression filters with custom properties', () => {
      const selected = root.ϟselect('.foo.baz?(@.custom.abcdefgh === true)').map((f) => f.ϟpath)
      expect(selected).toMatchObject(['$.foo.baz'])
   })

   it('should select ancestor nodes based on child conditions', () => {
      const selected = root.ϟselect('.foo.baz<').map((f) => f.ϟpath)
      expect(selected).toMatchObject(['$.foo', '$'])
   })

   it('should handle selectors that do not match any nodes', () => {
      const selected = root.ϟselect('.nonexistent').map((f) => f.ϟpath)
      expect(selected).toMatchObject([])
   })

   it('should correctly use "contains" to verify node conditions', () => {
      expect(root.ϟcontains('?(@.childrenAll.length === 2)')).toBe(true)
      expect(root.ϟcontains('?(@.childrenAll.length === 1)')).toBe(false)
      expect(root.ϟcontains('.foo.baz?(@.custom.abcdefgh === true)')).toBe(true)
      expect(root.ϟcontains('.foo.baz?(@.custom.abcdefgh === false)')).toBe(false)
   })

   it('should match itself when selector is emtpy', () => {
      expect(root.ϟcontains('')).toBe(true)
      expect(root.ϟselect('')).toHaveLength(1)
      expect(root.ϟselect('')[0]).toBe(root)

      expect(foo.ϟcontains('')).toBe(true)
      expect(foo.ϟselect('')).toHaveLength(1)
      expect(foo.ϟselect('')[0]).toBe(foo)

      expect(foo.ϟmatches('')).toBe(true)
      expect(bar.ϟmatches('')).toBe(true)
      expect(root.ϟmatches('')).toBe(true)
   })
})
