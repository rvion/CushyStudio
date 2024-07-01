import type { CovariantFC } from '../variance/CovariantFC'
import type { Channel, ChannelId, Producer } from './Channel'
import type { Entity } from './Entity'
import type { Field } from './Field'
import type { Instanciable } from './Instanciable'

export type SchemaDict = {
    [key: string]: Instanciable
}

export interface ISchema<out FIELD extends Field = Field> {
    // real fields
    type: FIELD['type']
    config: FIELD['$Config']

    // type utils
    $Field: FIELD
    $Type: FIELD['type']
    $Config: FIELD['$Config']
    $Serial: FIELD['$Serial']
    $Value: FIELD['$Value']

    instanciate(
        //
        entity: Entity<any>,
        parent: Field | null,
        serial: any | null,
    ): FIELD['$Field']

    LabelExtraUI?: CovariantFC<{ field: FIELD }>

    // -----------
    producers: Producer<any, any>[]
    publish<T>(chan: Channel<T> | ChannelId, produce: (self: FIELD['$Field']) => T): this
    subscribe<T>(chan: Channel<T> | ChannelId, effect: (arg: T, self: FIELD['$Field']) => void): this

    reactions: { expr: (self: any) => any; effect: (arg: any, self: any) => void }[]
    addReaction<T>(expr: (self: FIELD['$Field']) => T, effect: (arg: T, self: FIELD['$Field']) => void): this
}
