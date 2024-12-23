import { produce } from 'immer'

/**
 *
 * before 2024-07-11, every serial had a `type` property
 *  | {"type":"str","value":"🔵"}
 *
 * after 2024-07-11, every serial has a `$` property instead
 *  | {$:"str","value":"🔵"}
 */
export function autofixSerial_20240711(serial: object): object {
   // if serial is from pre-2024-07-11 format
   if ('type' in serial && !('$' in serial)) {
      return produce(serial, (draft) => {
         // convert to post-2024-07-11 format
         // Reflect.set(draft, '$', draft['type'])
         ;(draft as any)['$'] = draft['type']
         delete draft['type']
      })
   }

   return serial
}
