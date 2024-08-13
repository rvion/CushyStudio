import { describe, expect, it } from 'bun:test'
import { toJS } from 'mobx'

import { simpleBuilder as b } from '../../index'
import { expectJSON } from '../../model/TESTS/utils/expectJSON'

describe('FieldList', () => {
    const S1 = b.string({ default: '🔵' }).list({ defaultLength: 3 })
    const S123 = b.string({ default: '🔵' }).list()

    describe('tupples', () => {
        it('works', () => {
            // S.SList<S.SString | S.SNumber>
            const S2 = b.list({
                min: 2,
                element: (x) => {
                    if (x % 2 === 0) return b.int()
                    return b.string()
                },
            })
            const a = S2.create()
            expect(a.length).toBe(2)
            expectJSON(a.value).toEqual([0, ''])

            a.setValue([1, 2])
            expectJSON(a.value).toEqual([1, '2'])
        })
    })

    // INSTANCIATION -------------------
    describe('instanciation', () => {
        it('works without default', () => {
            //
            const E1 = S123.create()
            expectJSON(E1.value).toEqual([])
        })

        it('works WITH default', () => {
            const E1 = S1.create()
            expectJSON(E1.value).toEqual(['🔵', '🔵', '🔵'])
            expectJSON(E1.serial).toMatchObject({
                // prettier-ignore
                items_: [
                    { value: '🔵' },
                    { value: '🔵' },
                    { value: '🔵' },
                ],
            })
        })
    })

    // SET SERIAL ----------------------
    describe('setSerial', () => {
        it('works', () => {
            const E1 = S1.create()
            expectJSON(E1.value).toEqual(['🔵', '🔵', '🔵'])
            expect(E1.length).toBe(3)

            const serial = {
                $: 'list' as const,
                items_: [
                    { $: 'str' as const, value: '🔵' },
                    { $: 'str' as const, value: '🟢' },
                ],
            }

            E1.setSerial(serial)
            expect(E1.serial === serial).toBe(false)
            expect(E1.length).toBe(2)
            expectJSON(E1.value).toEqual(['🔵', '🟢'])
            expect(toJS(E1.serial)).toMatchObject(serial)
        })
    })

    describe('setValue', () => {
        it('works', () => {
            const E1 = S1.create()
            expectJSON(E1.value).toEqual(['🔵', '🔵', '🔵'])
            expect(E1.length).toBe(3)

            E1.value = ['🔵', '🟢']
            expect(E1.length).toBe(2)

            expectJSON(E1.value).toEqual(['🔵', '🟢'])
            expect(toJS(E1.serial)).toMatchObject({
                $: 'list' as const,
                items_: [
                    { $: 'str' as const, value: '🔵' },
                    { $: 'str' as const, value: '🟢' },
                ],
            })
        })

        it('updates the serial without creating a new one', () => {
            const E1 = S1.create()
            const oldSerial = E1.serial
            expect(oldSerial.items_.length).toBe(3)

            E1.value = ['🔵', '🟢']

            expect(oldSerial.items_.length).toBe(2)
            expect(toJS(oldSerial)).toMatchObject({
                $: 'list' as const,
                items_: [
                    { $: 'str' as const, value: '🔵' },
                    { $: 'str' as const, value: '🟢' },
                ],
            })
        })
    })

    // STRUCTURAL SHARING --------------
    it('generate a new serial for each field', () => {
        const E1 = S1.create()
        const E2 = S1.create(E1.serial)

        // same shape
        expect(E1.items.length).toBe(3)
        expect(E1.serial).toEqual(E2.serial)
        expect(E1.at(1)!.serial).toEqual(E2.at(1)!.serial)

        // different refs
        expect(E1.serial === E2.serial).toBe(false)
        expect(E1.at(1)!.serial === E2.at(1)!.serial).toBe(false)
    })

    // EFFECTS -------------------------
    it('doesnt apply serial effect nor value effect on instanciation ', () => {
        // 🔴 TODO
    })

    describe('value proxy', () => {
        it('is mutable', () => {
            const S2 = b.int({ default: 3 }).list({ defaultLength: 1 })
            const a = S2.create()
            expect(a.length).toBe(1)
            expectJSON(a.value).toEqual([3])

            a.value[0] = 8

            expect(a.length).toBe(1)
            expectJSON(a.value).toEqual([8])
        })

        it('can ADD/PUSH/POP/SPLICE/... items at the end/start/middle/...', () => {
            const S2 = b.int({ default: 3 }).list({ defaultLength: 1 })
            const a = S2.create()
            expectJSON(a.value).toEqual([3])

            a.value[1] = 8
            expectJSON(a.value).toEqual([3, 8])

            a.value.push(9)
            expectJSON(a.value).toEqual([3, 8, 9])

            a.value.pop()
            expectJSON(a.value).toEqual([3, 8])

            a.value.unshift(4)
            expectJSON(a.value).toEqual([4, 3, 8])

            a.value.shift()
            expectJSON(a.value).toEqual([3, 8])
        })

        it('can .removeAllItems()', () => {
            const S2 = b.int({ default: 3 }).list({ min: 3 })
            const a = S2.create()
            expectJSON(a.value).toEqual([3, 3, 3])

            a.value.push(8)
            a.value.push(8)
            expectJSON(a.value).toEqual([3, 3, 3, 8, 8])

            a.removeAllItems()
            expectJSON(a.value).toEqual([3, 3, 3])
        })

        describe('map', () => {
            it('should map items', () => {
                const S2 = b.int({ default: 3 }).list({ min: 3 })
                const a = S2.create()
                expectJSON(a.value).toEqual([3, 3, 3])
                const r = a.value.map((x) => x + 1)

                expect(r).toEqual([4, 4, 4])
            })
        })
    })

    // RESET ---------------------------
    it('field.reset() should always yield same serial as schema.create(null) except for updatedAt', () => {
        const S2 = b.int({ default: 3 }).list({ min: 3 })
        const a1 = S2.create()
        expect(a1.length).toBe(3)

        // set value then reset
        const a2 = S2.create()
        a2.value[3] = 8
        expectJSON(a2.value).toEqual([3, 3, 3, 8])
        expect(a2.length).toBe(4)

        // reset
        a2.reset()
        expect(a2.length).toBe(3)

        // should be same serial since we reset
        expect(toJS(a2.serial)).toMatchObject(toJS(a1.serial))
        // expect(toJS(a1.serial)).toEqual(toJS(a2.serial))
    })
})
