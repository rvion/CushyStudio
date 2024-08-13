import type { Field_selectMany_config } from '../csuite/fields/selectMany/FieldSelectMany'
import type { BaseSelectEntry } from '../csuite/fields/selectOne/FieldSelectOne'
/**
 * this module is here to allow performant type-level apis for enums.
 * TODO: document the unique challenges this appraoch is solving
 */
import type { Builder } from './Builder'

import { Field_enum, type Field_enum_config } from '../csuite/fields/enum/FieldEnum'
import { Schema } from './Schema'

export type IEnumBuilder = {
    [K in keyof Requirable]: (
        config?: Omit<Field_enum_config<Requirable[K]['$Value']>, 'enumName'>,
    ) => X.XEnum<Requirable[K]['$Value']>
}

export type IEnumBuilderOpt = {
    [K in keyof Requirable]: (
        config?: Omit<Field_enum_config<Requirable[K]['$Value']>, 'enumName'> & { startActive?: boolean },
    ) => X.XOptional<X.XEnum<Requirable[K]['$Value']>>
}

export interface EnumBuilder extends IEnumBuilder {}
export class EnumBuilder {
    constructor(public domain: Builder) {
        return new Proxy(this, {
            get(target, prop) {
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

export interface EnumBuilderOpt extends IEnumBuilderOpt {}
export class EnumBuilderOpt {
    constructor(public domain: Builder) {
        return new Proxy(this, {
            get(target, prop) {
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

export type IEnumListBuilder = {
    [K in keyof Requirable]: (
        config?: Omit<Field_selectMany_config<BaseSelectEntry<Requirable[K]['$Value'] & string>>, 'choices'>,
    ) => X.XSelectMany<BaseSelectEntry<Requirable[K]['$Value'] & string>>
}

export interface EnumListBuilder extends IEnumListBuilder {}
export class EnumListBuilder {
    constructor(public domain: Builder) {
        return new Proxy(this, {
            get(target, prop) {
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
                if (enumSchema == null) { throw new Error(`unknown enum: ${enumName}`) } // prettier-ignore

                // return (config: any = {}) => form.builder.bool()
                // return the builder
                return (config: any = {}) =>
                    domain.selectMany({
                        choices: enumSchema.values.map((v) => ({ id: v.toString(), label: v })),
                        appearance: 'tab',
                        ...config,
                    })
            },
        })
    }
}
