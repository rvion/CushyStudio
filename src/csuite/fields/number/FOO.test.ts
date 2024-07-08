import { describe, expect, it, mock } from 'bun:test'

import { simpleBuilder as b, simpleRepo as r } from '../../index'

describe('model links', () => {
    it('work', () => {
        expect(r.transactionCount).toBe(0)
        expect(r.allRoots.size).toBe(0)
        expect(r.allFields.size).toBe(0)
        expect(r.valueTouched).toBe(0)
        expect(r.serialTouched).toBe(0)

        // new schema
        const S = b.fields({
            int: b.int(),
            str: b.string(),
            bool: b.bool(),
            list: b.int().list({ min: 3 }),
        })

        // create entity
        const e = S.create()
        expect(e.toValueJSON()).toMatchObject({
            int: 0,
            str: '',
            bool: false,
            list: [0, 0, 0],
        })

        // entity map
        expect(e.repo).toBe(r)
        expect(e.repo.allRoots.size).toBe(1)
        expect(e.repo.allFields.size).toBe(8)
        expect(r.valueTouched).toBe(0)
        expect(r.serialTouched).toBe(0)

        // VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
        expect(r.transactionCount).toBe(0) // ❓

        e.value.int = 5
        e.value.int = 6

        expect(r.transactionCount).toBe(2)

        e.MUTVALUE(() => {
            e.value.int = 5
            e.value.int = 6
        })

        expect(r.transactionCount).toBe(3)

        // same value
        e.value = {
            int: 6,
            str: '',
            bool: false,
            list: [0, 0, 0],
        }
        expect(r.transactionCount).toBe(4)

        // different value
        e.value = {
            bool: false,
            int: 0,
            str: 'coucou',
            list: [1, 2, 3, 4],
        }

        expect(r.transactionCount).toBe(5)

        expect()
    })
})

// const x = mock(e.repo._registerField)
// expect(e.repo._registerField).toBeCalledTimes(8)
