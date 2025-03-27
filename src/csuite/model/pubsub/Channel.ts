import type { Field } from '../Field'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'

import { bang } from '../../utils/bang'

export type ChannelOrChannelId<T> = Channel<T> | ChannelId
export type ChannelId = string
export interface Channel<T> {
   ['…type']: T
}

export class Channel<T> {
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
