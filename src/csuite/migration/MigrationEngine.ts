import type { Field_number_serial } from '../fields/number/FieldNumber'
import type { BaseSchema } from '../model/BaseSchema'
import type { Field } from '../model/Field'
import type { BoundAnomaly } from './Anomaly'
import type { AnomalySolution } from './AnomalySolution'
import type { AnomalySolutionChoosen } from './AnomalySolutionChoosen'
import type { AnomalySolutionSuggestion, AnomalySuggestionID } from './AnomalySolutionSuggestion'
import type { MigrationResult } from './MigrationResult'

import { isFieldString } from '../fields/WidgetUI.DI'
import { bang } from '../utils/bang'
import { groupByAsDict } from '../utils/groupByAsDict'

export class MigrationEngine {
   knownSolutions = new Map<string, AnomalySolution<any, any>>()

   registerSolution<
      //
      CONFIG extends BaseSchema,
      DATA extends any,
   >(solution: AnomalySolution<CONFIG, DATA>): void {
      this.knownSolutions.set(solution.solutionID, solution)
   }
   constructor() {
      // generic drop anomaly solution
      this.registerSolution({
         solutionID: 'drop',
         isApplicable: () => true,
         config: (b) => b.empty(),
         action: ({ document: field }) => {
            field.dropAnomalies()
            return 'SUCCESS'
         },
      })
      //
      this.registerSolution({
         solutionID: 'number-to-string',
         description: 'convert previous number serial to string serial',
         isApplicable: ({ document, anomaly }) => {
            const field = document.getFieldAt(anomaly.path)
            if (!isFieldString(field)) return // console.log(`   > field at ${anomaly.path} is not a string`)
            if (anomaly.got.$ !== 'number') return // console.log(`   >  prevSerial.$ is not a 'number'`)
            const oldVal = (anomaly.got as Field_number_serial).value
            if (typeof oldVal !== 'number') return // console.log(`   >  prevSerial.value is not a number`, anomaly.got)
            return { field, oldVal }
         },
         config: (b) => b.choices({ prefix: b.string(), suffix: b.string() }),
         action: ({ document, config, anomaly, data }) => {
            data.field.patchInTransaction((draft) => {
               draft.value = (config.value.prefix ?? '') + String(data.oldVal) + (config.value.suffix ?? '')
            })
            return 'SUCCESS'
         },
      })
   }

   scope = new Set<Field>()

   /**  */
   consider(document: Field): void {
      this.scope.add(document)
   }

   /** raw list of all anomales found for all fields in the scope  */
   get anomalies(): BoundAnomaly[] {
      return [...this.scope.values()] //
         .flatMap((document) => document.anomalies.map((anomaly): BoundAnomaly => ({ document, anomaly })))
   }

   get batchOfSimilarAnomalies(): Record<AnomalySuggestionID, BoundAnomaly[]> {
      // this is kind of some `Anomaly Batch Id`
      const y = groupByAsDict(this.anomalies, (a) => `{{${a.document.schema.uid}}}${a.anomaly.pathExt}`)
      return y
   }

   /** list of all recovery candidates pick/configure  */
   get suggestions(): AnomalySolutionSuggestion[] {
      return Object.entries(this.batchOfSimilarAnomalies) //
         .map(([anomalySuggestionID, anomalies]): AnomalySolutionSuggestion => {
            const { document, anomaly } = bang(anomalies[0])
            const suggestions = [...this.knownSolutions.values()] //
               .filter((fix) => {
                  const isApplicable = fix.isApplicable({ document, anomaly })
                  // console.log(`[🤠]   ${anomalySuggestionID}: ${fix.solutionID} is ${isApplicable ? '🟢 applicable' : '❌ NOT applicable'}`) // prettier-ignore
                  return isApplicable
               })
            return {
               id: anomalySuggestionID,
               count: anomalies.length,
               description: anomaly.pathExt,
               candidates: suggestions.map((s) => ({
                  name: s.description ?? s.solutionID,
                  solutionID: s.solutionID,
               })),
            }
         })
   }

   /**
    * this method
    */
   attemptMigration(fixes: Record<AnomalySuggestionID, AnomalySolutionChoosen<any>>): {
      status: 'SUCCESS' | 'FAILURE'
      results: MigrationResult[]
   } {
      const results: MigrationResult[] = []
      for (const [k, v] of Object.entries(this.batchOfSimilarAnomalies)) {
         const fix = fixes[k]
         if (fix == null) {
            console.log(`[🔶] no solution provided for ${k}`)
            continue
         }
         const solution = this.knownSolutions.get(fix.solutionID)
         if (solution == null) {
            console.log(`[🔶] requested solution for ${k} does not exist`)
            continue
         }
         let totalProcessed: number = 0
         let totalChanged: number = 0
         let totalSuccess: number = 0
         let totalFailed: number = 0
         for (const { document, anomaly } of v) {
            const data = solution.isApplicable({ document, anomaly })
            if (data == null) {
               console.log(`[🔶] solution provided for ${k} is no longer applicable`)
               continue
            }
            const prevDocSerial = document.serial
            const result = solution.action({
               document,
               anomaly,
               config: fix.config,
               data: data,
            })
            totalProcessed++
            if (prevDocSerial !== document.serial) totalChanged++
            if (result === 'SUCCESS') totalSuccess++
            else if (result === 'FAILURE') totalFailed++

            console.log(`[🔶] ${k} => ${result}`)
         }
         results.push({
            success: totalFailed === 0,
            suggestionID: k,
            solutionID: fix.solutionID,
            totalSuccess,
            totalProcessed,
            totalChanged,
            totalFailed,
         })
      }

      return {
         status: results.every((r) => r.success) ? 'SUCCESS' : 'FAILURE',
         results,
      }
   }
}
