import { toJS } from 'mobx'
import { type Assertion, describe, expect, it } from 'vitest'

import { simpleFactory } from '../../simple/SimpleFactory'

// ------------------------------------------------------------------------------
describe('basic', () => {
   describe('group', () => {
      it('works', () => {
         const ent = simpleFactory.document((f) => f.fields({}))
         expectToJS(ent).toBeTruthy()
         expectToJS(ent.zValue).toMatchObject({})
      })
   })

   describe('markdown', () => {
      it('works', () => {
         const E = simpleFactory.document((f) => f.fields({ md: f.markdown('ok') }))
         expectToJS(E).toBeTruthy()
         expectToJS(E.zChildrenAll.length).toBe(1)
         expectToJS(E.zChildrenAll[0]!.zType).toBe('markdown')
         expectToJS((E.zRoot.zValue as any).md).toEqual({ $: 'markdown' })
      })
   })

   describe('string', () => {
      it('works', () => {
         const E = simpleFactory.document((f) => f.string())
         expectToJS(E.zValue).toBe('')

         // set root value through entity.value setter
         E.zValue = 'super'
         expectToJS(E.zValue).toBe('super')

         // set root value through entity.root.value setter
         E.zRoot.zValue = 'super2'
         expectToJS(E.zValue).toBe('super2')
         expectToJS(E.zRoot.zValue).toBe('super2')

         const E2 = simpleFactory.document((f) => f.string({ default: 'ok' }))
         expectToJS(E2.zValue).toBe('ok')
      })
   })

   describe('Size', () => {
      it('works', () => {
         const ent = simpleFactory.document((f) => f.fields({ size: f.size() }))
         expectToJS(ent).toBeTruthy()
         expectToJS(ent.zValue).toMatchObject({})
         expectToJS(ent.zValue.size).toMatchObject({
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
