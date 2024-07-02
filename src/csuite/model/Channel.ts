import type { CovariantFn1 } from '../variance/BivariantHack'
import type { Field } from './Field'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'

import { bang } from '../utils/bang'

export type ChannelId = string

export class Channel<T> {
    $type!: T

    get = () => {
        return (self: Field): Maybe<T> => self.consume(this)
    }

    getOrThrow = (self: Field): T => bang(self.consume(this), 'Empty channel')

    constructor(public id: ChannelId = nanoid()) {
        makeAutoObservable(this)
    }
}

export interface Producer<T, W> {
    chan: Channel<T> | ChannelId
    produce: CovariantFn1<W, T>
}
