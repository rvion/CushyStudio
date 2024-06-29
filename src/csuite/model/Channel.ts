import type { CovariantFn } from '../variance/BivariantHack'
import type { BaseField } from './BaseField'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'

import { bang } from '../utils/bang'

export type ChannelId = string

export class Channel<T> {
    $type!: T

    get = () => {
        return (self: BaseField): Maybe<T> => self.consume(this)
    }

    getOrThrow = (self: BaseField): T => bang(self.consume(this), 'Empty channel')

    constructor(public id: ChannelId = nanoid()) {
        makeAutoObservable(this)
    }
}

export interface Producer<T, W> {
    chan: Channel<T> | ChannelId
    produce: CovariantFn<W, T>
}
