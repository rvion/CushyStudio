import type { Field } from '../Field'
import type { Channel, ChannelId } from '../pubsub/Channel'

import { Field_shared } from '../../fields/shared/FieldShared'
import { CSchema } from '../CSchema'
import { defineSchemaBuilderMixin } from './defineSchemaBuilderMixin'

export type BuilderSharedMixin = {
   linkedFromExternalField<T extends Field>(field: T): Z.Shared<T>
   linkedFromChannel<T extends Field>(channel: Channel<T>, schema: Z.Schema<T>): Z.Shared<T>
   linkedFromChannelId<T extends Field>(channelId: ChannelId, schema: Z.Schema<T>): Z.Shared<T>
   linkedFromCustom<T extends Field>(field: (self: Field_shared<T>) => T, schema: Z.Schema<T>): Z.Shared<T>
   linkedFromSharedUID<T extends Field>(uid: string, schema: Z.Schema<T>): Z.Shared<T>
}

const BuilderSharedImpl = (): BuilderSharedMixin =>
   defineSchemaBuilderMixin<BuilderSharedMixin>({
      /**
       * sometimes you have a field from an other document already instanciated
       * or you using a link within a dynamic, and already have access to the field
       */
      linkedFromExternalField<T extends Field>(field: T): Z.Shared<T> {
         return CSchema.new(Field_shared<T>, { field: () => field, schema: field.ϟschema })
      },
      /** sometimes, you just want to get the filed from a chanel */
      linkedFromChannel<T extends Field>(channel: Channel<T>, schema: Z.Schema<T>): Z.Shared<T> {
         return CSchema.new(Field_shared<T>, { field: (f) => f.ϟreadChannel(channel), schema })
      },
      /** ...and sometimes you're so lazy you don't even bother to type it properly */
      linkedFromChannelId<T extends Field>(channelId: ChannelId, schema: Z.Schema<T>): Z.Shared<T> {
         return CSchema.new(Field_shared<T>, { field: (f) => f.ϟreadChannel(channelId), schema })
      },
      /** sometimes, you just want to specify how to retrieve it manually */
      linkedFromCustom<T extends Field>(
         field: (self: Field_shared<T>) => T,
         schema: Z.Schema<T>,
      ): Z.Shared<T> {
         return CSchema.new(Field_shared<T>, { field, schema })
      },

      /**
       * E. `linkedFromSharedUID`
       * and sometimes you want to see the world burn
       * this one is very VERY VEEEERY experimental (not to say broken)
       * not quite sure where to store the serial yet.
       *
       * option1:
       *    💡 the serial is stored in the first `linkedFromSharedUID` that will be instanciated.
       *    🔶 only work if the first is stable => does not work if all linked fields are within choices
       *
       * option2:
       *    💡 serial is stored in the root ? somewhere in some undocumented `serial.shared` ?
       *    🔶 will work badly with `.clone()`
       *    🔶 very non-standard
       *
       *
       * option3:
       *    💡 serial is discarded ?
       *    🔶 lol, loosing people data never that great; or rename it to `linkThatLooseData`
       *    🔶   actually, could be fun to add anyway.
       *
       * option4:
       *    💡 this just injects a onChange callback that sync it's serial with the other 3 fields.
       *    🔶 need to avoid loops
       *    🔶 duplicated data
       *        => allow to later fork those 🤔
       *    if we do that, it should be on `Field` class directly, using `isValueEqual`
       *
       * --------------------
       * I picked option 2 🤔
       */
      linkedFromSharedUID<T extends Field>(uid: string, schema: Z.Schema<T>): Z.Shared<T> {
         return CSchema.new(Field_shared<T>, {
            field: (f) => {
               // 1. get root
               const root = f.ϟroot

               // 2. get unique key
               const key = Symbol.for(uid)

               // 3 if field already exists, return it
               if (key in root) return root[key] as T

               // 4.1 create it,
               const prevSerial = root.ϟserial._shared?.[uid]
               const field: T = schema.create(prevSerial)
               // 4.2. store it on root
               ;(root as any)[key] = field
               // 4.2. add a new change callback to keep its serial synced
               field.ϟonSerialChanges((x: Field) => {
                  root.ϟpatchInTransaction((rootNext) => {
                     rootNext._shared ??= {}
                     rootNext._shared[uid] = x.ϟserial
                  })
               })
               return field
            },
            schema,
         })
      },
   })

export const BuilderSharedDescriptors = Object.getOwnPropertyDescriptors(BuilderSharedImpl())
