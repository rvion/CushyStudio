import { Factory } from './model/Factory'
import { SimpleBuilder } from './simple/SimpleBuilder'

export { MessageInfoUI } from './messages/MessageInfoUI'
export { MessageErrorUI } from './messages/MessageErrorUI'
export { MessageWarningUI } from './messages/MessageWarningUI'
export { MessageUI } from './messages/MessageUI'

export { CSuiteProvider } from './ctx/CSuiteProvider'
export { CSuite_ThemeLoco } from './ctx/CSuite_ThemeLoco'

export type { IBuilder as Builder } from './model/IBuilder'
export type { AnyFieldSerial } from './model/EntitySerial'
export type { SchemaDict } from './model/SchemaDict'
export type { BaseSchema } from './model/BaseSchema'
export type { EntityConfig } from './model/Entity'

export type { OpenRouter_Models } from './openrouter/OpenRouter_models'
export type { CovariantFC } from './variance/CovariantFC'
export type * from './variance/BivariantHack'
export type * from './simple/SimpleAliases'

export { Channel } from './model/pubsub/Channel'
export { ActivityContainerUI } from './activity/ActivityContainerUI'
export { ActivityStackUI } from './activity/ActivityStackUI'

export type SimpleFactory = Factory<SimpleBuilder>
export const simpleBuilder = new SimpleBuilder()
export const simpleFactory: SimpleFactory = new Factory(simpleBuilder)
