import type { Field_number } from '../../csuite/fields/number/FieldNumber'
import type { Field } from '../../csuite/model/Field'
import type { CompiledRenderProps } from './Renderer'
import type { FC, ReactNode } from 'react'

import { WidgetGroup_BlockUI, WidgetGroup_LineUI, WidgetGroupInlineUI } from '../../csuite/fields/group/WidgetGroupUI'
import { WidgetNumberUI } from '../../csuite/fields/number/WidgetNumberUI'
import { QuickForm, type QuickFormProps } from '../catalog/group/QuickForm'
import { H3Title } from '../catalog/Title/H123Title'
import { DefaultWidgetTitleUI, type WidgetTitleProps } from '../catalog/Title/WidgetLabelTextUI'
import { ShellCushyFluidUI, ShellCushyLeftUI, ShellCushyRightUI } from '../shells/ShellCushy'
import { ShellInlineUI } from '../shells/ShellInline'
import { ShellMobileUI } from '../shells/ShellMobile'
import { ShellNoop } from '../shells/ShellNoop'
import { ShellSimpleUI } from '../shells/ShellSimple'

export type WidgetsCatalog = {
    // shells
    Shell: {
        Simple: FC<CompiledRenderProps<Field<any>>>
        Mobile: FC<CompiledRenderProps<Field<any>>>
        Noop: () => ReactNode
        Left: FC<CompiledRenderProps<Field<any>>>
        Right: FC<CompiledRenderProps<Field<any>>>
        FluidUI: FC<CompiledRenderProps<Field<any>>>
        Inline: FC<CompiledRenderProps<Field<any>>>
    }

    Title: {
        h1: FC<WidgetTitleProps>
        h2: FC<WidgetTitleProps>
        h3: FC<WidgetTitleProps>
        h4: FC<WidgetTitleProps>
        default: FC<WidgetTitleProps>
    }

    // quick form system
    QuickForm: (p: QuickFormProps) => JSX.Element

    // fields
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
    Title: {
        h1: H3Title,
        h2: H3Title,
        h3: H3Title,
        h4: H3Title,
        default: DefaultWidgetTitleUI,
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
