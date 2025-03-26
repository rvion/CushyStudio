import { Button } from '../../csuite/button/Button'
import { InputBoolCheckboxUI } from '../../csuite/checkbox/InputBoolCheckboxUI'
import { InputBoolUI } from '../../csuite/checkbox/InputBoolUI'
import { WidgetBoolUI } from '../../csuite/fields/bool/WidgetBoolUI'
import { WidgetChoices_BodyUI } from '../../csuite/fields/choices/WidgetChoices_BodyUI'
import { WidgetChoices_HeaderButtonsUI } from '../../csuite/fields/choices/WidgetChoices_HeaderButtonsUI'
import { WidgetChoices_HeaderSelectUI } from '../../csuite/fields/choices/WidgetChoices_HeaderSelectUI'
import { WidgetChoices_HeaderTabBarUI } from '../../csuite/fields/choices/WidgetChoices_HeaderTabBarUI'
import { WidgetChoices_HeaderUI } from '../../csuite/fields/choices/WidgetChoices_HeaderUI'
import { WidgetEnum_SelectUI } from '../../csuite/fields/enum/WidgetEnum_SelectUI'
import { WidgetEnum_TabUI } from '../../csuite/fields/enum/WidgetEnum_TabUI'
import { WidgetEnumUI } from '../../csuite/fields/enum/WidgetEnumUI'
import { WidgetGroup_BlockUI } from '../../csuite/fields/group/WidgetGroup_BlockUI'
import { WidgetGroup_LineUI } from '../../csuite/fields/group/WidgetGroup_Header'
import { WidgetGroup_InlineUI } from '../../csuite/fields/group/WidgetGroup_InlineUI'
import { WidgetGroup_TabUI } from '../../csuite/fields/group/WidgetGroup_TabUI'
import { BlenderListUI } from '../../csuite/fields/list/BlenderListUI'
import { WidgetList_BodyUI } from '../../csuite/fields/list/WidgetList_BodyUI'
import { WidgetList_LineUI } from '../../csuite/fields/list/WidgetList_LineUI'
import { WidgetNumberSimpleUI } from '../../csuite/fields/number/WidgetNumberSimpleUI'
import { WidgetNumberUI } from '../../csuite/fields/number/WidgetNumberUI'
import { WidgetSelectManyUI } from '../../csuite/fields/selectMany/WidgetSelectManyUI'
import { WidgetSelectOneUI } from '../../csuite/fields/selectOne/WidgetSelectOneUI'
import { WigetSize_BlockUI } from '../../csuite/fields/size/WigetSize_BlockUI'
import { WigetSize_LineUI } from '../../csuite/fields/size/WigetSize_LineUI'
import { WidgetString_MarkdownUI } from '../../csuite/fields/string/WidgetString_Markdown'
import { WidgetString_SmallInput } from '../../csuite/fields/string/WidgetString_SmallInput'
import { WidgetString_summary } from '../../csuite/fields/string/WidgetString_summary'
import { WidgetString_TextareaInput } from '../../csuite/fields/string/WidgetString_TextareaInput'
import { type WidgetLabelCaretProps, WidgetLabelCaretUI } from '../../csuite/form/WidgetLabelCaretUI'
import { WidgetLabelIconPlacholderUI, WidgetLabelIconUI } from '../../csuite/form/WidgetLabelIconUI'
import { Frame } from '../../csuite/frame/Frame'
import { IkonOf } from '../../csuite/icons/iconHelpers'
import { MessageErrorUI } from '../../csuite/messages/MessageErrorUI'
import { MessageInfoUI } from '../../csuite/messages/MessageInfoUI'
import { MessageWarningUI } from '../../csuite/messages/MessageWarningUI'
import { ResizableFrame } from '../../csuite/resizableFrame/resizableFrameUI'
import { exhaust } from '../../csuite/utils/exhaust'
import { WidgetPromptCollapsibleUI } from '../../prompt/widgets/WidgetPromptCollapsibleUI'
import { WidgetPromptUI } from '../../prompt/widgets/WidgetPromptUI'
import { ColoredMarginUI } from '../catalog/Decorations/ColoredMarginUI'
import { WidgetCardUI } from '../catalog/Decorations/WidgetCardUI'
import { WidgetPadUI } from '../catalog/Decorations/WidgetPadUI'
import { WidgetIndentNoLinesUI } from '../catalog/Indent/IndentNoLine'
import { WidgetIndentUI } from '../catalog/Indent/WidgetIndentUI'
import { H1Title, H2Title, H3Title, H4Title } from '../catalog/Title/H123Title'
import { DefaultWidgetTitleUI } from '../catalog/Title/WidgetLabelTextUI'
import { ShellBodyOnlyUI } from '../shells/ShellBodyOnlyUI'
import {
   ShellCushyFluidUI,
   ShellCushyLeftUI,
   ShellCushyList1UI,
   ShellCushyRightUI,
} from '../shells/ShellCushy'
import { ShellHeaderOnlyUI } from '../shells/ShellHeaderOnlyUI'
import { ShellInlineUI } from '../shells/ShellInline'
import { ShellMobileUI } from '../shells/ShellMobile'
import { ShellNoop } from '../shells/ShellNoop'
import { ShellSimpleUI } from '../shells/ShellSimple'

// #region misc
const catalog_wrappers = {
   ColoredPadding: ColoredMarginUI,
   Card: WidgetCardUI,
   Pad: WidgetPadUI,
}

const catalog_icons = {
   IkonOf: IkonOf,
}

const catalog_message = {
   Error: MessageErrorUI,
   Info: MessageInfoUI,
   Warning: MessageWarningUI,
}

const catalog_caret = {
   Caret: WidgetLabelCaretUI,
   CaretWithPlaceholder: (p: WidgetLabelCaretProps) => <WidgetLabelCaretUI {...p} placeholder />,
}

const catalog_misc = {
   Frame: Frame,
   Button: Button,
   Checkbox: InputBoolCheckboxUI,
   ResizableFrame: ResizableFrame,
   Caret: WidgetLabelCaretUI,
   Icon: WidgetLabelIconPlacholderUI,
   Icon_: WidgetLabelIconUI,
}

const catalog_Title = {
   h1: H1Title,
   h2: H2Title,
   h3: H3Title,
   h4: H4Title,
   default: DefaultWidgetTitleUI,
}

const catalog_Indent = {
   indentWithLiness: WidgetIndentNoLinesUI,
   indentNoLiness: WidgetIndentUI,
}
// #region inputs

const catalog_inputs = {
   InputBoolUI: InputBoolUI,
}
// #region shells

const catalog_shell = {
   Default: ShellCushyLeftUI,
   // most common
   Left: ShellCushyLeftUI,
   Right: ShellCushyRightUI,
   FluidUI: ShellCushyFluidUI,
   Inline: ShellInlineUI,
   // minimalist
   Simple: ShellSimpleUI,
   HeaderOnly: ShellHeaderOnlyUI,
   BodyOnly: ShellBodyOnlyUI,
   // experimental
   Mobile: ShellMobileUI,
   Noop: ShellNoop,
   // custom
   List1: ShellCushyList1UI,
}
// #region fields

const catalog_size = {
   line: WigetSize_LineUI,
   block: WigetSize_BlockUI,
}

const catalog_number = {
   input: WidgetNumberUI /** inline WidgetNumber */,
   simple: WidgetNumberSimpleUI,
}

const catalog_enum = {
   default: WidgetEnumUI,
   select: WidgetEnum_SelectUI,
   tab: WidgetEnum_TabUI,
}

const catalog_boolean = {
   default: WidgetBoolUI,
}

const catalog_choices = {
   DefaultHeader: WidgetChoices_HeaderUI,
   DefaultBody: WidgetChoices_BodyUI,
   TabBar: WidgetChoices_HeaderTabBarUI,
   Buttons: WidgetChoices_HeaderButtonsUI,
   SelectHeaderUI: WidgetChoices_HeaderSelectUI,
}

const catalog_selectOne = {
   Select: WidgetSelectOneUI,
}

const catalog_selectMany = {
   DefaultHeader: WidgetSelectManyUI,
}

const catalog_string = {
   input: WidgetString_SmallInput,
   summary: WidgetString_summary,
   textarea: WidgetString_TextareaInput,
   markdown: WidgetString_MarkdownUI,
}

const catalog_list = {
   BlenderLike: BlenderListUI,
   DefaultHeader: WidgetList_LineUI,
   DefaultBody: WidgetList_BodyUI,
}

const catalog_prompt = {
   DefaultHeaderUI: WidgetPromptCollapsibleUI,
   DefaultBodyUI: WidgetPromptUI,
}

const catalog_group = {
   Tabbed: WidgetGroup_TabUI,
   controls: WidgetGroup_LineUI,
   DefaultBody: WidgetGroup_BlockUI,
   inline: WidgetGroup_InlineUI,
}

export const widgetsCatalog /* WidgetsCatalog */ = {
   // misc
   wrappers: catalog_wrappers,
   icons: catalog_icons,
   message: catalog_message,
   caret: catalog_caret,
   misc: catalog_misc,
   title: catalog_Title,
   Indent: catalog_Indent,

   // inputs
   inputs: catalog_inputs,

   // shells
   shell: catalog_shell,

   // fields
   size: catalog_size,
   number: catalog_number,
   enum: catalog_enum,
   boolean: catalog_boolean,
   choices: catalog_choices,
   selectOne: catalog_selectOne,
   selectMany: catalog_selectMany,
   string: catalog_string,
   list: catalog_list,
   prompt: catalog_prompt,
   group: catalog_group,
}

export type WidgetsCatalog = typeof widgetsCatalog

// make globally available
;(window as any).uy = widgetsCatalog

// fast hot-reload
if (import.meta.hot) {
   import.meta.hot.accept()
   ;(window as any).uy = widgetsCatalog
}

// #region ⏸️ per-type DSL

// export type WidgetsCatalogProps = {
//    shell:
//       | ['Default', PropsOf<typeof ShellCushyLeftUI>]
//       | ['Left', PropsOf<typeof ShellCushyLeftUI>]
//       | ['Right', PropsOf<typeof ShellCushyRightUI>]
//       | ['FluidUI', PropsOf<typeof ShellCushyFluidUI>]
//       | ['Inline', PropsOf<typeof ShellInlineUI>]
//       | ['Simple', PropsOf<typeof ShellSimpleUI>]
//       | ['HeaderOnly', PropsOf<typeof ShellHeaderOnlyUI>]
//       | ['BodyOnly', PropsOf<typeof ShellBodyOnlyUI>]
//       | ['Mobile', PropsOf<typeof ShellMobileUI>]
//       | ['Noop', PropsOf<typeof ShellNoop>]
//       | ['List1', PropsOf<typeof ShellCushyList1UI>]
//    wrappers: 'foo' | 'bar'
// }

// #region ⏸️ type index
// ⚡️ export type Catalog_wrappers = typeof catalog_wrappers
// ⚡️ export type Catalog_icons = typeof catalog_icons
// ⚡️ export type Catalog_message = typeof catalog_message
// ⚡️ export type Catalog_caret = typeof catalog_caret
// ⚡️ export type Catalog_misc = typeof catalog_misc
// ⚡️ export type Catalog_Title = typeof catalog_Title
// ⚡️ export type Catalog_Indent = typeof catalog_Indent
// ⚡️ export type Catalog_inputs = typeof catalog_inputs
// ⚡️ export type Catalog_shell = typeof catalog_shell
// ⚡️ export type Catalog_size = typeof catalog_size
// ⚡️ export type Catalog_number = typeof catalog_number
// ⚡️ export type Catalog_enum = typeof catalog_enum
// ⚡️ export type Catalog_boolean = typeof catalog_boolean
// ⚡️ export type Catalog_choices = typeof catalog_choices
// ⚡️ export type Catalog_selectOne = typeof catalog_selectOne
// ⚡️ export type Catalog_selectMany = typeof catalog_selectMany
// ⚡️ export type Catalog_string = typeof catalog_string
// ⚡️ export type Catalog_list = typeof catalog_list
// ⚡️ export type Catalog_prompt = typeof catalog_prompt
// ⚡️ export type Catalog_group = typeof catalog_group
// ⚡️ type CatalogPerTypeIndex = {
// ⚡️    size: Catalog_size
// ⚡️    number: Catalog_number
// ⚡️    enum: Catalog_enum
// ⚡️    bool: Catalog_boolean // name❓
// ⚡️    choices: Catalog_choices
// ⚡️    selectOne: Catalog_selectOne
// ⚡️    selectMany: Catalog_selectMany
// ⚡️    str: Catalog_string // name❓
// ⚡️    list: Catalog_list
// ⚡️    prompt: Catalog_prompt
// ⚡️    group: Catalog_group
// ⚡️    // missing catalogs
// ⚡️    color: Record<never, never>
// ⚡️    image: Record<never, never>
// ⚡️    markdown: Record<never, never>
// ⚡️    optional: Record<never, never>
// ⚡️    custom: Record<never, never>
// ⚡️    date: Record<never, never>
// ⚡️    matrix: Record<never, never>
// ⚡️    orbit: Record<never, never>
// ⚡️    seed: Record<never, never>
// ⚡️    shared: Record<never, never>
// ⚡️ }
// ⚡️ export type CatalogPerType<T extends CATALOG.AllFieldTypes> = CatalogPerTypeIndex[T]

// #region ⏸️ runtime index

// V1
// export function getSubcatalogForType(type: CATALOG.AllFieldTypes) {
//    if (type === 'size') return catalog_size
//    if (type === 'number') return catalog_number
//    if (type === 'enum') return catalog_enum
//    if (type === 'bool') return catalog_boolean // name❓
//    if (type === 'choices') return catalog_choices
//    if (type === 'selectOne') return catalog_selectOne
//    if (type === 'selectMany') return catalog_selectMany
//    if (type === 'str') return catalog_string // name❓
//    if (type === 'list') return catalog_list
//    if (type === 'prompt') return catalog_prompt
//    if (type === 'group') return catalog_group
//    // missing catalogs
//    if (type === 'color') return {}
//    if (type === 'image') return {}
//    if (type === 'markdown') return {}
//    if (type === 'optional') return {}
//    if (type === 'custom') return {}
//    if (type === 'date') return {}
//    if (type === 'matrix') return {}
//    if (type === 'orbit') return {}
//    if (type === 'seed') return {}
//    if (type === 'shared') return {}
//    exhaust(type)
// }

// V2
// ⏸️ export const catalogPerType: { [key in CATALOG.AllFieldTypes]: object } = {
// ⏸️    size: catalog_size,
// ⏸️    number: catalog_number,
// ⏸️    enum: catalog_enum,
// ⏸️    bool: catalog_boolean, // name❓
// ⏸️    choices: catalog_choices,
// ⏸️    selectOne: catalog_selectOne,
// ⏸️    selectMany: catalog_selectMany,
// ⏸️    str: catalog_string, // name❓
// ⏸️    list: catalog_list,
// ⏸️    prompt: catalog_prompt,
// ⏸️    group: catalog_group,
// ⏸️    // missing catalogs
// ⏸️    color: {},
// ⏸️    image: {},
// ⏸️    markdown: {},
// ⏸️    optional: {},
// ⏸️    custom: {},
// ⏸️    date: {},
// ⏸️    matrix: {},
// ⏸️    orbit: {},
// ⏸️    seed: {},
// ⏸️    shared: {},
// ⏸️ }

// #region ⏸️ Manual types

/* {
   Misc: {
      Frame: FC<FrameProps>
      Button: FC<ButtonProps>
      Checkbox: FC<BoolButtonProps>
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
   QuickForm: (p: QuickFormProps) => React.JSX.Element

   // fields
   number: {
      def: FC<{ field: Field_number }>
   }

   choices: {
      TabbedInline: FC<{ field: Field_choices<any> }>
      Buttons: FC<{ field: Field_choices<any> }>
      SelectHeaderUI: FC<{ field: Field_choices<any> }>
   }

   string: {
      input: FC<{ field: Field_string }>
      summary: FC<{ field: Field_string }>
      textarea: FC<{ field: Field_string }>
   }

   list: {
      BlenderLike: typeof BlenderListUI
   }
   // optional:{
   //    toggleButton: FC<{ field: Field_string }>
   // }
   group: {
      Tabbed: typeof WidgetGroup_TabUI
      controls: typeof WidgetGroup_LineUI
      group: typeof WidgetGroup_BlockUI
      inline: typeof WidgetGroup_InlineUI
   }
} */

// QuickForm: QuickForm,
// #region global stuff
