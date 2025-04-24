import { describe, expect, it } from 'vitest'

import { PromptAST } from '../grammar/grammar.practical'
import { compilePrompt } from './_compile'

describe('compilation', () => {
   it('simple compilation', () => {
      const FROM = '(masterpiece, tree)'
      const TO = ' (masterpiece:1.1)(,:1.1) (tree:1.1)'
      // -------------------
      const p = compilePrompt({
         text: FROM,
         onLora: () => {},
         ctx: { getLoraAssociatedTriggerWords: () => '', wildcards: {} },
      })
      expect(p.promptIncludingBreaks).toBe(TO)
   })
   describe('Wildcard', () => {
      it('Select using Index', () => {
         expect(
            compilePrompt({
               text: '?test[0]',
               onLora: () => {},
               ctx: { getLoraAssociatedTriggerWords: () => '', wildcards: { test: ['a', 'b', 'c'] } },
            }).promptIncludingBreaks,
         ).toBe(' a')
      })

      it('Select Random using Index', () => {
         const text = '?test[?]'
         const wildcardAST = new PromptAST(text)
         const wildcardNode = wildcardAST.findAll('Wildcard')[0]
         const options = ['a', 'b', 'c']
         const wildIndex = wildcardNode?.index

         // expect(entries).toHaveLength(1)
         expect(options).toContain(options[wildIndex ?? Math.floor(Math.random() * options.length)])
      })
      it('Select Random no Index', () => {
         const text = '?test'
         const wildcardAST = new PromptAST(text)
         const wildcardNode = wildcardAST.findAll('Wildcard')[0]
         const options = ['a', 'b', 'c']
         const wildIndex = wildcardNode?.index

         // expect(entries).toHaveLength(1)
         expect(options).toContain(options[wildIndex ?? Math.floor(Math.random() * options.length)])
      })
      describe('Inlined Wildcards', () => {
         it('Choice Selection', () => {
            const FROM = '(masterpiece, tree, ?>[3] {a b c "deez" e} :1.1)'
            const TO = ' (masterpiece:1.1)(,:1.1) (tree:1.1)(,:1.1) (deez:1.1)'
            // -------------------
            const p = compilePrompt({
               text: FROM,
               onLora: () => {},
               ctx: { getLoraAssociatedTriggerWords: () => '', wildcards: {} },
            })
            expect(p.promptIncludingBreaks).toBe(TO)
         })
      })
   })
})
