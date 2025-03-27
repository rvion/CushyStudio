import { defineFieldMixin } from '../model/defineFieldMixin'
import { type FieldAnomaly } from './Anomaly'
import { rescopeAnomaly } from './rescopeAnomaly'

// export interface IAnomalyMixins {
//     dropAnomalies(): void
//     readonly anomalies: FieldAnomaly[]
//     addAnomaly(anomaly: FieldAnomaly): void
//     hoistAnomalies(): void
// }

// export const myMixin: ThisType<Field> & IAnomalyMixins = {
export type AnomalyMixin = typeof AnomalyMixinImpl
export const AnomalyMixinImpl = defineFieldMixin({
   /** drop all anomalies specific to this field (not incl. children anomalies) */
   zDropAnomalies(): void {
      if (this.zSerial.anomalies == null) return
      this.zPatchInTransaction((draft) => {
         delete draft.anomalies
      })
   },

   get zAnomalies(): FieldAnomaly[] {
      return this.zSerial.anomalies ?? []
   },

   /** append an anomalies */
   zAddAnomaly(anomaly: FieldAnomaly): void {
      if (this.zSerial.anomalies == null) {
         this.zPatchInTransaction((draft) => {
            draft.anomalies = [anomaly]
         })
      } else {
         this.zPatchInTransaction((draft) => {
            draft.anomalies!.push(anomaly)
         })
      }
   },

   /**
    * hoist anomalies from all descendants.
    * @since 2024-10-07
    */
   zHoistAnomalies(): void {
      const basePath = this.zPath
      const basePathExt = this.zPathExt
      this.zTraverseAllDepthFirst((x) => {
         if (x.zSerial.anomalies == null) return
         const pathPrefix = x.zPath.slice(0, basePath.length)
         const pathExtPrefix = x.zPathExt.slice(0, basePathExt.length)
         for (const anomaly of x.zSerial.anomalies) {
            const rescoped = rescopeAnomaly(anomaly, pathPrefix, pathExtPrefix)
            this.zAddAnomaly(rescoped)
         }
      })
   },
})

export const AnomalyMixinDescriptors = Object.getOwnPropertyDescriptors(AnomalyMixinImpl)
