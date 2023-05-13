import { nanoid } from 'nanoid'

export type PayloadID = string

// let nextPayloadID: PayloadID = 1

export const getPayloadID = (): PayloadID => nanoid()
