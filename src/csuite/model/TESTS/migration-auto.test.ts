import { describe, expect as expect_, it } from 'bun:test'

import { simpleBuilder as b } from '../../index'
import { expectJSON } from './utils/expectJSON'

// ------------------------------------------------------------------------------
describe('auto-migration ', () => {
    it('can recover from/to lists', () => {
        // E1 works
        const S1: S.SString = b.string({ default: '🔵' })
        const E1 = S1.create()
        expectJSON(E1.value).toBe('🔵')

        // set E1 value to '🟢'
        E1.value = '🟢'
        expectJSON(E1.value).toBe('🟢')
        expectJSON(E1.serial).toMatchObject({ $: 'str', value: '🟢' })

        // construct E2 from E1 serial, but with schema wrapped into list
        const S2 = b.string().list()
        // @ts-expect-error
        const E2 = S2.create(E1.serial)

        // E2 should able to PRESERVE the '🟢' when schema has been wrapped into list
        expectJSON(E2.value).toMatchObject(['🟢'])
        expectJSON(E2.serial).toMatchObject({ $: 'list', items_: [{ $: 'str', value: '🟢' }] })

        // E1 should still have the same value, despite its serial having been used to create E2
        expectJSON(E1.serial).toMatchObject({ $: 'str', value: '🟢' })

        // construct E3 from E2 serial, but with schema back to simple string (not in list anymore)
        // @ts-expect-error
        const E3 = S1.create(E2.serial)

        // E3 is able to PRESERVE the '🟢' when schema has been stripped from list
        expectJSON(E3.serial).toMatchObject({ $: 'str', value: '🟢' })
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
        expectJSON(E1.value).toBe('🔵')

        // set E1 value to '🟢'
        E1.value = '🟢'
        expectJSON(E1.value).toBe('🟢')
        expectJSON(E1.serial).toMatchObject({ $: 'str', value: '🟢' })

        // construct E2 from E1 serial, but with schema wrapped into list
        const S2 = b.string().list()
        // @ts-expect-error
        const E2 = S2.create(E1.serial)

        // E2 should able to PRESERVE the '🟢' when schema has been wrapped into list
        expectJSON(E2.value).toMatchObject(['🟢'])
        E2.value[0] = '🔴'
        expectJSON(E2.serial).toMatchObject({ $: 'list', items_: [{ $: 'str', value: '🔴' }] })

        // E1 should still have the same value, despite its serial having been used to create E2
        expectJSON(E1.serial).toMatchObject({ $: 'str', value: '🟢' })

        // construct E3 from E2 serial, but with schema back to simple string (not in list anymore)
        // @ts-expect-error
        const E3 = S1.create(E2.serial)

        // E3 is able to PRESERVE the '🔴' when schema has been stripped from list
        expectJSON(E3.serial).toMatchObject({ $: 'str', value: '🔴' })
    })
})
