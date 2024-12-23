import type { FieldAnomaly } from './Anomaly'

/**
 * utility that re-scope anomalies to some new field
 * usefull if a serial containing anomalies have been used in multiple places
 *
 * 🔶 it's important to hoist anomalies to the root field so they are not lost/nested.
 */

export function rescopeAnomaly(
    //
    anomaly: FieldAnomaly,
    //
    pathPrefix: string,
    pathExtPrefix: string,
): FieldAnomaly {
    return {
        ...anomaly,
        path: pathPrefix + anomaly.path,
        pathExt: pathExtPrefix + anomaly.pathExt,
    }
}
