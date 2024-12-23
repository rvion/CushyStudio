import * as v from 'valibot'

/**
 * manually checked on: ❌ // TODO
 */
export type ComfyManagerAPIFetchPolicy =
   /** DB: Channel (1day cache)' */
   | 'cache'
   /** text: 'DB: Local' */
   | 'local'
   /** DB: Channel (remote) */
   | 'url'

// #region valibot
export const ComfyManagerAPIFetchPolicy_valibot = v.union([
   v.literal('cache'),
   v.literal('local'),
   v.literal('url'),
])
