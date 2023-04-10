export type PayloadID = number

let nextPayloadID: PayloadID = 1

export const getPayloadID = (): PayloadID => nextPayloadID++
