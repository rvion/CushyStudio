import { describe, expect, it } from 'bun:test'
import { toJS } from 'mobx'

import { simpleBuilder as b } from '../../index'

describe('FieldChoices', () => {
    const Multi = b
        .choices({
            foo: b.string({ default: 'yo' }),
            bar: b.int().list({ defaultLength: 3 }),
            baz: b.string(),
        })
        .withConfig({ default: 'baz' })

    const Single = b.choice(
        {
            foo: b.string({ default: 'yo' }),
            bar: b.int().list({ defaultLength: 3 }),
            baz: b.string(),
        },
        { default: 'baz' },
    )

    // INSTANCIATION -------------------
    describe('instanciation', () => {
        it('works without default - Multi', () => {
            const MultiNoDefault = b.choices({
                foo: b.string({ default: 'yo' }),
                bar: b.int().list({ defaultLength: 3 }),
                baz: b.string(),
            })
            const E2 = MultiNoDefault.create()
            expectJSON(E2.value).toEqual({})
        })
        it('works without default - Single', () => {
            const SingleNoDefault = b.choice({
                foo: b.string({ default: 'yo' }),
                bar: b.int().list({ defaultLength: 3 }),
                baz: b.string(),
            })

            const E1 = SingleNoDefault.create()
            expectJSON(E1.value).toEqual({ foo: 'yo' })
        })

        it('works WITH default - Multi', () => {
            const E1 = Multi.create()
            expect(E1.toValueJSON()).toEqual({ baz: '' })
            expect(toJS(E1.serial)).toMatchObject({
                // prettier-ignore
                values_: {
              baz: { value: '' },
            },
            })
        })

        it('works WITH default - Single', () => {
            const E2 = Single.create()
            expect(E2.toValueJSON()).toEqual({ baz: '' })
            expect(toJS(E2.serial)).toMatchObject({
                // prettier-ignore
                values_: {
                    baz: { value: '' },
                },
            })
        })
    })

    // SET SERIAL ----------------------
    describe('setSerial', () => {
        it('works', () => {
            const E1 = Multi.create()
            expectJSON(E1.value).toEqual({ baz: '' })

            const serial = {
                type: 'choices' as const,
                branches: { baz: true, foo: true, bar: true },
                values_: {
                    baz: { type: 'str' as const, value: '🔵' },
                    foo: { type: 'str' as const, value: '🟢' },
                    bar: {
                        type: 'list' as const,
                        items_: [
                            { type: 'number' as const, value: 1 },
                            { type: 'number' as const, value: 2 },
                            { type: 'number' as const, value: 3 },
                        ],
                    },
                },
            }

            E1.setSerial(serial)
            expect(E1.serial === serial).toBe(false)
            // expect(E1.value).toBe(2)
            expectJSON(E1.value).toEqual({ foo: '🟢', bar: [1, 2, 3], baz: '🔵' })
            expect(toJS(E1.serial)).toMatchObject(serial)
        })
    })

    describe.skip('setValue', () => {
        it('works', () => {
            const E1 = Multi.create()
            expectJSON(E1.value).toEqual(['🔵', '🔵', '🔵'])
            expect(E1.length).toBe(3)

            E1.value = ['🔵', '🟢']
            expect(E1.length).toBe(2)
            expectJSON(E1.value).toEqual(['🔵', '🟢'])
            expect(toJS(E1.serial)).toMatchObject({
                type: 'list' as const,
                items_: [
                    { type: 'str' as const, value: '🔵' },
                    { type: 'str' as const, value: '🟢' },
                ],
            })
        })

        it('updates the serial without creating a new one', () => {
            const E1 = Multi.create()
            const oldSerial = E1.serial
            expect(oldSerial.items_.length).toBe(3)

            E1.value = ['🔵', '🟢']

            expect(oldSerial.items_.length).toBe(2)
            expect(toJS(oldSerial)).toMatchObject({
                type: 'list' as const,
                items_: [
                    { type: 'str' as const, value: '🔵' },
                    { type: 'str' as const, value: '🟢' },
                ],
            })
        })
    })

    // STRUCTURAL SHARING --------------
    it.skip('generate a new serial for each field', () => {
        const E1 = Multi.create()
        const E2 = Multi.create(E1.serial)

        // same shape
        expect(E1.items.length).toBe(3)
        expect(E1.serial).toEqual(E2.serial)
        expect(E1.at(1)!.serial).toEqual(E2.at(1)!.serial)

        // different refs
        expect(E1.serial === E2.serial).toBe(false)
        expect(E1.at(1)!.serial === E2.at(1)!.serial).toBe(false)
    })

    // EFFECTS -------------------------
    it.skip('doesnt apply serial effect nor value effect on instanciation ', () => {
        // 🔴 TODO
    })

    describe.skip('value proxy', () => {
        it('is mutable', () => {
            const S2 = b.int({ default: 3 }).list({ defaultLength: 1 })
            const a = S2.create()
            expect(a.length).toBe(1)
            expectJSON(a.value).toEqual([3])

            a.value[0] = 8

            expect(a.length).toBe(1)
            expectJSON(a.value).toEqual([8])
        })

        it('can ADD items at the end', () => {
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
    })

    // RESET ---------------------------
    it.skip('field.reset() should always yield same serial as schema.create(null) except for updatedAt', () => {
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

function expectJSON(a: any) {
    return expect(JSON.parse(JSON.stringify(a)))
}
