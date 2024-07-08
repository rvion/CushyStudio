import { describe, expect as expect_, it } from 'bun:test'

import { simpleBuilder as b } from '../../index'

// ------------------------------------------------------------------------------
describe('auto-migration ', () => {
    it('can recover from/to lists', () => {
        // E1 works
        const S1: S.SString = b.string({ default: '🔵' })
        const E1 = S1.create()
        expect(E1.value).toBe('🔵')

        // set E1 value to '🟢'
        E1.value = '🟢'
        expect(E1.value).toBe('🟢')
        expect(E1.serial).toMatchObject({ type: 'str', val: '🟢' })

        // construct E2 from E1 serial, but with schema wrapped into list
        const S2 = b.string().list()
        // @ts-expect-error
        const E2 = S2.create(E1.serial)

        // E2 should able to PRESERVE the '🟢' when schema has been wrapped into list
        expect(E2.value).toMatchObject(['🟢'])
        expect(E2.serial).toMatchObject({ type: 'list', items_: [{ type: 'str', val: '🟢' }] })

        // E1 should still have the same value, despite its serial having been used to create E2
        expect(E1.serial).toMatchObject({ type: 'str', val: '🟢' })

        // construct E3 from E2 serial, but with schema back to simple string (not in list anymore)
        // @ts-expect-error
        const E3 = S1.create(E2.serial)

        // E3 is able to PRESERVE the '🟢' when schema has been stripped from list
        expect(E3.serial).toMatchObject({ type: 'str', val: '🟢' })
    })

    // it('can recover from/to links', () => {
    //     expect(0).toBe(1)
    //     // 2024-07-02: TODO with GUI
    //     // see `src/csuite/simple/SimpleSchema.ts`, near the `AUTOMIGRATION` section
    // })

    it('can recover from/to lists + TEST PROXY SETTERS 🔥 ', () => {
        // E1 works
        const S1: S.SString = b.string({ default: '🔵' })
        const E1 = S1.create()
        expect(E1.value).toBe('🔵')

        // set E1 value to '🟢'
        E1.value = '🟢'
        expect(E1.value).toBe('🟢')
        expect(E1.serial).toMatchObject({ type: 'str', val: '🟢' })

        // construct E2 from E1 serial, but with schema wrapped into list
        const S2 = b.string().list()
        // @ts-expect-error
        const E2 = S2.create(E1.serial)

        // E2 should able to PRESERVE the '🟢' when schema has been wrapped into list
        expect(E2.value).toMatchObject(['🟢'])
        E2.value[0] = '🔴'
        expect(E2.serial).toMatchObject({ type: 'list', items_: [{ type: 'str', val: '🔴' }] })

        // E1 should still have the same value, despite its serial having been used to create E2
        expect(E1.serial).toMatchObject({ type: 'str', val: '🟢' })

        // construct E3 from E2 serial, but with schema back to simple string (not in list anymore)
        // @ts-expect-error
        const E3 = S1.create(E2.serial)

        // E3 is able to PRESERVE the '🔴' when schema has been stripped from list
        expect(E3.serial).toMatchObject({ type: 'str', val: '🔴' })
    })
})

function expect(a: any) {
    return expect_(JSON.parse(JSON.stringify(a)))
}
