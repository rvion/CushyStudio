// test/parser.test.ts

import type { ParsedSelector } from './selector'

import { describe, expect, it } from 'bun:test'

import { FieldSelector } from './selector'

describe('SelectorParser Tests', () => {
   it('can parse sequence of axises', () => {
      expect(new FieldSelector('...^^').parse().steps).toMatchObject([
         { type: 'axis', axis: '.' },
         { type: 'axis', axis: '.' },
         { type: 'axis', axis: '.' },
         { type: 'axis', axis: '^' },
         { type: 'axis', axis: '^' },
      ])
   })

   it('should parse a single step with a single mountKey filter', () => {
      const parsed = new FieldSelector('.foo').parse()
      expect(parsed.steps).toMatchObject([
         { type: 'axis', axis: '.' },
         { type: 'mount', key: 'foo' },
      ])
   })

   it('can parse selector starting with a filter', () => {
      const parsed = new FieldSelector('bar.baz').parse()
      expect(parsed.steps).toMatchObject([
         { type: 'mount', key: 'bar' },
         { type: 'axis', axis: '.' },
         { type: 'mount', key: 'baz' },
      ])
   })

   it("should parse a single step with multiple mountKey filters connected by '|'", () => {
      const parsed = new FieldSelector('{.foo|.bar|.baz}').parse()
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

      expect(parsed.steps).toMatchObject(expected)
   })

   it("should parse a single step with multiple mountKey filters connected by '|'", () => {
      const parsed = new FieldSelector('.{foo|bar|baz}').parse()
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
      expect(parsed).toMatchObject(expected)
   })

   it("should parse a single step with mountKey and type filters connected by '|'", () => {
      const parsed = new FieldSelector('.{foo@str|bar@number}').parse()
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
      expect(parsed).toMatchObject(expected)
   })

   it("should parse a single step with expression filters connected by '|'", () => {
      const parsed = new FieldSelector(".{?( @.value === '33')|?( @.type === 'FieldGroup')}").parse()
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
      expect(parsed).toMatchObject(expected)
   })

   it('should parse multiple steps with different axes and filters', () => {
      const parsed = new FieldSelector('.{foo|bar}@string^.baz?(@.active)').parse()
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
      expect(parsed).toMatchObject(expected)
   })

   it("should parse a selector with all types of filters connected by '|'", () => {
      const parsed = new FieldSelector(
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
      expect(parsed).toMatchObject(expected)
   })

   // it('should throw an error for invalid axis', () => {
   //     console.log(`[🤠] new SelectorParser('!invalidAxis.foo').parse()`, new SelectorParser('!invalidAxis.foo').parse() )
   //     expect(() => new SelectorParser('!invalidAxis.foo').parse()).toThrowError(/Invalid axis/)
   // })

   it('should throw an error for unbalanced parentheses in expression filter', () => {
      expect(() => new FieldSelector(".xx?(@.value === '33'").parse()).toThrowError(/Unbalanced parentheses/)
   })

   it('should throw an error for invalid type filter format', () => {
      expect(() => new FieldSelector('.foo@').parse()).toThrowError(
         /Expected word at position 5 in selector ".foo@"/,
      )
   })

   it('should handle filters without mountKey or nodeType but with expression', () => {
      const parsed = new FieldSelector('.?( @.isActive )').parse()
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
      expect(parsed).toMatchObject(expected)
   })

   it('should handle complex selectors with multiple steps and multiple filters', () => {
      const selector = '$.{foo|bar@type}>?(@.active)<?(@.visible)'
      const parsed = new FieldSelector(selector).parse()
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
      expect(parsed).toMatchObject(expected)
   })
})
