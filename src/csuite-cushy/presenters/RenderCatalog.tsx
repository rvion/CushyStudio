import type { Field_number } from '../../csuite/fields/number/FieldNumber'
import type { WidgetLabelTextProps } from '../../csuite/form/WidgetLabelTextUI'
import type { Field } from '../../csuite/model/Field'
import type { CompiledRenderProps } from './Renderer'
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

    LabelText: {
        h3: FC<WidgetLabelTextProps>
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
const H3Title = ({ field, ...rest }: WidgetLabelTextProps): JSX.Element => (
    <h3 className={rest.className}>
        🟢 {rest.children} {Object.keys({ ...rest })}
    </h3>
)

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
    LabelText: {
        h3: H3Title,
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
