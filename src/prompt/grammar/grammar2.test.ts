import { describe, expect, it } from 'bun:test'

import { PromptAST } from './grammar.practical'

// prettier-ignore
const options__ = [
   'test',
   '"option2, yes"',
   '"The quick brown fox jumped over the lazy dog"'
]
const test1 = `<choice(1):test "option2, yes" "The quick brown fox jumped over the lazy dog">`
const test1Parsed = `\
Prompt: 
  Choice: "<choice(1):test "option2, yes" "The quick brown fox jumped over the lazy dog">"
    Number: "1"
    Identifier: "test"
    String: ""option2, yes""
    String: ""The quick brown fox jumped over the lazy dog""\
`

const expr = new PromptAST(test1)
console.log(expr.toString())
describe('prompt grammar', () => {
   it('parse', () => {
      expect(expr.toString()).toBe(test1Parsed)
   })

   it('Choices', () => {
      const entries = expr.findAll('Choice')
      expect(entries).toHaveLength(1)
      expect(entries[0]!.value).toBe(options__[1]!)
      // expect(entries[0]!.pickRandomly()).toBe('test')
      // const matches = expr.findAll('Lora')
      // expect(matches.length).toBe(2)
      // expect(matches[0]!.name).toBe('a' as any)
      // expect(matches[0]!.strength_clip).toBe(1)
      // expect(matches[1]!.name).toBe('test' as any)
      // expect(matches[1]!.strength_clip).toBe(3)
   })
})
