/**
 * this module is here to allow performant type-level apis for enums.
 * TODO: document the unique challenges this appraoch is solving
 */
import type { Builder } from './Builder'

import { Field_enum, type Field_enum_config } from '../csuite/fields/enum/FieldEnum'
import { Schema } from './Schema'

// 🔴 showcase how nullability work without optional

export type IEnumBuilderOptFn<T> = (
    config?: Omit<Field_enum_config<T>, 'enumName'> & { startActive?: boolean },
) => X.XOptional<X.XEnum<T>>
export type IEnumBuilderOpt = {
    [K in keyof Requirable]: IEnumBuilderOptFn<Requirable[K]['$Value']>
}

export interface EnumBuilderOpt extends IEnumBuilderOpt {}
export class EnumBuilderOpt {
    constructor(public domain: Builder) {
        return new Proxy(this, {
            get(target, prop): IEnumBuilderOptFn<any> {
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
                        domain.optional({
                            label: config.label,
                            startActive: config.startActive,
                            schema: new Schema(Field_enum<any /* 🔴 */>, { ...config, enumName: 'INVALID_null' }),
                        })
                    // 🔴 can't throw here, will break for everyone !!
                    // throw new Error(`unknown enum: ${enumName}`)
                }

                // return the builder
                return (config: any = {}) =>
                    domain.optional({
                        label: config.label,
                        startActive: config.startActive,
                        schema: new Schema(Field_enum<any /* 🔴 */>, { ...config, enumName }),
                    })
            },
        })
    }
}
