import { beforeEach, describe, expect, it, vi } from 'vitest'

import { sb } from '../simple/SimpleFactory'
import { MigrationEngine } from './MigrationEngine'

const b = sb

describe('paths and pathExt', () => {
   beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => undefined)
   })

   it('looks like jsonPath', () => {
      const S1 = b.fields({ a: b.int() })
      const E1 = S1.create()
      expect(E1.zPath).toBe('$')
      expect(E1.zFields.a.zPath).toBe('$.a')
      expect(E1.zFields.a.zPathExt).toBe('@group.a@number')
   })
})

describe('migrator', () => {
   it('never-loose-data', () => {
      // 1. first version: everything OK
      const S1 = b.fields({ a: b.int() }).withUID('TEST-abcd')
      const E1 = S1.create()
      E1.zFields.a.zValue = 100
      expect(E1.zSerial.anomalies).toBeUndefined()

      // 2. then schema changes, but serial not migrated => ANOMALIES
      const S2 = b.fields({ a: b.string() }).withUID('TEST-abcd') // <--- Same Schema.uid
      const E2 = S2.create(E1.zSerial as any)
      expect(E2.zFields.a.zSerial.anomalies).toBeUndefined()
      expect(E2.zSerial.anomalies?.length).toBe(1)
      expect(E2.zSerial.anomalies![0]).toMatchObject({
         type: 'invalid-serial',
         path: '$.a',
         pathExt: '@group.a@str',
         got: { $: 'number', value: 100 },
      })

      // 3. fortunately, migrator is here to offer us Fixes
      const migrator = new MigrationEngine()
      const E3 = S2.create(E1.zSerial as any)
      migrator.consider(E2)
      migrator.consider(E3)

      // migrator.registerSolution({
      //     solutionID: 'reset-value-to',
      //     isApplicable: ({ document, anomaly }) => {
      //         const field = document.getFieldAt(anomaly.path)
      //         if (isFieldString(field)) return { field }
      //     },
      //     config: (b) => b.string(),
      //     action: ({ document, config, anomaly, data }) => {
      //         data.field.value = config.value
      //         return 'SUCCESS'
      //     },
      // })

      expect(E1.zHoistAnomalies).toBeDefined()
      expect(migrator.scope.size).toBe(2)
      expect(Object.keys(migrator.batchOfSimilarAnomalies)).toHaveLength(1)
      expect(migrator.suggestions).toHaveLength(1)
      expect(migrator.suggestions.map((s) => s.id)).toMatchObject(['{{TEST-abcd}}@group.a@str'])
      expect(migrator.suggestions[0]!.count).toBe(2)
      expect(migrator.suggestions[0]!.candidates).toMatchObject([
         { name: 'drop', solutionID: 'drop' },
         { name: 'convert previous number serial to string serial', solutionID: 'number-to-string' },
      ])

      // let's apply the suggested number-to-string migration
      const res = migrator.attemptMigration({
         '{{TEST-abcd}}@group.a@str': {
            solutionID: 'number-to-string',
            config: b
               .choices({ prefix: b.string(), suffix: b.string() })
               .create()
               .zSetValue({ prefix: '🔢', suffix: '🔚' }),
         },
      })

      // wow, it's a success ! :O
      expect(res).toMatchObject({
         results: [
            {
               solutionID: 'number-to-string',
               success: true,
               suggestionID: '{{TEST-abcd}}@group.a@str',
               totalProcessed: 2,
               totalChanged: 2,
               totalSuccess: 2,
               totalFailed: 0,
            },
         ],
         status: 'SUCCESS',
      })
      expect(E3.zFields.a.zValue).toBe('🔢100🔚')
   })

   // eslint-disable-next-line vitest/no-commented-out-tests
   // it.skip('never-loose-data', () => {
   //     const S1 = b.fields({
   //         a: b.int(),
   //         b: b.string().optional(),
   //         c: b.bool().list(),
   //     })
   //     const E1 = S1.create()
   //     expect(E1.serial.anomalies).toBe(undefined)

   //     const S2 = b.fields({
   //         a: b.float({ min: Math.PI }),
   //         b: b.string(),
   //         c: b.bool(),
   //     })

   //     const E2 = S2.create(E1.serial as any)
   //     expect(E1.serial.anomalies?.length).toBe(1)
   // })
})
