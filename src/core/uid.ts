import { getYjsValue } from '@syncedstore/core'
import { Branded } from 'src/utils/types'
import type { ID } from 'yjs'

export type WithID<T> = Branded<T, 'UID'>

export const getID = <T>(t: WithID<T>): ID => {
    const id = getYjsValue(t)!._item?.id
    if (id == null) throw new Error('no id available')
    return id
}
