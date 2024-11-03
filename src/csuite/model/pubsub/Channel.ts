import type { Field } from '../Field'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'

import { bang } from '../../utils/bang'

export type ChannelId = string

export class Channel<T> {
   $type!: T

   get() {
      return (field: Field): Maybe<T> => field.consume(this)
   }

   getOrThrow(field: Field): T {
      return bang(field.consume(this), 'Empty channel')
   }

   id: ChannelId = nanoid()

   constructor() {
      makeAutoObservable(this)
   }

   // see src/csuite/utils/potatoClone.ts
   [Symbol.for('🥔')](): this {
      return this
   }
}
