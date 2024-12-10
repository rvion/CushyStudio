import type { BaseSchema } from '../model/BaseSchema'
import type { Field } from '../model/Field'
import type { SimpleBuilder } from '../simple/SimpleBuilder'
import type { FieldAnomaly } from './Anomaly'

export type AnomalysolutionID = string

/**
 * the migration engine will have a bunch of recovery Implementations in store
 * - some fixes will always be available
 *    - e.g.: discard anomaly and keep the new auto-schema
 *
 * - some fixes will be somewhat generic
 *    - e.g. migrate string => number (can fail)
 *
 * - some fixes will be super specific
 *    e.g. (manually written for specifc business document/schema)
 */
export type AnomalySolution<
   /** result of the fix config */
   CONFIG extends BaseSchema,
   /** result of the isApplicable function */
   DATA extends any,
> = {
   solutionID: AnomalysolutionID
   description?: string
   isApplicable: (p: { document: Field; anomaly: FieldAnomaly }) => DATA | void
   config: (b: SimpleBuilder) => CONFIG
   action: (p: {
      document: Field
      config: CONFIG['$Field']
      anomaly: FieldAnomaly
      data: NonNullable<DATA>
   }) => 'SUCCESS' | 'FAILURE'
}

// export const SKIP = Symbol.for('SKIP')
// type SKIP = typeof SKIP
