import { describe, expect, it, mock } from 'bun:test'

import { simpleBuilder as b, simpleRepo as r } from '../../index'

describe('model links', () => {
    it('work', () => {
        expect(r.transactionCount).toBe(0)
        expect(r.allRoots.size).toBe(0)
        expect(r.allFields.size).toBe(0)
        expect(r.totalValueTouched).toBe(0)
        expect(r.totalSerialTouched).toBe(0)
        expect(r.totalCreations).toBe(0)

        // new schema
        const S = b.fields({
            int: b.int(),
            str: b.string(),
            bool: b.bool(),
            list: b.int().list({ min: 3 }),
        })

        // create entity
        const e = S.create()
        expect(e.repo).toBe(r)
        expect(e.toValueJSON()).toMatchObject({
            int: 0,
            str: '',
            bool: false,
            list: [0, 0, 0],
        })

        // entity map
        expect(r.transactionCount).toBe(1)
        expect(e.repo.allRoots.size).toBe(1)
        expect(e.repo.allFields.size).toBe(8)

        // RIEN NE CHANGE CAR JUST HYDRATATION
        expect(r.totalValueTouched).toBe(0)
        expect(r.totalSerialTouched).toBe(0)
        expect(r.totalCreations).toBe(8)

        e.value.int = 5
        e.value.int = 6

        expect(r.transactionCount).toBe(3)
        expect(r.totalValueTouched).toBe(2)
        expect(r.totalSerialTouched).toBe(0)
        expect(r.totalCreations).toBe(8)

        ////////////////

        e.MUTVALUE(() => {
            e.value.int = 5
            e.value.int = 6
        })

        expect(r.transactionCount).toBe(4)
        expect(r.totalValueTouched).toBe(4)
        expect(r.totalSerialTouched).toBe(0)
        expect(r.totalCreations).toBe(8)

        r.debugStart()
        // same value
        e.value = {
            int: 6,
            str: '',
            bool: false,
            list: [0, 0, 0],
        }
        r.debugEnd()
        expect(r.transactionCount).toBe(5)
        expect(r.totalValueTouched).toBe(4)
        expect(r.totalSerialTouched).toBe(0)
        expect(r.totalCreations).toBe(8)

        // different value
        e.value = {
            bool: false,
            int: 0,
            str: 'coucou',
            list: [1, 2, 3, 4],
        }

        expect(r.transactionCount).toBe(6)
        expect(r.totalValueTouched).toBe(13)
        expect(r.totalSerialTouched).toBe(0)
        expect(r.totalCreations).toBe(9)

        expect()
    })
})

// const x = mock(e.repo._registerField)
// expect(e.repo._registerField).toBeCalledTimes(8)
