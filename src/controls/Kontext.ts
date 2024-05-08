import type { CovariantFn } from './BivariantHack'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'

export class Kontext<T /* W=any */> {
    $type!: T
    uid = nanoid()
    constructor() {
        makeAutoObservable(this)
    }
}
export interface BoundKontext<W, T> {
    ktx: Kontext<T /* ,W */>
    fn: CovariantFn<W, T>
}
