import type { Field_string_serial } from './FieldString'

import { describe, expect, it } from 'bun:test'

import { simpleBuilder } from '../../index'

const b = simpleBuilder

// ------------------------------------------------------------------------------
describe('field string', () => {
    it('preserves ref equality check when using setSerial', () => {
        const S = b.string({ default: 'abc' })
        const ser1: Field_string_serial = { $: 'str', value: 'ser 1' }
        const ser2: Field_string_serial = { $: 'str', value: 'ser 2', custom: { yolo: 12 } }

        const E = S.create(ser1)
        expect(E.serial === ser1).toBeTrue()

        E.setSerial(ser1)
        expect(E.serial === ser1).toBeTrue()
        expect(E.value).toEqual('ser 1')
        expect(E.serial === ser1).toBeTrue()
        expect(E.__version__).toBe(1)

        E.setSerial(ser2)
        expect(E.value).toEqual('ser 2')
        expect(E.serial.custom.yolo === 12).toBeTrue()
        expect(E.serial === ser2).toBeTrue()
        expect(E.__version__).toBe(2)

        E.setSerial(ser2)
        E.setSerial(ser2)
        E.setSerial(ser2)
        E.setSerial(ser2)
        expect(E.__version__).toBe(2)
    })
})
