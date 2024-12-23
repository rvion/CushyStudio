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
    dropAnomalies(): void {
        if (this.serial.anomalies == null) return
        this.patchInTransaction((draft) => {
            delete draft.anomalies
        })
    },

    get anomalies(): FieldAnomaly[] {
        return this.serial.anomalies ?? []
    },

    /** append an anomalies */
    addAnomaly(anomaly: FieldAnomaly): void {
        if (this.serial.anomalies == null) {
            this.patchInTransaction((draft) => {
                draft.anomalies = [anomaly]
            })
        } else {
            this.patchInTransaction((draft) => {
                draft.anomalies!.push(anomaly)
            })
        }
    },

    /**
     * hoist anomalies from all descendants.
     * @since 2024-10-07
     */
    hoistAnomalies(): void {
        const basePath = this.path
        const basePathExt = this.pathExt
        this.traverseAllDepthFirst((x) => {
            if (x.serial.anomalies == null) return
            const pathPrefix = x.path.slice(0, basePath.length)
            const pathExtPrefix = x.pathExt.slice(0, basePathExt.length)
            for (const anomaly of x.serial.anomalies) {
                const rescoped = rescopeAnomaly(anomaly, pathPrefix, pathExtPrefix)
                this.addAnomaly(rescoped)
            }
        })
    },
})

export const AnomalyMixinDescriptors = Object.getOwnPropertyDescriptors(AnomalyMixinImpl)
