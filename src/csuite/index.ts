import { Repository } from './model/EntityManager'
import { SimpleDomain } from './simple/SimpleDomain'

export { CSuiteProvider } from './ctx/CSuiteProvider'
export { CSuite_ThemeLoco } from './ctx/CSuite_ThemeLoco'

export type { IDomain as Domain } from './model/IDomain'
export type { EntitySerial as ModelSerial } from './model/ModelSerial'
export type { ModelConfig } from './model/Entity'
export type { SchemaDict, ISchema as IBlueprint } from './model/IBlueprint'
export type { OpenRouter_Models } from './openrouter/OpenRouter_models'
export type { CovariantFC } from './variance/CovariantFC'
export type * from './variance/BivariantHack'
export type * from './simple/SimpleSpecAliases'

export { Channel } from './model/Channel'
export { ActivityContainerUI } from './activity/ActivityContainerUI'
export { ActivityStackUI } from './activity/ActivityStackUI'
export const SimpleModelManager: Repository<SimpleDomain> = new Repository(SimpleDomain)
