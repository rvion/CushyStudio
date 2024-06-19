import type { Widget_enum_config } from '../../controls/fields/enum/WidgetEnum'
import type { Widget_selectMany_config } from '../../controls/fields/selectMany/WidgetSelectMany'
import type { BaseSelectEntry } from '../../controls/fields/selectOne/WidgetSelectOne'
import type { FormBuilder } from '../../controls/FormBuilder'
import type { IBlueprint } from '../../controls/IBlueprint'
/**
 * this module is here to allow performant type-level apis for enums.
 * TODO: document the unique challenges this appraoch is solving
 */
import type { Model } from '../../controls/Model'

import { Blueprint } from '../../controls/Blueprint'

export type IEnumBuilder = {
    [K in keyof Requirable]: (
        config?: Omit<Widget_enum_config<Requirable[K]['$Value']>, 'enumName'>,
    ) => X.XEnum<Requirable[K]['$Value']>
}

export type IEnumBuilderOpt = {
    [K in keyof Requirable]: (
        config?: Omit<Widget_enum_config<Requirable[K]['$Value']>, 'enumName'> & { startActive?: boolean },
    ) => X.XOptional<X.XEnum<Requirable[K]['$Value']>>
}

export interface EnumBuilder extends IEnumBuilder {}
export class EnumBuilder {
    constructor(public form: Model<IBlueprint, FormBuilder>) {
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
                    return (config: any = {}) => new Blueprint('enum', /* form, */ { ...config, enumName: 'INVALID_null' })
                    // 🔴 can't throw here, will break for everyone !!
                    // 🔴 throw new Error(`unknown enum: ${enumName}`)
                }

                // return the builder
                return (config: any = {}) => new Blueprint('enum', /* form, */ { ...config, enumName })
            },
        })
    }
}

export interface EnumBuilderOpt extends IEnumBuilderOpt {}
export class EnumBuilderOpt {
    constructor(public form: Model<any, FormBuilder>) {
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
                        form.builder.optional({
                            label: config.label,
                            startActive: config.startActive,
                            widget: new Blueprint('enum', /* form, */ { ...config, enumName: 'INVALID_null' }),
                        })
                    // 🔴 can't throw here, will break for everyone !!
                    // throw new Error(`unknown enum: ${enumName}`)
                }

                // return the builder
                return (config: any = {}) =>
                    form.builder.optional({
                        label: config.label,
                        startActive: config.startActive,
                        widget: new Blueprint('enum', /* form, */ { ...config, enumName }),
                    })
            },
        })
    }
}

export type IEnumListBuilder = {
    [K in keyof Requirable]: (
        config?: Omit<Widget_selectMany_config<BaseSelectEntry<Requirable[K]['$Value'] & string>>, 'choices'>,
    ) => X.XSelectMany<BaseSelectEntry<Requirable[K]['$Value'] & string>>
}

export interface EnumListBuilder extends IEnumListBuilder {}
export class EnumListBuilder {
    constructor(public form: Model<any, FormBuilder>) {
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
                    form.builder.selectMany({
                        choices: enumSchema.values.map((v) => ({ id: v.toString(), label: v })),
                        appearance: 'tab',
                        ...config,
                    })
            },
        })
    }
}
