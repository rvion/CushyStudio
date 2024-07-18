import { describe, expect as expect_, it } from 'bun:test'
import { toJS } from 'mobx'

import { simpleFactory } from '../../index'

// ------------------------------------------------------------------------------
describe('publish', () => {
    it('works with string', () => {
        const E = simpleFactory.entity((f) =>
            f.fields({
                a: f.string({ default: 'test' }).publish('foo', (self) => self.value),
                b: f.string().subscribe<string>('foo', (x, self) => (self.value = x)),
            }),
        )
        expect(E.value.a).toBe('test')
        expect(E.value.b).toBe('test')
    })

    it('works with ints', () => {
        const E = simpleFactory.entity((f) =>
            f.fields({
                a: f.int({ default: 8 }).publish('foo', (self) => self.value),
                b: f.int({ default: 1 }).subscribe<number>('foo', (x, self) => (self.value = x)),
            }),
        )
        expect(E.value.a).toBe(8)
        expect(E.value.b).toBe(8)
    })

    it('works regardless field order definition', () => {
        const E = simpleFactory.entity((f) =>
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

function expect(a: any) {
    return expect_(toJS(a))
}
