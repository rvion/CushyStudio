import { ModelManager } from '../model/ModelManager'
import { SimpleDomain } from './SimpleDomain'

// MOVE THIS FILE AS REEXPORT ENTRYPOINT
export { CSuiteProvider } from '../../csuite/ctx/CSuiteProvider'
export { CSuite_ThemeLoco } from '../../csuite/ctx/CSuite_ThemeLoco'

export type { IDomain as IFormBuilder } from '../model/IDomain'
export type { ModelSerial as FormSerial } from '../model/FormSerial'
export type { ModelConfig as FormProperties } from '../model/Model'
export type { SchemaDict, IBlueprint as ISpec } from '../model/IBlueprint'
export type { OpenRouter_Models } from '../../csuite/openrouter/OpenRouter_models'
export type * from './SimpleSpecAliases'
export { Channel } from '../model/Channel'
export { ActivityContainerUI, ActivityStackUI } from '../../csuite/activity/ActivityUI'

export const SimpleModelManager: ModelManager<SimpleDomain> = new ModelManager(SimpleDomain)
