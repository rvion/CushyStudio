import type { CovariantFn1 } from '../../variance/BivariantHack'
import type { Channel, ChannelId } from './Channel'

export interface Producer<T, W> {
   chan: Channel<T> | ChannelId
   produce: CovariantFn1<W, T>
}
