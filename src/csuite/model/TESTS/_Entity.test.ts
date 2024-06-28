import { describe, expect as expect_, it } from 'bun:test'
import { toJS } from 'mobx'

import { SimpleModelManager } from '../../'

// ------------------------------------------------------------------------------
describe('publish', () => {
    it('works with string', () => {
        const E = SimpleModelManager.form((f) =>
            f.fields({
                a: f.string({ default: 'test' }).publish('foo', (self) => self.value),
                b: f.string().subscribe<string>('foo', (x, self) => (self.value = x)),
            }),
        )
        expect(E.value.a).toBe('test')
        expect(E.value.b).toBe('test')
    })

    it('works with ints', () => {
        const E = SimpleModelManager.form((f) =>
            f.fields({
                a: f.int({ default: 8 }).publish('foo', (self) => self.value),
                b: f.int({ default: 1 }).subscribe<number>('foo', (x, self) => (self.value = x)),
            }),
        )
        expect(E.value.a).toBe(8)
        expect(E.value.b).toBe(8)
    })

    it('works regardless field order definition', () => {
        const E = SimpleModelManager.form((f) =>
            f.fields({
                b: f.string({ default: '🟡' }).subscribe<string>('foo', (x, self) => (self.value = x)),
                a: f.string({ default: '🔵' }).publish('foo', (self) => self.value),
            }),
        )
        expect(E.value.a).toBe('🔵')
        expect(E.value.b).toBe('🔵')

        // bonus test before weekend
        E.fields.b.value = '🟤'
        expect(E.value.a).toBe('🔵')
        expect(E.value.b).toBe('🟤')

        E.fields.a.value = '🟠'
        expect(E.value.a).toBe('🟠')
        expect(E.value.b).toBe('🟠')
    })
})

// ------------------------------------------------------------------------------
describe('basic', () => {
    describe('group', () => {
        it('works', () => {
            const ent = SimpleModelManager.form((f) => f.fields({}))
            expect(ent).toBeTruthy()
            expect(ent.value).toMatchObject({})
        })
    })

    describe('markdown', () => {
        it('works', () => {
            const E = SimpleModelManager.form((f) => f.fields({ md: f.markdown('ok') }))
            expect(E).toBeTruthy()
            expect(E.subWidgets.length).toBe(1)
            expect(E.subWidgets[0]!.type).toBe('markdown')
            expect(E.root.value.md).toMatchObject({
                collapsed: undefined,
                type: 'markdown',
            })
        })
    })

    describe('string', () => {
        it('works', () => {
            const E = SimpleModelManager.form((f) => f.string())
            expect(E.value).toBe('')

            // set root value through entity.value setter
            E.value = 'super'
            expect(E.value).toBe('super')

            // set root value through entity.root.value setter
            E.root.value = 'super2'
            expect(E.value).toBe('super2')
            expect(E.root.value).toBe('super2')

            const E2 = SimpleModelManager.form((f) => f.string({ default: 'ok' }))
            expect(E2.value).toBe('ok')
        })
    })

    describe('Size', () => {
        it('works', () => {
            const ent = SimpleModelManager.form((f) => f.fields({ size: f.size() }))
            expect(ent).toBeTruthy()
            expect(ent.value).toMatchObject({})
            expect(ent.value.size).toMatchObject({
                type: 'size',
                width: 512,
                height: 512,
                aspectRatio: '1:1',
            })
        })
    })
})

function expect(a: any) {
    return expect_(toJS(a))
}
