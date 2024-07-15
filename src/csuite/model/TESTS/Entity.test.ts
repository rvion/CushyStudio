import { describe, expect as expect_, it, type Matchers } from 'bun:test'
import { toJS } from 'mobx'

import { simpleFactory } from '../../index'

// ------------------------------------------------------------------------------
describe('basic', () => {
    describe('group', () => {
        it('works', () => {
            const ent = simpleFactory.entity((f) => f.fields({}))
            expect(ent).toBeTruthy()
            expect(ent.value).toMatchObject({})
        })
    })

    describe('markdown', () => {
        it('works', () => {
            const E = simpleFactory.entity((f) => f.fields({ md: f.markdown('ok') }))
            expect(E).toBeTruthy()
            expect(E.subFields.length).toBe(1)
            expect(E.subFields[0]!.type).toBe('markdown')
            expect(E.root.value.md).toEqual({ $: 'markdown' })
        })
    })

    describe('string', () => {
        it('works', () => {
            const E = simpleFactory.entity((f) => f.string())
            expect(E.value).toBe('')

            // set root value through entity.value setter
            E.value = 'super'
            expect(E.value).toBe('super')

            // set root value through entity.root.value setter
            E.root.value = 'super2'
            expect(E.value).toBe('super2')
            expect(E.root.value).toBe('super2')

            const E2 = simpleFactory.entity((f) => f.string({ default: 'ok' }))
            expect(E2.value).toBe('ok')
        })
    })

    describe('Size', () => {
        it('works', () => {
            const ent = simpleFactory.entity((f) => f.fields({ size: f.size() }))
            expect(ent).toBeTruthy()
            expect(ent.value).toMatchObject({})
            expect(ent.value.size).toMatchObject({
                $: 'size',
                width: 512,
                height: 512,
                aspectRatio: '1:1',
            })
        })
    })
})

function expect<T>(a: T): Matchers<any> {
    return expect_(toJS(a))
}
