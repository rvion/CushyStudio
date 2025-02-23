import type { CSchema } from '../../../../front/form/LocoSchema'
import type { AnomalysolutionID } from './AnomalySolution'

// import type { AnomalySuggestionID } from './AnomalySolutionSuggestion'

/**
 * the user will then pick fixes he want
 */
export type AnomalySolutionChoosen<CONFIG extends CSchema> = {
   // suggestionID: AnomalySuggestionID
   solutionID: AnomalysolutionID
   config: CONFIG['$serial']
}
