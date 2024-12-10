import type { AnomalysolutionID } from './AnomalySolution'
import type { AnomalySuggestionID } from './AnomalySolutionSuggestion'

export type MigrationResult = {
    suggestionID: AnomalySuggestionID
    solutionID: AnomalysolutionID
    success: boolean
    totalProcessed: number
    totalSuccess: number
    totalFailed: number
    totalChanged: number // not all success mean change occured
}
