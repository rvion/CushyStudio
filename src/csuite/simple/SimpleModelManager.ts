import { ModelManager } from '../model/ModelManager'
import { SimpleDomain } from './SimpleDomain'

// MOVE THIS FILE AS REEXPORT ENTRYPOINT
export { CSuiteProvider } from '../ctx/CSuiteProvider'
export { CSuite_ThemeLoco } from '../ctx/CSuite_ThemeLoco'

export type { IDomain as IFormBuilder } from '../model/IDomain'
export type { ModelSerial as FormSerial } from '../model/ModelSerial'
export type { ModelConfig as FormProperties } from '../model/Model'
export type { SchemaDict, IBlueprint as ISpec } from '../model/IBlueprint'
export type { OpenRouter_Models } from '../openrouter/OpenRouter_models'
export type * from './SimpleSpecAliases'
export { Channel } from '../model/Channel'
export { ActivityContainerUI, ActivityStackUI } from '../activity/ActivityUI'

export const SimpleModelManager: ModelManager<SimpleDomain> = new ModelManager(SimpleDomain)
