import type { CovariantFn } from '../variance/BivariantHack'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'

export type ChannelId = string

export class Channel<T> {
    $type!: T

    constructor(public id: ChannelId = nanoid()) {
        makeAutoObservable(this)
    }
}

export interface Producer<T, W> {
    chan: Channel<T> | ChannelId
    produce: CovariantFn<W, T>
}
