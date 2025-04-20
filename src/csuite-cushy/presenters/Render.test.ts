import { describe, expect, it } from 'vitest'

import { Renderer } from './Renderer'

/*
I think there is a bug
the flattenRules must inherit the condition of beeing matched by the parent.
we cannot just flatten all rules, and include sub-rules that would match
even if the rule would have never been called.
*/
describe('renderer', () => {
   //
   const b = getBuilder()
   const schema = b.fields({
      a: b.string(),
      b: b.fields({
         x: b.number(),
         y: b.string(),
         kkk: b.fields({ t1: b.bool() }),
      }),
      c: b.fields({
         x: b.number(),
         kkk: b.fields({ t1: b.bool() }),
      }),
   })

   it('works with no rules', () => {
      const field = schema.create()
      const renderer = new Renderer(field)
      const out = renderer.renderTest(field)
      expect(out).toEqual([])
   })
   it('works with a rule', () => {
      const field = schema.create()
      const renderer = new Renderer(field)
      const out = renderer.renderTest(field, (s, set) => set('@str', { '∂1': 'yes' }))
      expect(out).toEqual([
         { at: '$.a', props: { '∂1': 'yes' } },
         { at: '$.b.y', props: { '∂1': 'yes' } },
      ])
   })

   it.only('works with a recursive rule', () => {
      const field = schema.create()
      const renderer = new Renderer(field)
      //not starting with '&' injects '>', so '.' => '>.'
      const subRule1 = Renderer.rule((s, set) => {
         set('*', { '∂2': '2' })
      })
      const subRule2 = Renderer.rule((s, set) => {
         set('&', { '∂2': 'coucou0' })
         set('&', { '∂3': 'coucou1' })
         set('&.', { '∂3': 'coucou2' })
      })
      const rule = Renderer.rule((s, set) => {
         set({ '∂3': '3' })
         set('b', { '∂1': '1', rules: subRule1 })
         set('c', { rules: subRule2 })
      })

      const xxx = Renderer.normalizeRule(field, rule)
      const rootUid = field.zUid
      expect(xxx).toHaveLength(7)
      expect(xxx).toEqual([
         { at: `#${rootUid}`, priority: 99, propsFlat: { '∂3': '3' } },
         { at: 'b', propsFlat: { rules: subRule1, '∂1': '1' } },
         { at: 'c', propsFlat: { rules: subRule2 } },
         { at: 'b>*', propsFlat: { '∂2': '2' } },
         { at: 'c', propsFlat: { '∂2': 'coucou0' } },
         { at: 'c', propsFlat: { '∂3': 'coucou1' } },
         { at: 'c.', propsFlat: { '∂3': 'coucou2' } },
      ])

      expect(field.c.kkk.t1.zMatches('c.')).toBeFalsy()
      expect(field.c.kkk.t1.zMatches('c..')).toBeTruthy()

      const out = renderer.renderTest(field, rule)
      expect(out).toEqual([
         //
         { at: '$', props: { '∂3': '3' } },
         { at: '$.b', props: { '∂1': '1' } },
         { at: '$.b.x', props: { '∂2': '2' } },
         { at: '$.b.y', props: { '∂2': '2' } },
         { at: '$.b.kkk', props: { '∂2': '2' } },
         { at: '$.b.kkk.t1', props: { '∂2': '2' } },
         {
            at: '$.c',
            props: {
               '∂2': 'coucou0',
               '∂3': 'coucou1',
            },
         },
         { at: '$.c.kkk', props: { '∂3': 'coucou2' } },
      ])
   })
   //    renderer.test()

   //
})
