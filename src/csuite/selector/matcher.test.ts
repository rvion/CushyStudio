// test/selectorCompiler.test.ts

import { describe, expect, it } from 'bun:test'

import { expectJSON } from '../model/TESTS/utils/expectJSON'
import { simpleBuilder } from '../simple/SimpleFactory'
import { FieldSelector } from './selector'

function selector(str: string): FieldSelector {
    return new FieldSelector(str)
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
root.value.foo.test = ['a', 'b', 'c']
const foo = root.Foo
const bar = root.Foo.Bar
const baz = root.Foo.Baz
const qux = root.Qux
const test2nd = root.Foo.Test.items[1]!

baz.updateFieldCustom((t) => ({ abcdefgh: true })) // makes @.custom.abcdefgh be true

describe('SelectorCompiler Tests', () => {
    it('test', () => {
        expect(root.select('>@list.@optional.@str').map((f) => f.path)).toMatchObject([
            '$.foo.test.0.child',
            '$.foo.test.1.child',
            '$.foo.test.2.child',
        ])
        expect(root.select('>@list.@optional.@str^^').map((f) => f.path)).toMatchObject(['$.foo.test'])
        expect(root.select('>@list.@optional.^^').map((f) => f.path)).toMatchObject(['$.foo.test', '$.foo.test2'])
        expect(root.select('>@list.@optional^').map((f) => f.path)).toMatchObject(['$.foo.test', '$.foo.test2'])
        expect(root.select('>@str^@optional^@list').map((f) => f.path)).toMatchObject(['$.foo.test'])
    })

    it('can filter entry-node', () => {
        expect(root.contains('?(@.childrenAll.length === 1)')).toBe(false)
        expect(root.contains('?(@.childrenAll.length === 2)')).toBe(true)
        expect(root.select('>@list?(@.length >3)').length).toBe(1)
        expect(root.select('>@list?(@.length >2)').length).toBe(2)
    })

    it('should select direct children with "." axis', () => {
        const selected = root.select('.').map((f) => f.path)
        expect(selected).toMatchObject(['$.foo', '$.qux'])
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
            '$.foo.test.0',
            '$.foo.test.0.child',
            '$.foo.test.1',
            '$.foo.test.1.child',
            '$.foo.test.2',
            '$.foo.test.2.child',
            '$.foo.test2',
            '$.foo.test2.0',
            '$.foo.test2.0.child',
            '$.foo.test2.1',
            '$.foo.test2.1.child',
            '$.foo.test2.2',
            '$.foo.test2.2.child',
            '$.foo.test2.3',
            '$.foo.test2.3.child',
            '$.qux',
        ])
    })

    it('should abort at any step without children', () => {
        // abort after the ^
        expect(root.select('^.').map((f) => f.path)).toMatchObject([])
        expect(root.select('.^').map((f) => f.path)).toMatchObject(['$'])
    })

    it('should select all ancestors of a node with "<" axis', () => {
        const selected = root.Foo.Test2.items[0]!.select('<').map((f) => f.path)
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
})
