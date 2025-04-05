import { describe, expect, it } from 'vitest'

import { PromptAST } from './grammar.practical'

// prettier-ignore
const options__ = [
   'test',
   'option2, yes',
   'The quick brown fox jumped over the lazy dog'
]
const testWildcard = `<choice(?):test "option2, yes" "The quick brown fox jumped over the lazy dog">`
const testWildcardParsed = `\
Prompt:
  Choice: "<choice(?):test "option2, yes" "The quick brown fox jumped over the lazy dog">"
    ChoiceWildCard: "?"
    Identifier: "test"
    String: ""option2, yes""
    String: ""The quick brown fox jumped over the lazy dog""\
`

const testNumber = `<choice(1):test "option2, yes" "The quick brown fox jumped over the lazy dog">`
const testNumberParsed = `\
Prompt:
  Choice: "<choice(1):test "option2, yes" "The quick brown fox jumped over the lazy dog">"
    Number: "1"
    Identifier: "test"
    String: ""option2, yes""
    String: ""The quick brown fox jumped over the lazy dog""\
`

const exprNumberSelection = new PromptAST(testNumber)
const exprWildcard = new PromptAST(testWildcard)
describe('prompt grammar', () => {
   it('Parse Number Selection', () => {
      console.log(exprNumberSelection.toString())
      expect(exprNumberSelection.toString()).toBe(testNumberParsed)
   })

   it('Pick from Index', () => {
      const entries = exprNumberSelection.findAll('Choice')
      expect(entries).toHaveLength(1)
      expect(entries[0]!.value).toBe(options__[1]!)
   })

   it('Parse Wildcard Selection', () => {
      console.log(exprWildcard.toString())
      expect(exprWildcard.toString()).toBe(testWildcardParsed)
   })

   it('Pick from Wildcard', () => {
      const entries = exprWildcard.findAll('Choice')
      expect(entries).toHaveLength(1)
      expect(options__).toContain(entries[0]!.value)
   })
})
