import { Button } from '../../csuite/button/Button'
import { InputBoolCheckboxUI } from '../../csuite/checkbox/InputBoolCheckboxUI'
import { InputBoolUI } from '../../csuite/checkbox/InputBoolUI'
import { MenuDivider } from '../../csuite/dropdown/MenuDivider'
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
import { WidgetString_Reveal } from '../../csuite/fields/string/WidgetString_Reveal'
import { WidgetString_SmallInput } from '../../csuite/fields/string/WidgetString_SmallInput'
import { WidgetString_summary } from '../../csuite/fields/string/WidgetString_summary'
import { WidgetString_TextareaInput } from '../../csuite/fields/string/WidgetString_TextareaInput'
import { type WidgetLabelCaretProps, WidgetLabelCaretUI } from '../../csuite/form/WidgetLabelCaretUI'
import { WidgetLabelIconPlacholderUI, WidgetLabelIconUI } from '../../csuite/form/WidgetLabelIconUI'
import { Frame, type FrameProps } from '../../csuite/frame/Frame'
import { IkonOf } from '../../csuite/icons/iconHelpers'
import { InputNumberUI } from '../../csuite/input-number/InputNumberUI'
import { MessageErrorUI } from '../../csuite/messages/MessageErrorUI'
import { MessageInfoUI } from '../../csuite/messages/MessageInfoUI'
import { MessageWarningUI } from '../../csuite/messages/MessageWarningUI'
import { ResizableFrame } from '../../csuite/resizableFrame/resizableFrameUI'
import { WidgetPromptCollapsibleUI } from '../../prompt/widgets/WidgetPromptCollapsibleUI'
import { WidgetPromptUI } from '../../prompt/widgets/WidgetPromptUI'
import { WidgetPromptUI2 } from '../../prompt/widgets/WidgetPromptUI2'
import { WidgetPromptUIBird_d } from '../../prompt/widgets/WidgetPromptUIBird_d'
import { useDropZone } from '../../widgets/galleries/dndGeneric'
import { POPUP } from '../../widgets/misc/SimplePopUp'
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
   Of: IkonOf,
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
   PopUp: POPUP,
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
   BoolUI: InputBoolUI,
   NumberUI: InputNumberUI,
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

const catalog_Menu = {
   Divider: MenuDivider,
}

const catalog_size = {
   line: WigetSize_LineUI,
   block: WigetSize_BlockUI,
}

const catalog_number = {
   def: WidgetNumberUI /** inline WidgetNumber */,
   input: WidgetNumberUI /** inline WidgetNumber */,
   simple: WidgetNumberSimpleUI,
}

const catalog_enum = {
   default: WidgetEnumUI,
   select: WidgetEnum_SelectUI,
   tab: WidgetEnum_TabUI,
}

const catalog_boolean = {
   Default: WidgetBoolUI,
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
   reveal: WidgetString_Reveal,
}

const catalog_list = {
   BlenderLike: BlenderListUI,
   DefaultHeader: WidgetList_LineUI,
   DefaultBody: WidgetList_BodyUI,
}

const catalog_prompt = {
   DefaultHeaderUI: WidgetPromptCollapsibleUI,
   DefaultBodyUI: WidgetPromptUI,
   WidgetPromptUI2: WidgetPromptUI2,
   WidgetPromptUIBird_d: WidgetPromptUIBird_d,
}

const catalog_group = {
   Tabbed: WidgetGroup_TabUI,
   controls: WidgetGroup_LineUI,
   DefaultBody: WidgetGroup_BlockUI,
   inline: WidgetGroup_InlineUI,
}

const catalog_Layout = {
   Col: obs(function ColumnUI_(p: FrameProps) {
      const theme = cushy.preferences.theme.zValue
      return (
         <Frame
            col
            border={p.align ? theme.global.border : undefined}
            roundness={theme.global.roundness}
            dropShadow={p.align ? theme.global.shadow : undefined}
            expand={p.expand ?? true}
            {...p}
         />
      )
   }),
   Row: obs(function ColumnUI_(p: FrameProps) {
      const theme = cushy.preferences.theme.zValue
      return (
         <Frame
            row
            border={p.align ? theme.global.border : undefined}
            roundness={theme.global.roundness}
            dropShadow={p.align ? theme.global.shadow : undefined}
            expand={p.expand ?? true}
            {...p}
         />
      )
   }),
   Box: obs(function ColumnUI_(p: FrameProps) {
      const theme = cushy.preferences.theme.zValue
      return (
         <Frame
            col
            border={theme.global.border}
            roundness={theme.global.roundness}
            dropShadow={theme.global.shadow}
            expand={p.expand ?? true}
            {...p}
         />
      )
   }),
}

const catalog_dnd = {
   useDropZone: useDropZone,
}

export const widgetsCatalog /* WidgetsCatalog */ = {
   // misc
   wrappers: catalog_wrappers,
   icons: catalog_icons,
   message: catalog_message,
   caret: catalog_caret,
   misc: catalog_misc,
   title: catalog_Title,
   indent: catalog_Indent,
   layout: catalog_Layout,
   dnd: catalog_dnd,
   menu: catalog_Menu,

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
