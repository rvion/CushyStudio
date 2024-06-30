import type { CovariantFC } from '../variance/CovariantFC'
import type { BaseField } from './BaseField'
import type { Channel, ChannelId, Producer } from './Channel'
import type { Entity } from './Entity'
import type { Instanciable } from './Instanciable'

export type SchemaDict = {
    [key: string]: Instanciable
}

export interface ISchema<out Field extends BaseField = BaseField> {
    // real fields
    type: Field['type']
    config: Field['$Config']

    // type utils
    $Field: Field
    $Type: Field['type']
    $Config: Field['$Config']
    $Serial: Field['$Serial']
    $Value: Field['$Value']

    instanciate(
        //
        entity: Entity<any>,
        parent: BaseField | null,
        serial: any | null,
    ): Field['$Field']

    LabelExtraUI?: CovariantFC<{ widget: Field }>

    // -----------
    producers: Producer<any, any>[]
    publish<T>(chan: Channel<T> | ChannelId, produce: (self: Field['$Field']) => T): this
    subscribe<T>(chan: Channel<T> | ChannelId, effect: (arg: T, self: Field['$Field']) => void): this

    reactions: { expr: (self: any) => any; effect: (arg: any, self: any) => void }[]
    addReaction<T>(expr: (self: Field['$Field']) => T, effect: (arg: T, self: Field['$Field']) => void): this
}
