import { describe, expect, it } from 'vitest'

import { CSchema } from '../csuite/model/CSchema'
import { SimpleBuilder } from '../csuite/simple/SimpleBuilder'
import { Field_prompt } from './FieldPrompt'

describe('FieldPrompt', () => {
   // 💬 2025-03-21 rvion: hacky way of testing the prompt
   const b = new (class SimpleBuilderWithPrompt extends SimpleBuilder {
      /** prompt, defaulting to '' */
      prompt(config: Field_prompt['Ҩconfig'] = {}): Z.Prompt {
         const def = config.default ?? ''
         return this.prompt_({ default: def, ...config })
      }

      prompt_(config: Field_prompt['Ҩconfig'] = {}): Z.Prompt {
         return CSchema.new<Field_prompt>(Field_prompt, config)
      }
   })()

   const S1 = b.fields(
      {
         a: b.string({ default: '🔵' }),
         b: b.number({ default: 1 }),
         c: b.choice({
            foo: b.string(),
            bar: b.prompt({ default: 'coucou' }),
         }),
      },
      {
         presets: [
            {
               label: 'test',
               apply({ ϟfields: fields }): void {
                  // V1
                  fields.c.enableBranch('bar')
                  fields.c._.bar?.setText('new prompt A')
                  // V2
                  fields.c.enableBranch('bar')?.setText('new prompt B')
               },
            },
         ],
      },
   )

   it('works', () => {
      const E1 = S1.create()
      expect(E1.ϟvalue.c.foo).toBe('')
      expect(E1.ϟvalue.c.bar).toBeUndefined()

      E1.ϟfields.c.enableBranch('bar')

      expect(E1.ϟvalue.c.foo).toBeUndefined()
      expect(E1.ϟvalue.c.bar?.text).toBe('coucou')

      E1.ϟfields.c._.bar?.setText('new prompt')

      expect(E1.ϟvalue.c.bar?.text).toBe('new prompt')
   })

   it('works too', () => {
      const E1 = S1.create()
      expect(E1.ϟvalue.c.foo).toBe('')
      expect(E1.ϟvalue.c.bar).toBeUndefined()

      E1.ϟfields.c.enableBranch('bar')?.setText('new prompt')

      expect(E1.ϟvalue.c.bar?.text).toBe('new prompt')
   })
})
