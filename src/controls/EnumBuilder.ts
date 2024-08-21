/**
 * this module is here to allow performant type-level apis for enums.
 * TODO: document the unique challenges this appraoch is solving
 */
import type { Builder } from './Builder'

import { Field_enum, type Field_enum_config } from '../csuite/fields/enum/FieldEnum'
import { Schema } from './Schema'

export type IEnumBuilderFN<T> = (config?: Omit<Field_enum_config<T>, 'enumName'>) => X.XEnum<T>
export type IEnumBuilder = { [K in keyof Requirable]: IEnumBuilderFN<Requirable[K]['$Value']> }

export interface EnumBuilder extends IEnumBuilder {}
export class EnumBuilder {
    constructor(public domain: Builder) {
        return new Proxy(this, {
            get(target, prop): IEnumBuilderFN<any> {
                // skip symbols
                if (typeof prop === 'symbol') return (target as any)[prop]

                // skip self methods
                if (prop in target) return (target as any)[prop]

                // skip mobx stuff
                if (prop === 'isMobXAtom') return (target as any)[prop]
                if (prop === 'isMobXReaction') return (target as any)[prop]
                if (prop === 'isMobXComputedValue') return (target as any)[prop]

                // retrieve the schema
                const enumName = prop
                const schema = cushy.schema
                const enumSchema = schema.knownEnumsByName.get(enumName)
                if (enumSchema == null) {
                    console.error(`❌ unknown enum: ${enumName}`)
                    return (config: any = {}) =>
                        new Schema(Field_enum<any /* 🔴 */>, /* form, */ { ...config, enumName: 'INVALID_null' })
                    // 🔴 can't throw here, will break for everyone !!
                    // 🔴 throw new Error(`unknown enum: ${enumName}`)
                }

                // return the builder
                return (config: any = {}) => new Schema(Field_enum<any /* 🔴 */>, /* form, */ { ...config, enumName })
            },
        })
    }
}
