import { describe, expect, it } from 'bun:test'
import { _getAdministration, isObservableProp } from 'mobx'

import { simpleBuilder as b } from '../../index'

describe('groups', () => {
    it('are practical to use', () => {
        const S1: S.SGroup<{
            baz: S.SGroup<{
                qux: S.SString
            }>
        }> = b.fields({
            baz: b.fields({
                qux: b.string({ default: '🔵' }),
            }),
        })
        const E1 = S1.create()
        expect(E1.Baz.Qux).toEqual(E1.fields.baz.fields.qux)
        // |      ^   ^
        // |     capital letter automatically added the the field
        // |
        // | 🟢 AFTER : E1.Baz.Qux
        // | ❌ BEFORE: E1.fields.baz.fields.qux
        // |               ~~~~~~     ~~~~~~
        // |
        // | this is SO GOOD because capital letters
        // | are displayed first in the autocompletion,
        // | which is what we want on group fields
    })
})

// OMG; this bug is the shittiest one every 😱
// it means mobx-store-inheritance only work properly the very first time
// it is applies to class hierarchies
describe('mobx observability', () => {
    it('is working', () => {
        const S1 = b.fields({})

        // first work
        const E1 = S1.create()
        const E1Ann = _getAdministration(E1).appliedAnnotations_
        expect(Object.keys(E1Ann).length).toBeGreaterThan(100)
        expect(isObservableProp(E1, 'id')).toBe(true)
        expect(isObservableProp(E1, 'schema')).toBe(false)
        expect(E1.numFields).toBe(0)
        expect(E1.constructor.name).toBe('Field_group')
        expect(isObservableProp(E1, 'numFields')).toBe(true)

        // second fail
        const E2 = S1.create()
        const E2Ann = _getAdministration(E2).appliedAnnotations_
        expect(Object.keys(E2Ann).length).toBeGreaterThan(100)
        expect(isObservableProp(E2, 'id')).toBe(true)
        expect(isObservableProp(E2, 'schema')).toBe(false)
        expect(E2.numFields).toBe(0)
        expect(E2.constructor.name).toBe('Field_group')
        expect(isObservableProp(E2, 'numFields')).toBe(true)

        // TEST TO WRITE
        // .Foo on schema 1
        // .Bar on schema 2
    })
})

describe('structural sharing', () => {
    it('works', () => {
        const S1 = b.fields({
            num: b.number(),
            str: b.string(),
        })

        const ser1: (typeof S1)['$Serial'] = {
            $: 'group',
            values_: {
                num: { $: 'number', value: 10 },
                str: { $: 'str', value: 'A' },
            },
        }

        const ser2: (typeof S1)['$Serial'] = {
            $: 'group',
            values_: {
                num: { $: 'number', value: 20 },
                str: { $: 'str', value: 'B' },
            },
        }

        const E1 = S1.create(ser1)
        expect(E1.value).toEqual({ num: 10, str: 'A' })
        expect(E1.serial === ser1).toBeTrue()
        expect(E1.__version__).toBe(1)
        expect(E1.Num.__version__).toBe(1)
        expect(E1.Str.__version__).toBe(1)

        E1.setSerial(ser2)
        expect(E1.value).toEqual({ num: 20, str: 'B' })
        expect(E1.serial === ser2).toBeTrue()
        expect(E1.__version__).toBe(2)
        expect(E1.Num.__version__).toBe(2)
        expect(E1.Str.__version__).toBe(2)

        E1.setSerial(ser2)
        E1.setSerial(ser2)
        E1.setSerial(ser2)
        E1.setSerial(ser2)
        expect(E1.__version__).toBe(2)
        expect(E1.Num.__version__).toBe(2)

        E1.value.num = 30
        expect(E1.__version__).toBe(3) // <- changed
        expect(E1.Num.__version__).toBe(3)
        expect(E1.Str.__version__).toBe(2) // <- not changed
    })
})
