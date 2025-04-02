import type { Field_group } from '../../csuite/fields/group/FieldGroup'
import type { SelectKey } from '../../csuite/fields/selectOne/SelectOneKey'
import type { Field } from '../../csuite/model/Field'
import type { RenderProps } from './RenderProps'

import { runInAction } from 'mobx'

import { WidgetChoices_BodyUI } from '../../csuite/fields/choices/WidgetChoices_BodyUI'
import { WidgetChoices_HeaderUI } from '../../csuite/fields/choices/WidgetChoices_HeaderUI'
import { WidgetColorUI } from '../../csuite/fields/color/WidgetColorUI'
import { WidgetGroup_LineUI } from '../../csuite/fields/group/WidgetGroup_Header'
import { WidgetSelectImageUI } from '../../csuite/fields/image/WidgetImageUI'
import { ShellOptionalUI } from '../../csuite/fields/optional/WidgetOptional'
import { WidgetSelectOneUI } from '../../csuite/fields/selectOne/WidgetSelectOneUI'
import { ShellSharedUI } from '../../csuite/fields/shared/WidgetSharedUI'
import { WidgetBodyContainerUI } from '../../csuite/form/WidgetBodyContainerUI'
import { WidgetHeaderContainerUI } from '../../csuite/form/WidgetHeaderContainerUI'
import { WidgetLabelCaretUI } from '../../csuite/form/WidgetLabelCaretUI'
import { WidgetLabelIconUI } from '../../csuite/form/WidgetLabelIconUI'
import { WidgetMenuUI } from '../../csuite/form/WidgetMenu'
import { WidgetSingleLineSummaryUI } from '../../csuite/form/WidgetSingleLineSummaryUI'
import { WidgetToggleUI } from '../../csuite/form/WidgetToggleUI'
import { WidgetUndoChangesButtonUI } from '../../csuite/form/WidgetUndoChangesButtonUI'
import { FieldSelector } from '../../csuite/selector/selector'
import { WidgetErrorsUI } from '../catalog/Errors/WidgetErrorsUI'
import { WidgetPresetsUI } from '../catalog/Presets/WidgetPresets'
import { DefaultWidgetTitleUI } from '../catalog/Title/WidgetLabelTextUI'
import { CushyHeadUI } from '../shells/CushyHead'
import { ShellCushyLeftUI, ShellCushyRightUI } from '../shells/ShellCushy'
import { defaultRulesV2, renderDefaultKey } from './RenderDefaultsKey'

/**
 * every project can define its own algebra for rendering fields
 * in CushyStudio, our Shell iw suppose to handle those
 */
const baseslots: RenderProps<Field> = {
   /* ✅ */ Shell: ShellCushyLeftUI,

   // heavilly suggested to include in your presenter unless you know what you do
   /* ✅ */ Head: CushyHeadUI, // will be injected by the field
   /* ✅ */ Header: undefined, // will be injected by the field
   /* ✅ */ Body: undefined, // will be injected by the field
   /* ✅ */ Extra: undefined,

   /* 🟢 */ Errors: WidgetErrorsUI,
   /* 🟢 */ Title: DefaultWidgetTitleUI,

   /* 🟢 */ DragKnob: undefined,
   /* 🟢 */ UpDownBtn: undefined,
   /* 🟢 */ DeleteBtn: undefined,

   // bonus features
   /* 🟡 */ Indent: undefined, // WidgetIndentUI,
   /* 🟡 */ UndoBtn: WidgetUndoChangesButtonUI,
   /* 🟡 */ Toogle: WidgetToggleUI,
   /* 🟡 */ Caret: WidgetLabelCaretUI,
   /* 🟡 */ Icon: WidgetLabelIconUI,
   /* 🟡 */ Presets: WidgetPresetsUI,
   /* 🟡 */ MenuBtn: WidgetMenuUI,

   // suggested containers
   /* 🟠 */ ContainerForHeader: WidgetHeaderContainerUI,
   /* 🟠 */ ContainerForBody: WidgetBodyContainerUI,
   /* 🟠 */ ContainerForSummary: WidgetSingleLineSummaryUI,

   /* 🟢 */ classNameAroundBodyAndHeader: null,
   /* 🟢 */ classNameAroundBody: null,
   /* 🟢 */ classNameAroundHeader: null,
   /* 🟢 */ className: null,

   shouldShowHiddenFields: false,
   shouldAnimateResize: true,

   // stuff you probably don't want to include
   // misc debug stuff
   /* 🟣 */ DebugID: null, // WidgetDebugIDUI,
}

function r<FIELD extends Field>(
   //
   selector: string,
   uiconf: RenderProps<FIELD>,
   priority = 10,
): void {
   defaultRulesV2.push({
      addedBy: null,
      pattern: FieldSelector.from(selector),
      uiconf,
      priority,
   })
}

// const K: DisplaySlots<Z.FNumber>={config:{min}}
function resetDefaultRules() {
   // 1. reset rules
   defaultRulesV2.splice(0, defaultRulesV2.length)

   // default rules: `* {...}`
   r('', baseslots)

   // funny defaults (we want to remove them)
   // but they can be good to make sure the whole system is fast.
   r<Z.FNumber>('ratio@number', { config: { softMin: 0, softMax: 1 } })

   // core rules
   r('.@group.', { Shell: ShellCushyRightUI })
   r('.@choices.', { Shell: ShellCushyRightUI })
   // r('@choices.@group', { Head: false })
   r<Z.FShared<any>>('@shared', { Shell: ShellSharedUI })
   r<Z.FOptional<any>>('@optional', { Shell: ShellOptionalUI })
   r<Z.FString>('@str', { Header: uy.string.input, Body: null })
   r<Z.FNumber>('@number', { Header: uy.number.input, Body: null })
   r<Z.FSize>('@size', { Header: uy.size.line, Body: uy.size.block })
   r<Z.FSelectOne<unknown, SelectKey>>('@selectOne', { Header: WidgetSelectOneUI /* uy.selectOne.Select */ }) // prettier-ignore
   r<Z.FList<any>>('@list', { Body: uy.list.DefaultBody, Header: uy.list.DefaultHeader })
   r<Z.FImage>('@image', { Body: WidgetSelectImageUI /* uy.selectOne.Select */ })
   r<Z.FRecord<any>>('@group', { Header: WidgetGroup_LineUI, Body: uy.group.DefaultBody })
   r<Z.FChoices<any>>('@choices', { Header: WidgetChoices_HeaderUI, Body: WidgetChoices_BodyUI })
   r<Z.FColor>('@color', { Header: WidgetColorUI, Body: null })
   r<Z.FBool>('@bool', { Header: uy.boolean.default, Body: null })
   r<any>('@enum', { Header: uy.enum.default, Body: null })
   r<any>('@prompt', { Header: uy.prompt.DefaultHeaderUI, Body: uy.prompt.DefaultBodyUI })
   r<Field>('$', { collapsible: false })
   // r<Field>('!(:has(.))', { Caret: false })
   r<Field_group>('$@group', {
      Indent: false,
      Body: (f) => <uy.group.DefaultBody field={f.field} className='gap-1' />,
   })
   r<Field>('$.{@group|@optional.@group|@list|@choices|@prompt}', {
      Decoration: (p) => <uy.wrappers.Card {...p} />,
   })
   r<Z.FList<Z.Record_>>('@list.@optional.@group.', {
      Body: (f) => <uy.list.BlenderLike field={f.field} renderItem={() => <>🔴</>} />,
   })
   // '@list:has(.@group.{@image & {name | title}@string})'
   r<Z.FList<Z.Record_>>('@list:has(.@group.)', {
      Body: (f) => {
         return (
            <uy.list.BlenderLike
               field={f.field}
               renderItem={(item) => {
                  const children = item.zChildrenActive
                  const str = children.find((x) => x.zType === 'str') as Z.FString | undefined
                  const img = children.find((x) => x.zType === 'image') as Z.FImage | undefined
                  return (
                     <div tw='flex'>
                        {str?.zValue_unchecked ?? item.zSummary}
                        {img && <img src={img.zValue.url} tw='h-widget w-widget' />}
                     </div>
                  )
               }}
            />
         )
      },
   })
   renderDefaultKey.version++
}
runInAction(() => {
   resetDefaultRules()
   console.log(`[🤠] renderDefaultKey`, renderDefaultKey.version)
})

// ;(window as any).defaultRenderRules = defaultPresenterRule
if (import.meta.hot) {
   import.meta.hot.accept()
}

// ui.set('$.{@group|@list|@choices}>', {
//    Decoration: (p) => {
//       if (field.type == 'choices') {
//          return p.children
//       }
//       return <uy.Decorations.Pad {...p} />
//    },
// })
// ui.set('@number', { Header: uy.number.simple, Body: null })
// ui.set('$.{@group|@list|@choices}.', { Indent: false })
// ui.set('$.@link.{@group|@list|@choices}.', { Indent: false })
// ui.set('$.{@group|@list|@choices}.@link.', { Indent: false })
// return slots
// #region P.setup
// export const configureDefaultFieldPresenterComponents = (
//    /** so you don't have to polute the rest of your code */
//    overrides: Partial<WidgetSlots>,
// ): void => {
//    Object.assign(defaultPresenterSlots, overrides)
// }
// const x = sb
//    .fields({
//       a: sb.number(),
//    })
//    .create()

// const a = x.A.UI({ config: { softMax: 10 } })
// const b = <x.A.UI config={{ softMax: 10 }} />
