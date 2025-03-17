import { describe, expect, it } from 'bun:test'

import { PromptAST } from './grammar.practical'

// (masterpiece, tree)x-0.8, (*color)x0.6 @"xl\pxll.safetensors"[.2,.8]`
// const test1 = `%posewildcard, <lora:abc:0.9>, (nsfw:1.3), (a,b,c), embedding:bad1, <lora:ab>, <lora:ab:-1>`
const test1 = `<choice:test "option2, yes" "The quick brown fox jumped over the lazy dog">`
const test1Parsed = `\
Prompt: 
  Choice: "<choice:test "option2, yes" "The quick brown fox jumped over the lazy dog">"
    ChoiceEntry: "test"
      Identifier: "test"
    ChoiceEntry: ""option2, yes""
      String: ""option2, yes""
    ChoiceEntry: ""The quick brown fox jumped over the lazy dog""
      String: ""The quick brown fox jumped over the lazy dog""\
`

const expr = new PromptAST(test1)
// console.log(expr.toString())
describe('prompt grammar', () => {
   it('parse', () => {
      expect(expr.toString()).toBe(test1Parsed)
   })

   it('find all Lora', () => {
      const entries = expr.findAll('Choice')
      expect(entries).toHaveLength(1)
      // expect(entries[0]!.pickRandomly()).toBe('test')
      // const matches = expr.findAll('Lora')
      // expect(matches.length).toBe(2)
      // expect(matches[0]!.name).toBe('a' as any)
      // expect(matches[0]!.strength_clip).toBe(1)
      // expect(matches[1]!.name).toBe('test' as any)
      // expect(matches[1]!.strength_clip).toBe(3)
   })
})
