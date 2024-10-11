import type { Field_number } from '../../csuite/fields/number/FieldNumber'
import type { CompiledRenderProps } from './Renderer'
import type { FC } from 'react'

import { WidgetGroup_BlockUI, WidgetGroup_LineUI, WidgetGroupInlineUI } from '../../csuite/fields/group/WidgetGroupUI'
import { WidgetNumberUI } from '../../csuite/fields/number/WidgetNumberUI'
import { Frame, type FrameProps } from '../../csuite/frame/Frame'
import { type WidgetCardProps, WidgetCardUI } from '../catalog/Decorations/WidgetCardUI'
import { QuickForm, type QuickFormProps } from '../catalog/group/QuickForm'
import { H1Title, H2Title, H3Title, H4Title } from '../catalog/Title/H123Title'
import { DefaultWidgetTitleUI, type WidgetTitleProps } from '../catalog/Title/WidgetLabelTextUI'
import { ShellCushyFluidUI, ShellCushyLeftUI, ShellCushyRightUI } from '../shells/ShellCushy'
import { ShellInlineUI } from '../shells/ShellInline'
import { ShellMobileUI } from '../shells/ShellMobile'
import { ShellNoop } from '../shells/ShellNoop'
import { ShellSimpleUI } from '../shells/ShellSimple'

export type WidgetsCatalog = {
    Misc: {
        Frame: FC<FrameProps>
    }
    Decorations: {
        Card: FC<WidgetCardProps>
    }
    // shells
    Shell: {
        Noop: FC<CompiledRenderProps>
        Simple: FC<CompiledRenderProps>
        Mobile: FC<CompiledRenderProps>
        Left: FC<CompiledRenderProps>
        Right: FC<CompiledRenderProps>
        FluidUI: FC<CompiledRenderProps>
        Inline: FC<CompiledRenderProps>
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
    Decorations: {
        Card: WidgetCardUI,
    },
    Misc: {
        Frame: Frame,
    },
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
        h1: H1Title,
        h2: H2Title,
        h3: H3Title,
        h4: H4Title,
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
