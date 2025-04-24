import type { Field } from '../Field'
import type { Channel, ChannelId } from './Channel'

/**
 * free structure to wrap a subscription
 * before, subscription were just plain reactions in disguise
 * but since 2025-04-03, we now run subscriptions synchronously
 * to allow initialization to complete in a single transaction
 * with some custom infinite loop detection.
 */

export type FieldSubscription<
   //
   FIELD extends Field = Field,
   T extends any = any,
> = {
   channel: Channel<T> | ChannelId
   effect(arg: T, self: FIELD): void
}
