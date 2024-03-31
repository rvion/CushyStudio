/**
 * this module is here to allow performant type-level apis for enums.
 * TODO: document the unique challenges this appraoch is solving
 */
import type { Form, IFormBuilder } from '../Form'
import type { FormBuilder } from '../FormBuilder'

import { Spec } from '../Spec'
import { Widget_enum, Widget_enum_config } from '../widgets/enum/WidgetEnum'

export type IEnumBuilder = {
    [K in keyof Requirable]: (
        config?: Omit<Widget_enum_config<Requirable[K]['$Value']>, 'enumName'>,
    ) => Spec<Widget_enum<Requirable[K]['$Value']>>
}

export type IEnumBuilderOpt = {
    [K in keyof Requirable]: (
        config?: Omit<Widget_enum_config<Requirable[K]['$Value']>, 'enumName'> & { startActive?: boolean },
    ) => Spec<Widget_enum<Requirable[K]['$Value']>>
}

export interface EnumBuilder extends IEnumBuilder {}
export class EnumBuilder {
    constructor(public form: Form) {
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

                // return the builder
                return (config: any = {}) => new Spec('enum', /* form, */ { ...config, enumName })
            },
        })
    }
}

export interface EnumBuilderOpt extends IEnumBuilderOpt {}
export class EnumBuilderOpt {
    constructor(public form: Form<any, FormBuilder>) {
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

                // return the builder
                return (config: any = {}) =>
                    form.builder.optional({
                        label: config.label,
                        startActive: config.startActive,
                        widget: new Spec('enum', /* form, */ { ...config, enumName }),
                    })
            },
        })
    }
}
