import { beforeEach, describe, expect, it } from 'bun:test'

import { simpleBuilder as b, simpleFactory } from '../../index'

const r = simpleFactory.repository

describe('model links', () => {
    beforeEach(() => r.reset())
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
        expect(totalRootValueChanged).toBe(0)
        expect(e.toValueJSON()).toMatchObject({
            int: 0,
            str: '',
            bool: false,
            list: [0, 0, 0],
        })

        // entity map
        expect(r.tracked).toMatchObject({
            transactionCount: /*   */ 1,
            allRootSize: /*        */ 1,
            allFieldSize: /*       */ 8,
            totalValueTouched: /*  */ 0,
            totalSerialTouched: /* */ 0,
            totalCreations: /*     */ 8,
        })
        // --------------------------------------------------------------

        e.value.int = 5
        e.value.int = 6

        expect(totalRootSnapshotChanged).toBe(2)
        r.startRecording()
        expect(r.tracked).toMatchObject({
            transactionCount: /*   */ 3, // 1 + 2(one per int)
            allRootSize: /*        */ 1, // same
            allFieldSize: /*       */ 8, // same
            totalValueTouched: /*  */ 4, // + 2 x (root + int) = 4
            totalSerialTouched: /* */ 0, // same (serial only incremented when value identical)
            totalCreations: /*     */ 8, // same
        })

        e.runInAutoTransaction(() => {
            e.value.int = 5
            e.value.int = 7
            e.value.int = 6
        })

        expect(r.tracked).toMatchObject({
            transactionCount: /*   */ 4, // +1
            totalValueTouched: /*  */ 6, // +2 (root + int)
            totalSerialTouched: /* */ 0,
            totalCreations: /*     */ 8,
        })
        r.endRecording()
        expect(totalRootSnapshotChanged).toBe(3)
        expect(e.value.list.length).toBe(3)
        expect(e.toValueJSON().list).toMatchObject([0, 0, 0])
        // SAME VALUE: should NOT trigger any snapshot
        e.value.list = [0, 0, 0]
        expect(totalRootSnapshotChanged).toBe(3)

        e.value = {
            int: 6,
            str: '',
            bool: false,
            list: [0, 0, 0],
        }

        expect(totalRootSnapshotChanged).toBe(3)
        expect(r.tracked).toMatchObject({
            transactionCount: 6,
            totalValueTouched: 6,
            totalSerialTouched: 0,
            totalCreations: 8,
        })

        // different value ------------------------
        r.startRecording()
        e.value = {
            bool: false,
            int: 0,
            str: 'coucou',
            list: [1, 2, 3, 4],
        }
        expect(r.endRecording()).toEqual([
            '🟢 onInit     $.list.3',
            '🔶 onValue    $.list.0',
            '🔶 onValue    $.list.1',
            '🔶 onValue    $.list.2',
            '🔶 onValue    $.int',
            '🔶 onValue    $.str',
            '🔶 onValue    $.list',
            '🔶 onValue    $',
            '❌ onSerial   $.list.0',
            '❌ onSerial   $.list.1',
            '❌ onSerial   $.list.2',
            '❌ onSerial   $.int',
            '❌ onSerial   $.str',
            '❌ onSerial   $.list',
            '❌ onSerial   $',
            '💙 publish    $.list.0',
            '💙 publish    $.list.1',
            '💙 publish    $.list.2',
            '💙 publish    $.int',
            '💙 publish    $.str',
            '💙 publish    $.list',
            '💙 publish    $',
        ])

        expect(r.tracked).toMatchObject({
            transactionCount: 7,
            totalValueTouched: 13, // the last item of list does not count: it is created, not touched
            totalSerialTouched: 0,
            totalCreations: 9,
        })

        // only change the value in `$.list[1]` ----------------> VV
        e.value = { bool: false, int: 0, str: 'coucou', list: [1, 22, 3, 4] }
        const tct = r.lastTransaction
        const pathsTouched = [...tct!.touchedFields.entries()].map(([field, mode]) => ({ path: field.path, mode }))
        expect(pathsTouched).toMatchObject([
            { path: '$.list.1', mode: 'value' },
            { path: '$.list', mode: 'value' },
            { path: '$', mode: 'value' },
        ])
    })
})
