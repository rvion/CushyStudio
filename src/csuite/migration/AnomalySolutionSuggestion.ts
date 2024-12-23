export type AnomalySuggestionID = string
/**
 * when presented with a bunch of field containing anomalies,
 * the MigrationEngine will offer a list of possible fixes for th euser to pick from.
 * any anomaly will lead to one or multiple fixes to be presented to the user.
 *
 * this payload is made so it can be sent back from BACKEND => to FRONTEND.
 *
 * but since solutions can have configuration, it is expected that
 * both frontend and backend will have the list of available solutions.
 * it should be OK since all of those are just lambdas
 */
export type AnomalySolutionSuggestion = {
    id: AnomalySuggestionID
    description: string
    candidates: { name: string; solutionID: string }[]
    count: number
}
