import type { FormBuilder } from './FormBuilder'
import type { Widget_bool } from './widgets/bool/WidgetBool'

import { Widget_enum } from './widgets/enum/WidgetEnum'
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

export interface AutoBuilder extends IAutoBuilder {}
export class AutoBuilder {
    constructor(public form: FormBuilder) {
        const st = form.schema.st
        const schema = st.schema
        for (const enumName of schema.knownEnumsByName.keys()) {
            Object.defineProperty(this, enumName, {
                value: (config: any) => new Widget_enum(form, { ...config, enumName }),
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
