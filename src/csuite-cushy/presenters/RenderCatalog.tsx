import type { Field_number } from '../../csuite/fields/number/FieldNumber'
import type { Field_string } from '../../csuite/fields/string/FieldString'
import type { CompiledRenderProps } from './Renderer'
import type { FC } from 'react'

import { WidgetGroup_BlockUI } from '../../csuite/fields/group/WidgetGroup_BlockUI'
import { WidgetGroup_LineUI } from '../../csuite/fields/group/WidgetGroup_Header'
import { WidgetGroup_InlineUI } from '../../csuite/fields/group/WidgetGroup_InlineUI'
import { WidgetNumberUI } from '../../csuite/fields/number/WidgetNumberUI'
import { WidgetString_SmallInput } from '../../csuite/fields/string/WidgetString_SmallInput'
import { WidgetString_summary } from '../../csuite/fields/string/WidgetString_summary'
import { WidgetString_TextareaInput } from '../../csuite/fields/string/WidgetString_TextareaInput'
import { Frame, type FrameProps } from '../../csuite/frame/Frame'
import { type WidgetCardProps, WidgetCardUI } from '../catalog/Decorations/WidgetCardUI'
import { QuickForm, type QuickFormProps } from '../catalog/group/QuickForm'
import { WidgetIndentNoLinesUI } from '../catalog/Indent/IndentNoLine'
import { type WidgetIndentProps, WidgetIndentUI } from '../catalog/Indent/WidgetIndentUI'
import { H1Title, H2Title, H3Title, H4Title } from '../catalog/Title/H123Title'
import { DefaultWidgetTitleUI, type WidgetTitleProps } from '../catalog/Title/WidgetLabelTextUI'
import {
   ShellCushyFluidUI,
   ShellCushyLeftUI,
   ShellCushyList1UI,
   ShellCushyRightUI,
} from '../shells/ShellCushy'
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
      //
      List1: FC<CompiledRenderProps>
   }

   Title: {
      h1: FC<WidgetTitleProps>
      h2: FC<WidgetTitleProps>
      h3: FC<WidgetTitleProps>
      h4: FC<WidgetTitleProps>
      default: FC<WidgetTitleProps>
   }

   Indent: {
      indentWithLiness: FC<WidgetIndentProps>
      indentNoLiness: FC<WidgetIndentProps>
   }

   // quick form system
   QuickForm: (p: QuickFormProps) => JSX.Element

   // fields
   number: {
      def: FC<{ field: Field_number }>
   }

   string: {
      input: FC<{ field: Field_string }>
      summary: FC<{ field: Field_string }>
      textarea: FC<{ field: Field_string }>
   }

   group: {
      controls: typeof WidgetGroup_LineUI
      group: typeof WidgetGroup_BlockUI
      inline: typeof WidgetGroup_InlineUI
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
      //
      List1: ShellCushyList1UI,
   },
   Title: {
      h1: H1Title,
      h2: H2Title,
      h3: H3Title,
      h4: H4Title,
      default: DefaultWidgetTitleUI,
   },
   Indent: {
      indentWithLiness: WidgetIndentNoLinesUI,
      indentNoLiness: WidgetIndentUI,
   },
   QuickForm: QuickForm,
   number: {
      def: WidgetNumberUI,
   },
   string: {
      input: WidgetString_SmallInput,
      summary: WidgetString_summary,
      textarea: WidgetString_TextareaInput,
   },
   group: {
      controls: WidgetGroup_LineUI,
      group: WidgetGroup_BlockUI,
      inline: WidgetGroup_InlineUI,
   },
}
