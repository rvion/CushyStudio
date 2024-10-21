import { describe, expect, it } from 'bun:test'

import { simpleBuilder } from '../../index'
import { expectJSON } from '../../model/TESTS/utils/expectJSON'

const b = simpleBuilder

// ------------------------------------------------------------------------------
describe('FieldSelectOne', () => {
    it('works', () => {
        const S = b.selectOneString(['a', 'b', 'c'], { default: undefined })
        const E = S.create()

        expect(E.isSet).toBeFalse()
        expectJSON(E.value_unchecked).toBeUndefined()

        E.value = 'a'
        expectJSON(E.value).toEqual('a')

        E.value = 'b'
        expectJSON(E.value).toEqual('b')
    })

    it('works with defaults', () => {
        const S = b.selectOneString(['a', 'b', 'c'], { default: 'a' })
        const E = S.create()

        expectJSON(E.value).toEqual('a')
    })

    it('works with legacy serials', () => {
        const S = b.selectOneString(['a', 'b', 'c'])
        const serial = { $: 'selectOne', val: { id: 'b' } }
        // @ts-expect-error: legacy serial injection
        const E = S.create(serial)

        expectJSON(E.value).toEqual('b')
    })

    it('can be created and set from a serial', () => {
        const S = b.selectOneString(['a', 'b', 'c'], { default: 'b' })
        const ser1: (typeof S)['$Serial'] = { $: 'selectOne', val: 'c' }
        const ser2: (typeof S)['$Serial'] = { $: 'selectOne', val: 'a' }
        const E = S.create(ser1)

        expectJSON(E.value).toEqual('c')
        expect(E.serial === ser1).toBeTrue()

        E.setSerial(ser2)
        expectJSON(E.value).toEqual('a')
        expect(E.serial === ser2).toBeTrue()

        E.setSerial({ $: 'selectOne' })
        expectJSON(E.value).toEqual('b')
    })
})
