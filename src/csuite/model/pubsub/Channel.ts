import type { Field } from '../Field'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'

import { bang } from '../../utils/bang'

export type ChannelId = string

export class Channel<T> {
   $type!: T

   // get() {
   //    return (field: Field): Maybe<T> => field.readChannel(this)
   // }
   readFrom(field: Field): Maybe<T> {
      return field.readChannel(this)
   }

   getOrThrow(field: Field): T {
      return bang(field.readChannel(this), 'Empty channel')
   }

   constructor(public id: ChannelId = nanoid()) {
      makeAutoObservable(this)
   }

   // see src/csuite/utils/potatoClone.ts
   [Symbol.for('🥔')](): this {
      return this
   }
}
