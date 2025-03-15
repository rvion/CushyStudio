import { describe, expect, it } from 'vitest'

const TRUE = Math.random() >= 0
describe('FieldPrompt', () => {
   // 🔴🔴🔴
   if (TRUE) return
   const { builder: b } = require('../controls/Builder') as typeof import('../controls/CushyBuilder')
   // 🔴🔴🔴

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
               apply({ fields }): void {
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

   describe('works', () => {
      it('works', () => {
         const E1 = S1.create()
         expect(E1.value.c.foo).toBe('')
         expect(E1.value.c.bar).toBe(undefined)

         E1.fields.c.enableBranch('bar')

         expect(E1.value.c.foo).toBe(undefined)
         expect(E1.value.c.bar?.text).toBe('coucou')

         E1.fields.c._.bar?.setText('new prompt')

         expect(E1.value.c.bar?.text).toBe('new prompt')
      })
   })

   describe('works too', () => {
      it('works', () => {
         const E1 = S1.create()
         expect(E1.value.c.foo).toBe('')
         expect(E1.value.c.bar).toBeUndefined()

         E1.fields.c.enableBranch('bar')?.setText('new prompt')

         expect(E1.value.c.bar?.text).toBe('new prompt')
      })
   })
})
