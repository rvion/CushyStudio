import { ModelManager } from './FormManager'
import { SimpleFormBuilder } from './SimpleFormBuilder'

// MOVE THIS FILE AS REEXPORT ENTRYPOINT
export { CSuiteProvider } from '../csuite/ctx/CSuiteProvider'
export { CSuite_ThemeLoco } from '../csuite/ctx/CSuite_ThemeLoco'

export type { IFormBuilder } from './IFormBuilder'
export type { FormSerial } from './FormSerial'
export type { ModelConfig as FormProperties } from './Model'
export type { SchemaDict, ISpec } from './ISpec'
export type { OpenRouter_Models } from '../csuite/openrouter/OpenRouter_models'
export type * from './SimpleSpecAliases'
export { Channel } from './Channel'
export { ActivityContainerUI, ActivityStackUI } from '../csuite/activity/ActivityUI'

export const SimpleFormManager: ModelManager<SimpleFormBuilder> = new ModelManager(SimpleFormBuilder)
