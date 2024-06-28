import type { Widget_enum_config } from '../csuite/fields/enum/WidgetEnum'
import type { FieldConfig } from '../csuite/model/FieldConfig'
import type { Builder } from './Builder'

type AutoWidget<T> = T extends { kind: any; type: infer X }
    ? T['kind'] extends 'number'
        ? X.XNumber
        : T['kind'] extends 'string'
          ? X.XString
          : T['kind'] extends 'boolean'
            ? X.XBool
            : T['kind'] extends 'prompt'
              ? X.XPrompt
              : T['kind'] extends 'enum'
                ? X.XEnum<X>
                : any
    : any

export type IAutoBuilder = {
    [K in keyof FormHelper]: () => X.XGroup<{
        [N in keyof FormHelper[K]]: AutoWidget<FormHelper[K][N]>
    }>
}

export function mkFormAutoBuilder(form: Builder): AutoBuilder {
    const autoBuilder = new AutoBuilder(form)
    return new Proxy(autoBuilder, {
        get(target, prop, receiver) {
            // skip symbols
            if (typeof prop === 'symbol') return (target as any)[prop]

            // skip mobx stuff
            if (prop === 'isMobXAtom') return (target as any)[prop]
            if (prop === 'isMobXReaction') return (target as any)[prop]
            if (prop === 'isMobXComputedValue') return (target as any)[prop]

            // skip public form
            if (prop === 'form') return (target as any)[prop]

            // known custom nodes
            if (prop in target) {
                // console.log(`[👗] calling builder for known node: ${prop as any}`)
                return (target as any)[prop]
            }

            // unknown custom nodes
            else {
                console.log(`[👗] ❌ Unknown property: ${prop as any}`)
                return () => {
                    console.log(`[👗] ❌ Unknown property: ${prop as any}`)
                    return form
                        .markdown({
                            label: prop.toString(),
                            markdown: `❌ missing node '${prop.toString()}'`,
                        })
                        .addRequirements([{ type: 'customNodesByNameInCushy', nodeName: prop.toString() as any }])
                }
            }
        },
    })
}

export interface AutoBuilder extends IAutoBuilder {}
export class AutoBuilder {
    constructor(public formBuilder: Builder) {
        const schema = cushy.schema
        for (const node of schema.nodes) {
            Object.defineProperty(this, node.nameInCushy, {
                value: (ext?: Partial<FieldConfig<{}, any>>) => {
                    const items: any = {}
                    for (const field of node.inputs) {
                        // console.log(`[👗] DEBUG:`, field, field.isPrimitive)
                        // if (field.nameInComfy === 'seed') debugger
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
                                items[field.nameInComfy] = formBuilder.bool({
                                    label: field.nameInComfy,
                                })
                            }
                            // number ------------------------------------------
                            else if (typeLower === 'text' || typeLower === 'string') {
                                // number default -----------
                                let def: string | undefined = undefined
                                let textarea = opts?.multiline ?? undefined

                                if (opts?.default != null) {
                                    if (typeof opts.default !== 'string') {
                                        console.log(`[👗] ❌ Invalid default for number: ${opts.default}`)
                                        continue
                                    }
                                    def = opts.default
                                }
                                // number value
                                items[field.nameInComfy] = formBuilder.string({
                                    label: field.nameInComfy,
                                    default: def,
                                    textarea: textarea,
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
                                items[field.nameInComfy] = formBuilder.number({
                                    label: field.nameInComfy,
                                    default: def,
                                    min: opts?.min ?? undefined,
                                    max: opts?.max ?? undefined,
                                    step: opts?.step ?? undefined,
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
                                items[field.nameInComfy] = formBuilder.int({
                                    label: field.nameInComfy,
                                    default: def,
                                    min: opts?.min ?? undefined,
                                    max: opts?.max ?? undefined,
                                    step: opts?.step ?? undefined,
                                })
                            }
                            // int ------------------------------------------
                            else if (typeLower === 'float') {
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
                                items[field.nameInComfy] = formBuilder.int({
                                    label: field.nameInComfy,
                                    default: def,
                                })
                            } else {
                                console.log(`[👗] ❌ Unknown primitive type: ${typeLower}`)
                            }
                        }
                        // ENUMS ------------------------------------------
                        else if (field.isEnum) {
                            // console.log(`[👗] 🌈 Enum: ${field.type}`, { field })
                            const enumFn: Maybe<(p: Widget_enum_config<any>) => void> = (formBuilder.enum as any)[field.type]
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
                            // console.log(`[👗] skipping field type: ${field.type}`)
                        }
                    }
                    if (Object.keys(items).length === 0) {
                        items['empty'] = formBuilder.markdown({
                            markdown: `❌ node '${node.nameInComfy}' do not have primitive fields`,
                        })
                    }

                    return formBuilder.group({
                        label: ext?.label ?? node.nameInComfy,
                        items,
                    })
                },
            })
        }
    }
}
