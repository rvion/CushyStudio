/**
 * this module is here to allow performant type-level apis for enums.
 * TODO: document the unique challenges this appraoch is solving
 */

import type { Field_selectMany_config_ } from '../csuite/fields/selectMany/FieldSelectMany'
import type { Builder } from '../CUSHY'

export type IEnumListBuilderFn<T extends string> = (config?: Omit<Field_selectMany_config_<T>, 'choices'>) => X.XSelectMany_<T>
export type IEnumListBuilder = {
    [K in keyof Requirable]: IEnumListBuilderFn<Requirable[K]['$Value'] & string>
}

export interface EnumListBuilder extends IEnumListBuilder {}
export class EnumListBuilder {
    constructor(public domain: Builder) {
        return new Proxy(this, {
            get(target, prop): IEnumListBuilderFn<any> {
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
                if (enumSchema == null) { throw new Error(`unknown enum: ${enumName}`); } // prettier-ignore

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
