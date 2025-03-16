import type { ComfyUnionValue } from '../comfyui/comfyui-types'
import type { Field_enum } from '../csuite/fields/enum/FieldEnum'
import type { Field_string_config } from '../csuite/fields/string/FieldString'
import type { FieldConfig_CommonProperties } from '../csuite/model/FieldConfig'
import type { CushySchemaBuilder } from './CushyBuilder'

type KK = IAutoBuilder['KSampler']

type FOO = Comfy.FormHelper['KSampler']['sampler_name']

type AutoWidget<T> = T extends { kind: any; type: infer TPE }
   ? T['kind'] extends 'number'
      ? Z.Number
      : T['kind'] extends 'string'
        ? Z.String
        : T['kind'] extends 'boolean'
          ? Z.Bool
          : T['kind'] extends 'prompt'
            ? Z.Prompt
            : T['kind'] extends 'enum'
              ? // check perf implications here
                //         VVV
                T['type'] extends ComfyUnionValue
                 ? Z.EnumOf<T['type']>
                 : never
              : any
   : any

export type IAutoBuilder = {
   [K in keyof Comfy.FormHelper]: () => Z.Group<{
      [N in keyof Comfy.FormHelper[K]]: AutoWidget<Comfy.FormHelper[K][N]>
   }>
}

// 🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴 SLOW HERE; MUST USE PROXY
export function mkFormAutoBuilder(form: CushySchemaBuilder): AutoBuilder {
   const autoBuilder = new AutoBuilder(form)
   return new Proxy(autoBuilder, {
      get(target, prop, receiver): any /* 🔴 */ {
         // skip symbols
         if (typeof prop === 'symbol') return (target as any)[prop]

         // skip mobx stuff
         if (prop === 'isMobXAtom') return (target as any)[prop]
         if (prop === 'isMobXReaction') return (target as any)[prop]
         if (prop === 'isMobXComputedValue') return (target as any)[prop]

         // skip public form
         // 🔴 ⁉️ REVIEW THIS LINE 👇
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
   constructor(public formBuilder: CushySchemaBuilder) {
      const schema = cushy.schema
      for (const node of schema.nodes) {
         Object.defineProperty(this, node.nameInCushy, {
            value: (ext?: Partial<FieldConfig_CommonProperties<any>>) => {
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
                     const typeLower = field.typeName.toLowerCase()
                     // #region boolean
                     if (typeLower === 'boolean') {
                        items[field.nameInComfy] = formBuilder.bool({
                           label: field.nameInComfy,
                        })
                     }
                     // #region text & string
                     else if (typeLower === 'text' || typeLower === 'string') {
                        // number default -----------
                        const textarea = opts?.multiline ?? undefined
                        const conf: Field_string_config = {
                           label: field.nameInComfy,
                           textarea: textarea,
                        }

                        if (opts?.default != null) {
                           if (typeof opts.default !== 'string') {
                              console.log(`[👗] ❌ Invalid default for number: ${opts.default}`)
                              continue
                           }
                           conf.default = opts.default
                        }
                        // number value
                        items[field.nameInComfy] = formBuilder.string(conf)
                     }
                     // #region number
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
                     // #region int
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
                     // #region float
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
                        items[field.nameInComfy] = formBuilder.float({
                           label: field.nameInComfy,
                           default: def,
                           min: opts?.min ?? undefined,
                           max: opts?.max ?? undefined,
                           step: opts?.step ?? undefined,
                        })
                     } else {
                        console.log(`[👗] ❌ Unknown primitive type: ${typeLower}`)
                     }
                  }
                  // #region enums
                  else if (field.isEnum) {
                     // console.log(`[👗] 🌈 Enum: ${field.type}`, { field })
                     const enumFn: Maybe<(p: Field_enum<any>['$config']) => void> = (formBuilder.enum as any)[
                        field.slotName
                     ]
                     if (enumFn == null) {
                        console.log(`[👗] ❌ Unknown enum: ${field.typeName}`)
                        continue
                     }

                     const possibleValues = schema.knownUnionBySlotName.get(field.slotName)?.values ?? []
                     items[field.nameInComfy] = enumFn({
                        label: field.nameInComfy,
                        slotName: field.slotName,
                        default: opts?.default ?? possibleValues[0],
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
