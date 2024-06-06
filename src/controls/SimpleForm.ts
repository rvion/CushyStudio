// MOVE THIS FILE AS REEXPORT ENTRYPOINT
import { FormManager } from './FormManager'
import { SimpleFormBuilder } from './SimpleFormBuilder'

export type { IFormBuilder } from './IFormBuilder'
export type { FormSerial } from './FormSerial'
export type { FormProperties } from './Form'
export type { SchemaDict, ISpec } from './ISpec'
export type { OpenRouter_Models } from '../csuite/openrouter/OpenRouter_models'
export type * from './SimpleSpecAliases'
export { Channel } from './Channel'
export { ActivityContainerUI, ActivityStackUI } from '../operators/activity/ActivityUI'

export const SimpleFormManager: FormManager<SimpleFormBuilder> = new FormManager(SimpleFormBuilder)
