import { Static, Type } from '@sinclair/typebox'
import { Value, ValueError } from '@sinclair/typebox/value'
import { Either, resultFailure, resultSuccess } from 'src/types/Either'

export const optionalString = (description: string) => Type.Optional(Type.String({ description }))
export const string = (description: string) => Type.String({ description })
