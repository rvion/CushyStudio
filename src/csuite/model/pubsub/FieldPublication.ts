import type { Field } from '../Field'
import type { FieldEvent_ } from '../FieldEvent'
import type { Channel, ChannelId } from './Channel'

export interface FieldPublication<PAYLOAD, FIELD extends Field = any> {
   /** chanel to which you awnt to publish */
   chan: Channel<PAYLOAD> | ChannelId

   /** the lambda that will be called to produce the values */
   produce(field: FIELD): PAYLOAD

   /**
    * how much "upwards" you want to broadcast
    *
    * boolean:
    *    - false  => only local (so to all children) (equivalent to 0)
    *    - true   => all the way up to the root      (equivalent to Infinity)
    *
    * number:
    *    - 0 => only local (so to all children)
    *    - 1 => only to direct parent (so to parent and all siblings)
    *    - 2 => only up to parent's parent
    *    - ...
    *    - Infinity => all the way up to the root (so to everyone in the document)
    * */
   hoist: boolean | number

   /** when to publish the values */
   on: FieldEvent_

   /**
    * if set to true, will only publish when the field is valid
    * at the moment the publication runs
    */
   onlyIfValid?: boolean

   /**
    * if set to true, will only publish when the field is set
    * at the moment the publication runs
    */
   onlyIfSet?: boolean

   /**
    * if set to true, will only publish when the field is ownSet
    * at the moment the publication runs
    */
   onlyIfOwnSet?: boolean
}
