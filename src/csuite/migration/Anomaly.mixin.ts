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
   ϟdropAnomalies(): void {
      if (this.ϟserial.anomalies == null) return
      this.ϟpatchInTransaction((draft) => {
         delete draft.anomalies
      })
   },

   get ϟanomalies(): FieldAnomaly[] {
      return this.ϟserial.anomalies ?? []
   },

   /** append an anomalies */
   ϟaddAnomaly(anomaly: FieldAnomaly): void {
      if (this.ϟserial.anomalies == null) {
         this.ϟpatchInTransaction((draft) => {
            draft.anomalies = [anomaly]
         })
      } else {
         this.ϟpatchInTransaction((draft) => {
            draft.anomalies!.push(anomaly)
         })
      }
   },

   /**
    * hoist anomalies from all descendants.
    * @since 2024-10-07
    */
   ϟhoistAnomalies(): void {
      const basePath = this.ϟpath
      const basePathExt = this.ϟpathExt
      this.ϟtraverseAllDepthFirst((x) => {
         if (x.ϟserial.anomalies == null) return
         const pathPrefix = x.ϟpath.slice(0, basePath.length)
         const pathExtPrefix = x.ϟpathExt.slice(0, basePathExt.length)
         for (const anomaly of x.ϟserial.anomalies) {
            const rescoped = rescopeAnomaly(anomaly, pathPrefix, pathExtPrefix)
            this.ϟaddAnomaly(rescoped)
         }
      })
   },
})

export const AnomalyMixinDescriptors = Object.getOwnPropertyDescriptors(AnomalyMixinImpl)
