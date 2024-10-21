import type { Field_number_serial } from './FieldNumber'

import { describe, expect, expect as expect_, it, type Matchers } from 'bun:test'
import { produce } from 'immer'
import { observable, reaction, toJS } from 'mobx'

import { simpleBuilder } from '../../simple/SimpleFactory'
import { getUIDForMemoryStructure } from '../../utils/getUIDForMemoryStructure'

const b = simpleBuilder

// ------------------------------------------------------------------------------
describe('field number', () => {
    it('abc', () => {
        const x = { a: 1, b: 2 }

        // deleting non-existent property PRESERVE ref equality
        const y1 = produce(x, (draft) => void delete (draft as any).xxxx)
        expect(y1 === x).toBeTrue()

        // assigning SAME value PRESERVE ref equality
        const y2 = produce(x, (draft) => void (draft.b = 2))
        expect(y2 === x).toBeTrue()

        // assigning DIFFERENT value CHANGES ref equality
        const y3 = produce(x, (draft) => void (draft.b = 8))
        expect(y3 === x).toBeFalse()

        // deleting EXISTING property CHANGES ref equality
        const y4 = produce(x, (draft) => void delete (draft as any).b)
        expect(y4 === x).toBeFalse()
    })

    it('works', () => {
        // // /* 😂 */ console.log(`[🤠] ${getUIDForMemoryStructure(serial)} (test; serial creation)`)
        const serial: Field_number_serial = { $: 'number', value: 8 }
        const schema = b.number({ default: 5 })
        const document = schema.create(serial)
        expect(document.value).toBe(8)
        expect(document.serial === serial).toBeTrue()

        document.value = 8
        expect(document.value).toBe(8)
        expect(document.serial === serial).toBeTrue()
        // TODO: check we don't emit any change events

        document.value = 9
        expect(document.serial === serial).toBeFalse()
    })

    it('works within group', () => {
        const schema = b.fields({ num: b.number({ default: 5 }) })
        const serial: S.SGroup<{ num: S.SNumber }>['$Serial'] = {
            $: 'group',
            values_: { num: { $: 'number', value: 8 } },
        }

        const document = schema.create(serial)
        expect(document.value.num).toBe(8)
        expect(document.serial === serial).toBeTrue()

        expect(document._acknowledgeCount).toBe(0)
        document.value.num = 8
        expect(document.value.num).toBe(8)
        expect(document.serial === serial).toBeTrue()
        expect(document._acknowledgeCount).toBe(0)

        document.value.num = 9
        expect(document.value.num).toBe(9)
        expect(document.serial === serial).toBeFalse()
        expect(document._acknowledgeCount).toBe(1)

        // test things are properly mutable
        let x = 0
        reaction(
            () => document.value.num,
            (v) => void x++,
        )
        expect(x).toBe(0)
        document.value.num++
        expect(x).toBe(1)
        document.value.num++
        expect(x).toBe(2)
        document.value.num++
        expect(x).toBe(3)
        document.value.num++
        expect(x).toBe(4)
    })
})
