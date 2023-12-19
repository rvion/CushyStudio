import { Type } from '@sinclair/typebox'

export const optionalString = (description: string) => Type.Optional(Type.String({ description }))
export const string = (description: string) => Type.String({ description })
