import { toJS } from 'mobx'
import { type Assertion, describe, expect, it } from 'vitest'

import { simpleFactory } from '../../simple/SimpleFactory'

// ------------------------------------------------------------------------------
describe('basic', () => {
   describe('group', () => {
      it('works', () => {
         const ent = simpleFactory.document((f) => f.fields({}))
         expectToJS(ent).toBeTruthy()
         expectToJS(ent.ϟvalue).toMatchObject({})
      })
   })

   describe('markdown', () => {
      it('works', () => {
         const E = simpleFactory.document((f) => f.fields({ md: f.markdown('ok') }))
         expectToJS(E).toBeTruthy()
         expectToJS(E.ϟchildrenAll.length).toBe(1)
         expectToJS(E.ϟchildrenAll[0]!.ϟtype).toBe('markdown')
         expectToJS((E.ϟroot.ϟvalue as any).md).toEqual({ $: 'markdown' })
      })
   })

   describe('string', () => {
      it('works', () => {
         const E = simpleFactory.document((f) => f.string())
         expectToJS(E.ϟvalue).toBe('')

         // set root value through entity.value setter
         E.ϟvalue = 'super'
         expectToJS(E.ϟvalue).toBe('super')

         // set root value through entity.root.value setter
         E.ϟroot.ϟvalue = 'super2'
         expectToJS(E.ϟvalue).toBe('super2')
         expectToJS(E.ϟroot.ϟvalue).toBe('super2')

         const E2 = simpleFactory.document((f) => f.string({ default: 'ok' }))
         expectToJS(E2.ϟvalue).toBe('ok')
      })
   })

   describe('Size', () => {
      it('works', () => {
         const ent = simpleFactory.document((f) => f.fields({ size: f.size() }))
         expectToJS(ent).toBeTruthy()
         expectToJS(ent.ϟvalue).toMatchObject({})
         expectToJS(ent.ϟvalue.size).toMatchObject({
            $: 'size',
            width: 512,
            height: 512,
            aspectRatio: '1:1',
         })
      })
   })
})

function expectToJS<T>(a: T): Assertion<T> {
   // eslint-disable-next-line vitest/valid-expect
   return expect(toJS(a))
}
