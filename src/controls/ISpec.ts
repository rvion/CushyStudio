import type { Channel, ChannelId, Producer } from './Channel'
import type { IWidget } from './IWidget'
import type { CovariantFC } from './utils/CovariantFC'

export type SchemaDict = { [key: string]: ISpec }

export interface ISpec<W extends IWidget = IWidget> {
    // real fields
    type: W['type']
    config: W['$Config']

    // type utils
    $Widget: W
    $Type: W['type']
    $Config: W['$Config']
    $Serial: W['$Serial']
    $Value: W['$Value']

    LabelExtraUI?: CovariantFC<{ widget: W }> /* 🧮 */
    // Make<X extends IWidget>(type: X['type'], config: X['$Config']): ISpec<X>

    // -----------
    producers: Producer<any, any>[]
    publish<T>(chan: Channel<T> | ChannelId, produce: (self: W['$Widget']) => T): this
    subscribe<T>(chan: Channel<T> | ChannelId, effect: (arg: T, self: W['$Widget']) => void): this

    reactions: { expr: (self: any) => any; effect: (arg: any, self: any) => void }[]
    addReaction<T>(expr: (self: W['$Widget']) => T, effect: (arg: T, self: W['$Widget']) => void): this
}
