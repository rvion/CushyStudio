import type { Channel, ChannelId } from './Channel'

export interface Publication<T, F> {
   chan: Channel<T> | ChannelId
   /** true: broadcast upwards; false only retain locally */
   hoist: boolean
   produce(field: F): T
}
