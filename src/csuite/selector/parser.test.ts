// test/parser.test.ts
// basically
// start ALWAYS from the element itself
// navigate upwards to the root (execute steps in reverse order)
// if :has() is encountered, execute the inner in natural order
// link must go away

import type { ParsedSelector } from './selector'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { FieldSelector } from './selector'

const spyOn = vi.spyOn

describe('SelectorParser Tests', () => {
   it('can parse not', () => {
      // prettier-ignore
      expect(FieldSelector.from('.foo!(.bar)').parse().steps).toEqual([
         { type: 'axis', axis: '.' },
         { type: 'mount', key: 'foo' },
         { type: 'not', child: [
            { type: 'axis', axis: '.' },
            { type: 'mount', key: 'bar' },
         ] },
      ])
   })
   it('can parse has', () => {
      // 1. check has child called super
      // 2. check is not => means yields no result
      //  check is bar
      // 3. retrieve all parents
      // 4.
      // prettier-ignore
      expect(FieldSelector.from('.foo>!(bar):has(.super)').parse().steps).toEqual([
         { type: 'axis', axis: '.' },
         { type: 'mount', key: 'foo' },
         { type: 'axis', axis: '>' },
         { type: 'not', child: [
            { type: 'mount', key: 'bar' },
         ] },
         { type: 'has', child: [
            { type: 'axis', axis: '.' },
            { type: 'mount', key: 'super' },
         ] },
      ])
   })
   it('can parse sequence indexes', () => {
      expect(FieldSelector.from('[0][-1][8_2]').parse().steps).toEqual([
         { type: 'index', index: 0 },
         { type: 'index', index: -1 },
         { type: 'index', index: 8_2 },
      ])
   })
   it('can parse sequence of axises', () => {
      expect(FieldSelector.from('...^^_test').parse().steps).toEqual([
         { type: 'axis', axis: '.' },
         { type: 'axis', axis: '.' },
         { type: 'axis', axis: '.' },
         { type: 'axis', axis: '^' },
         { type: 'axis', axis: '^' },
         { type: 'mount', key: '_test' },
      ])
   })

   it('should parse a single step with a single mountKey filter', () => {
      const parsed = FieldSelector.from('.foo').parse()
      expect(parsed.steps).toEqual([
         { type: 'axis', axis: '.' },
         { type: 'mount', key: 'foo' },
      ])
   })

   it('can parse selector starting with a filter', () => {
      const parsed = FieldSelector.from('bar.baz').parse()
      expect(parsed.steps).toEqual([
         { type: 'mount', key: 'bar' },
         { type: 'axis', axis: '.' },
         { type: 'mount', key: 'baz' },
      ])
   })

   it("should parse a single step with multiple mountKey filters connected by '|'", () => {
      const parsed = FieldSelector.from('{.foo|.bar|.baz}').parse()
      const expected: ParsedSelector['steps'] = [
         {
            type: 'branches',
            branches: [
               [
                  { type: 'axis', axis: '.' },
                  { type: 'mount', key: 'foo' },
               ],
               [
                  { type: 'axis', axis: '.' },
                  { type: 'mount', key: 'bar' },
               ],
               [
                  { type: 'axis', axis: '.' },
                  { type: 'mount', key: 'baz' },
               ],
            ],
         },
      ]

      expect(parsed.steps).toEqual(expected)
   })

   it("should parse a single step with multiple mountKey filters connected by '|' (part 2)", () => {
      const parsed = FieldSelector.from('.{foo|bar|baz}').parse()
      const expected: ParsedSelector = {
         steps: [
            { type: 'axis', axis: '.' },
            {
               type: 'branches',
               branches: [
                  //
                  [{ type: 'mount', key: 'foo' }],
                  [{ type: 'mount', key: 'bar' }],
                  [{ type: 'mount', key: 'baz' }],
               ],
            },
         ],
      }
      expect(parsed).toEqual(expected)
   })

   it("should parse a single step with mountKey and type filters connected by '|'", () => {
      const parsed = FieldSelector.from('.{foo@str|bar@number}').parse()
      const expected: ParsedSelector = {
         steps: [
            { type: 'axis', axis: '.' },
            {
               type: 'branches',
               branches: [
                  //
                  [
                     { type: 'mount', key: 'foo' },
                     { type: 'filterType', fieldType: 'str' },
                  ],
                  [
                     { type: 'mount', key: 'bar' },
                     { type: 'filterType', fieldType: 'number' },
                  ],
               ],
            },
         ],
      }
      expect(parsed).toEqual(expected)
   })

   it("should parse a single step with expression filters connected by '|'", () => {
      const parsed = FieldSelector.from(".{?( @.value === '33')|?( @.type === 'FieldGroup')}").parse()
      const expected: ParsedSelector = {
         steps: [
            { type: 'axis', axis: '.' },
            {
               branches: [
                  [{ filterCode: "( @.value === '33')", type: 'filterCode' }],
                  [{ filterCode: "( @.type === 'FieldGroup')", type: 'filterCode' }],
               ],
               type: 'branches',
            },
         ],
      }
      expect(parsed).toEqual(expected)
   })

   it('should parse multiple steps with different axes and filters', () => {
      const parsed = FieldSelector.from('.{foo|bar}@string^.baz?(@.active)').parse()
      const expected: ParsedSelector = {
         steps: [
            { type: 'axis', axis: '.' },
            {
               type: 'branches',
               branches: [[{ key: 'foo', type: 'mount' }], [{ key: 'bar', type: 'mount' }]],
            },
            { fieldType: 'string', type: 'filterType' },
            { type: 'axis', axis: '^' },
            { type: 'axis', axis: '.' },
            { key: 'baz', type: 'mount' },
            { filterCode: '(@.active)', type: 'filterCode' },
         ],
      }
      expect(parsed).toEqual(expected)
   })

   it("should parse a selector with all types of filters connected by '|'", () => {
      const parsed = FieldSelector.from(
         ".{foo|bar@string|?(@.value === '33')|?(@.type === 'FieldGroup')}",
      ).parse()
      const expected: ParsedSelector = {
         steps: [
            { type: 'axis', axis: '.' },
            {
               type: 'branches',
               branches: [
                  [{ type: 'mount', key: 'foo' }],
                  [
                     { type: 'mount', key: 'bar' },
                     { type: 'filterType', fieldType: 'string' },
                  ],
                  [{ filterCode: "(@.value === '33')", type: 'filterCode' }],
                  [{ filterCode: "(@.type === 'FieldGroup')", type: 'filterCode' }],
               ],
            },
         ],
      }
      expect(parsed).toEqual(expected)
   })

   describe('errors', () => {
      beforeEach(() => {
         spyOn(console, 'log').mockImplementation(() => undefined)
      })
      // eslint-disable-next-line vitest/no-commented-out-tests
      // it('should throw an error for invalid axis', () => {
      //     console.log(`[🤠] new SelectorParser('!invalidAxis.foo').parse()`, new SelectorParser('!invalidAxis.foo').parse() )
      //     expect(() => new SelectorParser('!invalidAxis.foo').parse()).toThrowError(/Invalid axis/)
      // })

      it('should throw an error for unbalanced parentheses in expression filter', () => {
         expect(() => FieldSelector.from(".xx?(@.value === '33'").parse()).toThrowError(
            /Unbalanced parentheses/,
         )
      })

      it('should throw an error for invalid type filter format', () => {
         expect(() => FieldSelector.from('.foo@').parse()).toThrowError(
            /Expected word at position 5 in selector ".foo@"/,
         )
      })
   })

   it('should handle filters without mountKey or nodeType but with expression', () => {
      const parsed = FieldSelector.from('.?( @.isActive )').parse()
      const expected: ParsedSelector = {
         steps: [
            {
               axis: '.',
               type: 'axis',
            },
            {
               filterCode: '( @.isActive )',
               type: 'filterCode',
            },
         ],
      }
      expect(parsed).toEqual(expected)
   })

   it('should handle complex selectors with multiple steps and multiple filters', () => {
      const selector = '$.{foo|bar@type}>?(@.active)<?(@.visible)'
      const parsed = FieldSelector.from(selector).parse()
      const expected: ParsedSelector = {
         steps: [
            { axis: '$', type: 'axis' },
            { axis: '.', type: 'axis' },
            {
               type: 'branches',
               branches: [
                  [{ type: 'mount', key: 'foo' }],
                  [
                     { type: 'mount', key: 'bar' },
                     { type: 'filterType', fieldType: 'type' },
                  ],
               ],
            },
            { type: 'axis', axis: '>' },
            { type: 'filterCode', filterCode: '(@.active)' },
            { type: 'axis', axis: '<' },
            { type: 'filterCode', filterCode: '(@.visible)' },
         ],
      }
      expect(parsed).toEqual(expected)
   })
})
