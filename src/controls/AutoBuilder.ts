import type { FormBuilder } from './FormBuilder'
import type { Widget_bool } from './widgets/bool/WidgetBool'

import { Widget_enum, type Widget_enum_config } from './widgets/enum/WidgetEnum'
import { Widget_group } from './widgets/group/WidgetGroup'
import { Widget_number } from './widgets/number/WidgetNumber'
import { Widget_prompt } from './widgets/prompt/WidgetPrompt'
import { Widget_string } from './widgets/string/WidgetString'

type AutoWidget<T> = T extends { kind: any; type: infer X }
    ? T['kind'] extends 'number'
        ? Widget_number
        : T['kind'] extends 'string'
        ? Widget_string
        : T['kind'] extends 'boolean'
        ? Widget_bool
        : T['kind'] extends 'prompt'
        ? Widget_prompt
        : T['kind'] extends 'enum'
        ? Widget_enum<T['type']>
        : any
    : any

export type IAutoBuilder = {
    [K in keyof FormHelper]: () => Widget_group<{
        [N in keyof FormHelper[K]]: AutoWidget<FormHelper[K][N]>
    }>
}

export const mkFormAutoBuilder = (form: FormBuilder) => {
    const autoBuilder = new AutoBuilder(form)
    return new Proxy(autoBuilder, {
        get(target, prop, receiver) {
            if (prop in target) {
                // console.log(`[👗] calling builder for known node: ${prop as any}`)
                return (target as any)[prop]
            } else {
                console.log(`[👗] ❌ Unknown property: ${prop as any}`)
            }
        },
    })
}

export interface AutoBuilder extends IAutoBuilder {}
export class AutoBuilder {
    constructor(public form: FormBuilder) {
        const st = form.schema.st
        const schema = st.schema
        for (const node of schema.nodes) {
            Object.defineProperty(this, node.nameInCushy, {
                value: () =>
                    form.group({
                        label: node.nameInComfy,
                        items: () => {
                            const items: any = {}
                            for (const field of node.inputs) {
                                // console.log(
                                //     [
                                //         `[👗] [${field.type}] field ${field.nameInComfy}`,
                                //         `${field.isPrimitive ? 'prim' : undefined}`,
                                //         `${field.isEnum ? 'enum' : undefined}`,
                                //     ]
                                //         .filter(Boolean)
                                //         .join(' '),
                                // )
                                // SANITIZATION --------------------------------------
                                const opts = field.opts
                                if (typeof opts === 'string') {
                                    console.log(`[👗] ❌ invalid field.opts (string, but shouldn't be)`)
                                    continue
                                }
                                // PRIMITIVES ------------------------------------------
                                if (field.isPrimitive) {
                                    const typeLower = field.type.toLowerCase()
                                    // boolean ------------------------------------------
                                    if (typeLower === 'boolean') {
                                        items[field.nameInComfy] = form.bool({
                                            label: field.nameInComfy,
                                        })
                                    }
                                    // number ------------------------------------------
                                    else if (typeLower === 'number') {
                                        // number default -----------
                                        let def: number | undefined = undefined
                                        if (opts?.default != null) {
                                            if (typeof opts.default !== 'number') {
                                                console.log(`[👗] ❌ Invalid default for number: ${opts.default}`)
                                                continue
                                            }
                                            def = opts.default
                                        }
                                        // number value
                                        items[field.nameInComfy] = form.number({
                                            label: field.nameInComfy,
                                        })
                                    }
                                    // int ------------------------------------------
                                    else if (typeLower === 'int') {
                                        // int default -----------
                                        let def: number | undefined = undefined
                                        if (opts?.default != null) {
                                            if (typeof opts.default !== 'number') {
                                                console.log(`[👗] ❌ Invalid default for int: ${opts.default}`)
                                                continue
                                            }
                                            def = opts.default
                                        }
                                        // int field -----------
                                        items[field.nameInComfy] = form.int({
                                            label: field.nameInComfy,
                                            default: def,
                                        })
                                        items[field.nameInComfy] = form.int({
                                            label: field.nameInComfy,
                                        })
                                    } else if (typeLower === 'float') {
                                        // float default -----------
                                        let def: number | undefined = undefined
                                        if (opts?.default != null) {
                                            if (typeof opts.default !== 'number') {
                                                console.log(`[👗] ❌ Invalid default for float: ${opts.default}`)
                                                continue
                                            }
                                            def = opts.default
                                        }
                                        // float field -----------
                                        items[field.nameInComfy] = form.int({
                                            label: field.nameInComfy,
                                            default: def,
                                        })
                                    } else {
                                        console.log(`[👗] ❌ Unknown primitive type: ${typeLower}`)
                                    }
                                }
                                // ENUMS ------------------------------------------
                                else if (field.isEnum) {
                                    console.log(`[👗] 🌈 Enum: ${field.type}`, { field })
                                    const enumFn: Maybe<(p: Widget_enum_config<any>) => void> = (form.enum as any)[field.type]
                                    if (enumFn == null) {
                                        console.log(`[👗] ❌ Unknown enum: ${field.type}`)
                                        continue
                                    }

                                    items[field.nameInComfy] = enumFn({
                                        label: field.nameInComfy,
                                        enumName: field.type,
                                        default: opts?.default,
                                    })
                                } else {
                                    console.log(`[👗] skipping field type: ${field.type}`)
                                }
                            }
                            return items
                        },
                    }),
            })
        }
    }
}

// --------------------------------------------------------------------------
// const x: IAutoBuilder = 0 as any
// const y = x.ADE$_AdjustPEFullStretch()
// const z = x.LoraLoader()

// // --------------------------------------------------------------------------
// export type IAutoBuilderOpt = {
//     [K in keyof Requirable]: (
//         config: Omit<Widget_enum_config<Requirable[K]['$Value']>, 'enumName'> & { startActive?: boolean },
//     ) => Widget_enum<Requirable[K]['$Value']>
// }

// export interface AutoBuilderOpt extends IAutoBuilderOpt {}
// export class AutoBuilderOpt {
//     constructor(public form: FormBuilder) {
//         const st = form.schema.st
//         const schema = st.schema
//         for (const enumName of schema.knownEnumsByName.keys()) {
//             Object.defineProperty(this, enumName, {
//                 value: (config: any) =>
//                     form.optional({
//                         label: config.label,
//                         startActive: config.startActive,
//                         widget: () => new Widget_enum(form, { ...config, enumName }),
//                     }),
//             })
//         }
//     }
// }
