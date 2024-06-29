import { Repository } from './model/EntityManager'
import { SimpleBuilder } from './simple/SimpleBuilder'

export { CSuiteProvider } from './ctx/CSuiteProvider'
export { CSuite_ThemeLoco } from './ctx/CSuite_ThemeLoco'

export type { IBuilder as Builder } from './model/IBuilder'
export type { EntitySerial as ModelSerial } from './model/ModelSerial'
export type { ModelConfig } from './model/Entity'
export type { SchemaDict, ISchema as ISchema } from './model/ISchema'
export type { OpenRouter_Models } from './openrouter/OpenRouter_models'
export type { CovariantFC } from './variance/CovariantFC'
export type * from './variance/BivariantHack'
export type * from './simple/SimpleAliases'

export { Channel } from './model/Channel'
export { ActivityContainerUI } from './activity/ActivityContainerUI'
export { ActivityStackUI } from './activity/ActivityStackUI'
export const SimpleModelManager: Repository<SimpleBuilder> = new Repository(new SimpleBuilder())
