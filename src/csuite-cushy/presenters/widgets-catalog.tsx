import type { Field_number } from '../../csuite/fields/number/FieldNumber'
import type { Field } from '../../csuite/model/Field'
import type { CompiledRenderProps, DisplayConf, RuleOrConf } from './Presenter'
import type { FC, ReactNode } from 'react'

import { WidgetGroup_BlockUI, WidgetGroup_LineUI, WidgetGroupInlineUI } from '../../csuite/fields/group/WidgetGroupUI'
import { WidgetNumberUI } from '../../csuite/fields/number/WidgetNumberUI'
import { QuickForm, type QuickFormProps } from '../catalog/group/QuickForm'
import { ShellCushyFluidUI, ShellCushyLeftUI, ShellCushyRightUI } from '../shells/ShellCushy'
import { ShellInlineUI } from '../shells/ShellInline'
import { ShellMobileUI } from '../shells/ShellMobile'
import { ShellNoop } from '../shells/ShellNoop'
import { ShellSimpleUI } from '../shells/ShellSimple'

export type WidgetsCatalog = {
    Shell: {
        Simple: FC<CompiledRenderProps<Field<any>>>
        Mobile: FC<CompiledRenderProps<Field<any>>>
        Noop: () => ReactNode
        Left: FC<CompiledRenderProps<Field<any>>>
        Right: FC<CompiledRenderProps<Field<any>>>
        FluidUI: FC<CompiledRenderProps<Field<any>>>
        Inline: FC<CompiledRenderProps<Field<any>>>
    }
    QuickForm: (p: QuickFormProps) => JSX.Element
    number: {
        def: FC<{ field: Field_number }>
    }
    group: {
        controls: typeof WidgetGroup_LineUI
        group: typeof WidgetGroup_BlockUI
        inline: typeof WidgetGroupInlineUI
    }
}
export const widgetsCatalog: WidgetsCatalog = {
    Shell: {
        Simple: ShellSimpleUI,
        Mobile: ShellMobileUI,
        Noop: ShellNoop,
        Left: ShellCushyLeftUI,
        Right: ShellCushyRightUI,
        FluidUI: ShellCushyFluidUI,
        Inline: ShellInlineUI,
    },
    QuickForm: QuickForm,
    group: {
        controls: WidgetGroup_LineUI,
        group: WidgetGroup_BlockUI,
        inline: WidgetGroupInlineUI,
    },
    number: {
        def: WidgetNumberUI,
    },
}

export type CatalogVariants<N extends CATALOG.AllFieldTypes> = any

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
    namespace RENDERER {
        interface FieldRenderArgs<out FIELD extends Field> extends DisplayConf<FIELD>{}
        type UIConf<FIELD extends Field> = RuleOrConf<FIELD>

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
