import { beforeEach, describe, expect, it } from 'bun:test'

import { simpleBuilder as b, simpleFactory } from '../../index'
import { expectJSON } from './utils/expectJSON'

const r = simpleFactory.repository

describe('model links', () => {
   beforeEach(() => r.reset())
   it('work', () => {
      // #region initial repo condition
      expect(r.tracked).toMatchObject({
         //
         documentCount: 0,
         fieldCount: 0,
         transactionCount: 0,
         //
         createCount: 0,
         updateCount: 0,
         deleteCount: 0,
      })

      // #region new schema
      let totalRootSerialChanged = 0
      let totalRootValueChanged = 0
      const S = b.fields(
         {
            int: b.int(),
            str: b.string(),
            bool: b.bool(),
            list: b.int().list({ min: 3 }),
         },
         {
            onSerialChange: (x) => totalRootSerialChanged++,
            onValueChange: (x) => totalRootValueChanged++,
         },
      )

      const DEFAULT_SERIAL: (typeof S)['$Serial'] = {
         $: 'group',
         values_: {
            int: { $: 'number', value: 0 },
            str: { $: 'str', value: '' },
            bool: { $: 'bool', value: false },
            list: {
               $: 'list',
               items_: [
                  { $: 'number', value: 0 },
                  { $: 'number', value: 0 },
                  { $: 'number', value: 0 },
               ],
            },
         },
      }

      expect(totalRootSerialChanged).toBe(0)

      // #region create entity
      const e = S.create(DEFAULT_SERIAL)
      expect(e.repo).toBe(r)
      expect(totalRootSerialChanged).toBe(0)
      expect(totalRootValueChanged).toBe(0)
      expect(e.toValueJSON()).toMatchObject({ int: 0, str: '', bool: false, list: [0, 0, 0] })
      expectJSON(e.serial).toMatchObject(DEFAULT_SERIAL)
      // console.log(`[🔴] `)
      // entity map
      expect(r.tracked).toMatchObject({
         //
         documentCount: 1,
         fieldCount: 8,
         transactionCount: 1,
         //
         createCount: 8,
         updateCount: 0,
         deleteCount: 0,
      })
      // --------------------------------------------------------------

      // console.log(`[🤠] totalRootSerialChanged`, totalRootSerialChanged)
      // console.log(`[🤠] totalRootSerialChanged`, r.updateCount)
      e.value.int = 5
      e.value.int = 6
      // console.log(`[🤠] totalRootSerialChanged`, totalRootSerialChanged)
      // console.log(`[🤠] totalRootSerialChanged`, r.updateCount)

      expect(totalRootSerialChanged).toBe(2)

      r.startRecording()
      expect(r.tracked).toMatchObject({
         documentCount: 1, //    =
         fieldCount: 8, //       =
         transactionCount: 3, // +2 (one per int)
         createCount: 8, //      =
         updateCount: 4, //      +2x (root + int) = 4
         deleteCount: 0, //      = (serial only incremented when value identical)
      })

      e.runInTransaction(() => {
         e.value.int = 5
         e.value.int = 7
         e.value.int = 6
      })

      expect(r.tracked).toMatchObject({
         documentCount: 1, //    =
         fieldCount: 8, //       =
         transactionCount: 4, // +1
         //
         createCount: 8, //      =
         updateCount: 6, //      +2 (root + int)
         deleteCount: 0, //      =
      })
      r.endRecording()
      expect(totalRootSerialChanged).toBe(3)
      expect(e.value.list.length).toBe(3)
      expect(e.toValueJSON().list).toMatchObject([0, 0, 0])

      // #region samve value assignment
      // SAME VALUE: should NOT trigger any snapshot
      e.value.list = [0, 0, 0]
      expect(totalRootSerialChanged).toBe(3)

      e.value = {
         int: 6,
         str: '',
         bool: false,
         list: [0, 0, 0],
      }

      expect(totalRootSerialChanged).toBe(3)
      expect(r.tracked).toMatchObject({
         documentCount: 1, //    =
         fieldCount: 8, //       =
         transactionCount: 6, // +2
         //
         createCount: 8, //      =
         updateCount: 6, //      =
         deleteCount: 0, //      =
      })

      // different value ------------------------
      r.startRecording()
      e.value = {
         bool: false,
         int: 0,
         str: 'coucou',
         list: [1, 0, 3, 4],
      }
      expect(r.endRecording()).toEqual([
         '🟢 create     $.list.3',
         '👛 update     $.list.0',
         // '👛 update     $.list.1',
         '👛 update     $.list.2',
         '👛 update     $.int',
         '👛 update     $.str',
         '👛 update     $.list',
         '👛 update     $',
         '💙 publish    $.list.0',
         // '💙 publish    $.list.1',
         '💙 publish    $.list.2',
         '💙 publish    $.int',
         '💙 publish    $.str',
         '💙 publish    $.list',
         '💙 publish    $',
      ])

      expect(r.tracked).toMatchObject({
         documentCount: 1, //    =
         fieldCount: 9, //       +1
         transactionCount: 7, // +1

         createCount: 9, //      +1
         updateCount: 12, // the last item of list does not count: it is created, not touched
         deleteCount: 0,
      })

      // only change the value in `$.list[1]` ----------------> VV
      e.value = { bool: false, int: 0, str: 'coucou', list: [1, 22, 3, 4] }
      const tct = r.lastTransaction
      // const pathsTouched = [...tct!.updatedFields.entries()].map(([field, mode]) => ({ path: field.path, mode }))
      expect(tct?.summary1).toMatchObject({
         created: [],
         updated: ['$.list.1', '$.list', '$'],
         deleted: [],
      })
      expect(tct?.summary2).toMatchObject([
         { path: '$.list.1', type: 'update' },
         { path: '$.list', type: 'update' },
         { path: '$', type: 'update' },
      ])
   })
})
