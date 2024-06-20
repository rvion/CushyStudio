import { ModelManager } from './model/ModelManager'
import { SimpleDomain } from './simple/SimpleDomain'

export { CSuiteProvider } from './ctx/CSuiteProvider'
export { CSuite_ThemeLoco } from './ctx/CSuite_ThemeLoco'

export type { Domain } from './model/IDomain'
export type { ModelSerial } from './model/ModelSerial'
export type { ModelConfig } from './model/Model'
export type { SchemaDict, IBlueprint } from './model/IBlueprint'
export type { OpenRouter_Models } from './openrouter/OpenRouter_models'
export type * from './simple/SimpleSpecAliases'

export { Channel } from './model/Channel'
export { ActivityContainerUI, ActivityStackUI } from './activity/ActivityUI'

export const SimpleModelManager: ModelManager<SimpleDomain> = new ModelManager(SimpleDomain)
