import { describe, expect, it } from 'bun:test'

import { simpleBuilder as b, simpleRepo as r } from '../../index'

describe('model links', () => {
    it('work', () => {
        // initial repo condition
        expect(r.tracked).toMatchObject({
            transactionCount: 0,
            allRootSize: 0,
            allFieldSize: 0,
            totalValueTouched: 0,
            totalSerialTouched: 0,
            totalCreations: 0,
        })

        // new schema
        let totalRootSnapshotChanged = 0
        let totalRootValueChanged = 0
        const S = b.fields(
            {
                int: b.int(),
                str: b.string(),
                bool: b.bool(),
                list: b.int().list({ min: 3 }),
            },
            {
                onSerialChange: (x) => totalRootSnapshotChanged++,
                onValueChange: (x) => totalRootValueChanged++,
            },
        )

        expect(totalRootSnapshotChanged).toBe(0)

        // create entity
        const e = S.create()
        expect(e.repo).toBe(r)
        expect(totalRootSnapshotChanged).toBe(0)
        expect(e.toValueJSON()).toMatchObject({
            int: 0,
            str: '',
            bool: false,
            list: [0, 0, 0],
        })

        // entity map
        expect(r.tracked).toMatchObject({
            transactionCount: 1,
            allRootSize: 1,
            allFieldSize: 8,
            totalValueTouched: 0,
            totalSerialTouched: 0,
            totalCreations: 8,
        })
        // --------------------------------------------------------------

        e.value.int = 5
        e.value.int = 6

        expect(totalRootSnapshotChanged).toBe(2)
        expect(r.tracked).toMatchObject({
            transactionCount: 3,
            allRootSize: 1,
            allFieldSize: 8,
            totalValueTouched: 2,
            totalSerialTouched: 0,
            totalCreations: 8,
        })

        ////////////////

        r.debugStart()
        e.MUTAUTO(() => {
            e.value.int = 5
            e.value.int = 7
            e.value.int = 6
        })
        r.debugEnd()

        expect(r.tracked).toMatchObject({
            transactionCount: 4,
            totalValueTouched: 4, // +2 (root + int)
            totalSerialTouched: 0,
            totalCreations: 8,
        })
        expect(totalRootSnapshotChanged).toBe(3) // 🔴

        r.debugStart()
        // same value
        e.value = {
            int: 6,
            str: '',
            bool: false,
            list: [0, 0, 0],
        }
        r.debugEnd()
        expect(r.tracked).toMatchObject({
            transactionCount: 5,
            totalValueTouched: 4,
            totalSerialTouched: 0,
            totalCreations: 8,
        })

        // different value
        e.value = {
            bool: false,
            int: 0,
            str: 'coucou',
            list: [1, 2, 3, 4],
        }

        expect(r.tracked).toMatchObject({
            transactionCount: 6,
            totalValueTouched: 12,
            totalSerialTouched: 0,
            totalCreations: 9,
        })
    })
})

// const x = mock(e.repo._registerField)
// expect(e.repo._registerField).toBeCalledTimes(8)
