import { describe, expect, it } from 'bun:test'

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
   expect('')
})
