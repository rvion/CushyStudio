import type { $FieldTypes } from '../$FieldTypes'

/**
 * free structure to wrap mobx reaction api,
 * so we can defer applying the reaction
 * until the field is fully constructed
 */
export type FieldReaction<T extends $FieldTypes> = {
    expr(self: T['$Field']): any
    effect(arg: any, self: T['$Field']): void
}
