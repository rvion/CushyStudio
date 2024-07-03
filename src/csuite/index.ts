import { Repository } from './model/Repository'
import { SimpleBuilder } from './simple/SimpleBuilder'

export { CSuiteProvider } from './ctx/CSuiteProvider'
export { CSuite_ThemeLoco } from './ctx/CSuite_ThemeLoco'

export type { IBuilder as Builder } from './model/IBuilder'
export type { EntitySerial as ModelSerial } from './model/EntitySerial'
export type { EntityConfig as ModelConfig } from './model/Field'
export type { SchemaDict, ISchema as ISchema } from './model/ISchema'
export type { OpenRouter_Models } from './openrouter/OpenRouter_models'
export type { CovariantFC } from './variance/CovariantFC'
export type * from './variance/BivariantHack'
export type * from './simple/SimpleAliases'

export { Channel } from './model/Channel'
export { ActivityContainerUI } from './activity/ActivityContainerUI'
export { ActivityStackUI } from './activity/ActivityStackUI'

export type SimpleRepo = Repository<SimpleBuilder>
export const simpleBuilder = new SimpleBuilder()
export const simpleRepo: SimpleRepo = new Repository(simpleBuilder)
