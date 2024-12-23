import { Factory } from './model/Factory'
import { SimpleBuilder } from './simple/SimpleBuilder'

export type SimpleFactory = Factory<SimpleBuilder>
export const simpleBuilder = new SimpleBuilder()
export const simpleFactory: SimpleFactory = new Factory(simpleBuilder)
