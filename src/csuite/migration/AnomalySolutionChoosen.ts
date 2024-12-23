import type { BaseSchema } from '../model/BaseSchema'
import type { AnomalysolutionID } from './AnomalySolution'

// import type { AnomalySuggestionID } from './AnomalySolutionSuggestion'

/**
 * the user will then pick fixes he want
 */
export type AnomalySolutionChoosen<CONFIG extends BaseSchema> = {
   // suggestionID: AnomalySuggestionID
   solutionID: AnomalysolutionID
   config: CONFIG['$Serial']
}
