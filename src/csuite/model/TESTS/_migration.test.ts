import { describe, expect as expect_, it } from 'bun:test'

import { simpleBuilder as b } from '../../index'

// ------------------------------------------------------------------------------
describe('can recover when field becoming list ', () => {
    it('works with string', () => {
        // E1 works
        const S1: S.SString = b.string({ default: '🔵' })
        const E1 = S1.create()
        expect(E1.value).toBe('🔵')

        // set E1 value to '🟢'
        E1.value = '🟢'
        expect(E1.value).toBe('🟢')
        expect(E1.serial).toMatchObject({ root: { type: 'str', val: '🟢' } })

        // E2 is able to PRESERVE the '🟢' when schema has been wrapped into list
        const S2 = b.string().list()
        const E2 = S2.create(() => E1.serial)
        expect(E2.value).toMatchObject(['🟢'])
        expect(E2.serial).toMatchObject({ root: { type: 'list', items_: [{ type: 'str', val: '🟢' }] } })

        // E1 should still have the same value, despite its serial having been used to create E2
        expect(E1.serial).toMatchObject({ root: { type: 'str', val: '🟢' } })

        // E3 is able to PRESERVE the '🟢' when schema has been stripped into list
        const E3 = S1.create(() => E2.serial)
        expect(E3.serial).toMatchObject({ root: { type: 'str', val: '🟢' } })
    })
})

function expect(a: any) {
    return expect_(JSON.parse(JSON.stringify(a)))
}

export const x = 0
