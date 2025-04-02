import type { CSchema } from '../model/CSchema'
import type { AnomalysolutionID } from './AnomalySolution'

// import type { AnomalySuggestionID } from './AnomalySolutionSuggestion'

/**
 * the user will then pick fixes he want
 */
export type AnomalySolutionChoosen<CONFIG extends CSchema> = {
   // suggestionID: AnomalySuggestionID
   solutionID: AnomalysolutionID
   config: CONFIG['{serial}']
}
