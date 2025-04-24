/* eslint-disable vitest/expect-expect */
import { describe, expect, it } from 'vitest'

import { PromptAST } from './grammar.practical'

function expectPrompt(txt: string, match: string, value?: any) {
   const prompt = new PromptAST(txt)
   const promptStrRaw = prompt.toString()
   const promptStr = promptStrRaw.replaceAll(/ +\n/g, '\n')
   const matchWithoutGutter = match.replaceAll(/ +\|/g, '').trimEnd()
   expect(promptStr).toBe(matchWithoutGutter)
   if (value) expect((prompt as any)?.value).toEqual(value)
}

describe('prompt grammar', () => {
   describe('choices', () => {
      it('works', () => {
         expectPrompt(
            `?>"test"[1] { test "option2, yes" "The quick brown fox jumped over the lazy dog" }`,
            `Prompt:
            |  Choice: "?>"test"[1] { test "option2, yes" "The quick brown fox jumped over the lazy dog" }"
            |    String: ""test""
            |    Index: "[1]"
            |    Permutations: "{ test "option2, yes" "The quick brown fox jumped over the lazy dog" }"
            |      Content:
            |        Identifier: "test"
            |        String: ""option2, yes""
            |        String: ""The quick brown fox jumped over the lazy dog""
            `,
         )
      })
      it('works too without spaces', () => {
         expectPrompt(
            `?>cars[?]{A "B, C" "D"}`,
            `Prompt:
            |  Choice: "?>cars[?]{A "B, C" "D"}"
            |    Identifier: "cars"
            |    Index: "[?]"
            |    Permutations: "{A "B, C" "D"}"
            |      Content:
            |        Identifier: "A"
            |        String: ""B, C""
            |        String: ""D""
            `,
         )
      })
      it('works without identifier', () => {
         expectPrompt(
            `?>[?]{A}`,
            `Prompt:
            |  Choice: "?>[?]{A}"
            |    Index: "[?]"
            |    Permutations: "{A}"
            |      Content:
            |        Identifier: "A"
            `,
         )
      })
   })

   it('Pick from random', () => {
      const _ = new PromptAST(`?>cars[?]{A "B, C" "D"}`)
      const entries = _.findAll('Choice')
      expect(entries).toHaveLength(1)
      expect(entries[0]!.value).toBeOneOf(['A', 'B, C', 'D'])
   })
   it('Pick at 1', () => {
      const _ = new PromptAST(`?>cars[1]{A "B, C" "D"}`)
      const entries = _.findAll('Choice')
      expect(entries).toHaveLength(1)
      expect(entries[0]!.value).toBe('B, C')
   })
   it('Pick at 0', () => {
      const _ = new PromptAST(`?>cars[0]{A "B, C" "D"}`)
      const entries = _.findAll('Choice')
      expect(entries).toHaveLength(1)
      expect(entries[0]!.value).toBe('A')
   })

   it('works without name', () => {
      const _ = new PromptAST(`?>[3]{a b c "deez" e}`)
      const entries = _.findAll('Choice')
      expect(entries).toHaveLength(1)
      expect(entries[0]!.value).toBe('deez')
   })
})
