import type { Field_number } from '../../csuite/fields/number/FieldNumber'
import type { Field } from '../../csuite/model/Field'
import type { CompiledRenderProps, DisplayConf } from './Presenter'
import type { FC } from 'react'

import { WidgetNumberUI } from '../../csuite/fields/number/WidgetNumberUI'
import { QuickForm, type QuickFormProps } from '../catalog/group/QuickForm'
import { ShellMobileUI } from '../shells/ShellMobile'
import { ShellNoop } from '../shells/ShellNoop'
import { ShellSimpleUI } from '../shells/ShellSimple'

export const widgetsCatalog: {
    QuickForm: FC<QuickFormProps>
    ShellSimple: FC<CompiledRenderProps>
    ShellMobile: FC<CompiledRenderProps>
    ShellNoop: FC<CompiledRenderProps>
    number: {
        def: FC<{ field: Field_number }>
    }
} = {
    QuickForm: QuickForm,
    ShellSimple: ShellSimpleUI,
    ShellMobile: ShellMobileUI,
    ShellNoop: ShellNoop,
    number: {
        def: WidgetNumberUI,
    },
}

export type WidgetsCatalog = typeof widgetsCatalog

export type CatalogVariants<N extends CATALOG.AllFieldTypes> = any

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
    namespace RENDERER {
        interface FieldRenderArgs<out FIELD extends Field>
        extends DisplayConf<FIELD>{}
    }

    interface Window {
        RENDERER: {
            Render: FC<{ field: Field; p: RENDERER.FieldRenderArgs<any> }>
        }
    }

    namespace CATALOG {
        type variants = { [k in AllFieldTypes]: CatalogVariants<k> }
        type widgets = WidgetsCatalog
        /** closed union to help typescript proove variance by checking all branches */
        type AllFieldTypes =
            | 'optional'
            | 'str'
            | 'group'
            | 'selectOne'
            | 'selectMany'
            | 'bool'
            | 'button'
            | 'choices'
            | 'color'
            | 'custom'
            | 'date'
            | 'date'
            | 'plaindate'
            | 'datetimezoned'
            | 'enum'
            | 'image'
            | 'link'
            | 'list'
            | 'markdown'
            | 'matrix'
            | 'number'
            | 'orbit'
            | 'seed'
            | 'shared'
            | 'size'
            | 'prompt'
    }
}

// import type { WidgetProps } from './Renderer.types'

// satisfies {
//     [Ty in CATALOG.AllFieldTypes]?: any // Record<string, CovariantFC<WidgetProps<any>>> // 🔴 CoveriantFC is wrong, but to be correct we would need to map Ty to the corresponding field -> annoying
// }

// import type { WidgetProps } from './Renderer.types'

// import { WidgetGroupLoco } from 'src/csuite-loco/fields/group/WidgetGroupLoco'
// import {
//    WidgetOptionalLoco,
//    WidgetOptionalLocoChild,
//    WidgetOptionalLocoParent,
// } from 'src/csuite-loco/fields/optional/WidgetOptionalLoco'
// import { WidgetSelectOne_SelectUI } from 'src/csuite-loco/fields/selectOne/WidgetSelectOne_SelectUI'
// import {
//    type CovariantFC,
//    WidgetGroup_BlockUI,
//    WidgetString_HeaderUI,
//    WidgetString_TextareaBodyUI,
// } from 'src/cushy-forms/main'

// import { WidgetChoicesLoco } from '../fields/choices/WidgetChoicesLoco'
// import type { ReactNode } from 'react'

// type A = Parameters<Catalog['Field_select']['rsuite']>[0]
// type VariantPropsDict<T extends { [k: string]: (p: any) => any }> = {
//     [k in keyof T]?: Omit<Parameters<T[k]>[0], 'field'>
// }

// type C = ParamDict<Catalog['Field_select']>
// export type CatalogVariants<N extends CATALOG.AllFieldTypes> = N extends keyof WidgetsCatalog
//     ?
//           | (VariantPropsDict<WidgetsCatalog[N]> & { name?: keyof WidgetsCatalog[N] } & UsualWidgetProps & UsualWrapperProps)
//           | keyof WidgetsCatalog[N]
//           // ex: ui => <div>foo</div>
//           // TODO: ui => <ui.Rsuite rsuiteSelectProps={{ appearance: 'subtle'}} />
//           | ((ui: any) => ReactNode)
//     :
//           | ({ name?: '❌ NO CATALOG FOR THIS FIELD TYPE' } & UsualWidgetProps & UsualWrapperProps)
//           | '❌ NO CATALOG FOR THIS FIELD TYPE'

// type E = CatalogParams<'Field_select'>
// type F = CatalogParams<'group'>

// prettier-ignore
//   type RendererConfig =
//       & RendererArgsWidgets
//       & UsualWrapperProps
//       & UsualWidgetProps
