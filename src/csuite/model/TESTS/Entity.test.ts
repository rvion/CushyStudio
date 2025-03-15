import { toJS } from 'mobx'
import { type Assertion, describe, expect, it } from 'vitest'

import { simpleFactory } from '../../simple/SimpleFactory'

// ------------------------------------------------------------------------------
describe('basic', () => {
   describe('group', () => {
      it('works', () => {
         const ent = simpleFactory.document((f) => f.fields({}))
         expectToJS(ent).toBeTruthy()
         expectToJS(ent.value).toMatchObject({})
      })
   })

   describe('markdown', () => {
      it('works', () => {
         const E = simpleFactory.document((f) => f.fields({ md: f.markdown('ok') }))
         expectToJS(E).toBeTruthy()
         expectToJS(E.childrenAll.length).toBe(1)
         expectToJS(E.childrenAll[0]!.type).toBe('markdown')
         expectToJS((E.root.value as any).md).toEqual({ $: 'markdown' })
      })
   })

   describe('string', () => {
      it('works', () => {
         const E = simpleFactory.document((f) => f.string())
         expectToJS(E.value).toBe('')

         // set root value through entity.value setter
         E.value = 'super'
         expectToJS(E.value).toBe('super')

         // set root value through entity.root.value setter
         E.root.value = 'super2'
         expectToJS(E.value).toBe('super2')
         expectToJS(E.root.value).toBe('super2')

         const E2 = simpleFactory.document((f) => f.string({ default: 'ok' }))
         expectToJS(E2.value).toBe('ok')
      })
   })

   describe('Size', () => {
      it('works', () => {
         const ent = simpleFactory.document((f) => f.fields({ size: f.size() }))
         expectToJS(ent).toBeTruthy()
         expectToJS(ent.value).toMatchObject({})
         expectToJS(ent.value.size).toMatchObject({
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
