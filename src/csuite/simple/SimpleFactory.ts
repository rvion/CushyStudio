import { Factory } from '../model/Factory'
import { SimpleBuilder } from './SimpleBuilder'

export type SimpleFactory = Factory<SimpleBuilder>
export const simpleBuilder = new SimpleBuilder()
export const simpleFactory: SimpleFactory = new Factory(simpleBuilder)

/**
 * zod does it with z, and is kinda praised for it's practicallity.
 * So why don't we try it too
 *
 * @since 2024-10-11
 */
export const sb = simpleBuilder
