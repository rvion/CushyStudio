import type { Field } from '../Field'

/**
 * free structure to wrap mobx reaction api,
 * so we can defer applying the reaction
 * until the field is fully constructed
 */
export type FieldReaction<T extends Field> = {
   expr(self: T): any
   effect(arg: any, self: T): void
}
