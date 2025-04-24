import type { RenderPropsCompiled } from '../presenters/RenderPropsCompiled'
import type React from 'react'
import type { ReactNode } from 'react'

import { fieldActionMenu } from '../../csuite/form/fieldActionMenu'
import { WidgetLabelContainerUI } from '../../csuite/form/WidgetLabelContainerUI'
import { Frame } from '../../csuite/frame/Frame'
import { useProvenance } from '../../csuite/provenance/Provenance'
import { RevealUI } from '../../csuite/reveal/RevealUI'
import { renderFCOrNode, renderFCOrNodeWithWrapper } from '../../csuite/utils/renderFCOrNode'
import { WidgetPresetsUI } from '../catalog/Presets/WidgetPresets'

const CushyShellUI = obs(function CushySHell(
   p: RenderPropsCompiled & {
      border?: boolean
      HEADER: React.JSX.Element
   },
) {
   const field = p.field
   const provenance = useProvenance()
   const isCollapsed = ((): boolean => {
      if (p.collapsible != null) return p.collapsible // UI config most important
      if (!p.field.zIsCollapsible) return false
      return field.zIsCollapsed
   })()
   if (p.field.zIsHidden && !p.shouldShowHiddenFields) return null

   const theme = cushy.preferences.theme.zValue

   let WUI: ReactNode = (
      <Frame
         className={p.className ?? undefined}
         tw={['UI-WidgetWithLabel !border-b-0 !border-l-0 !border-r-0', p.classNameForShell]}
         roundness={theme.global.roundness}
         // base={field.background}
         // border={p.card ? 1 : field.border}
         {...p.field.zConfig.box}
      >
         {renderFCOrNode(p.OnTop, { field })}
         <RevealUI
            tw='w-full'
            trigger={'rightClick'}
            relativeTo='mouse'
            hideTriggers={{ backdropClick: true, escapeKey: true, blurAnchor: true, clickAnchor: true }}
            content={() => <fieldActionMenu.MenuEntriesUI field={p.field} provenance={provenance} />}
         >
            {/* <div tw='flex grow'> */}
            {renderFCOrNode(
               p.Head,
               p, //
               renderFCOrNode(p.HEADER, {}),
            )}
         </RevealUI>
         {isCollapsed
            ? null
            : renderFCOrNodeWithWrapper(p.Body, p, p.ContainerForBody, {
                 className: p.classNameAroundBodyAndHeader ?? undefined,
                 border: p.border,
              })}
         {/* ERRORS  */}
         {renderFCOrNode(p.Errors, { field })}
         {renderFCOrNode(p.OnBottom, { field })}
      </Frame>
   )

   // WUI = <AnimatedSizeUI>{WUI}</AnimatedSizeUI>
   if (p.Decoration != null)
      // WUI = renderFCOrNode(p.Decoration, {
      WUI = renderFCOrNode(p.Decoration, {
         className: p.classNameForShell ?? undefined,
         children: WUI,
         rp: p,
      })
   return WUI
})

export const ShellCushyLeftUI = obs(function ShellCushyLeft(p: RenderPropsCompiled) {
   const field = p.field
   const originalField = field /* 🔴 */

   return (
      <CushyShellUI // 1️⃣
         {...p}
         HEADER={
            <>
               {/* prettier-ignore */}
               <WidgetLabelContainerUI tooltip={field.zDescription} justify>
                  {renderFCOrNode(p.Indent,      { depth: field.zDepth })}
                  {renderFCOrNode(p.DragKnob,    { field })}
                  {renderFCOrNode(p.Icon,        { field, className: 'mr-1' })}
                  {renderFCOrNode(p.Caret,       { ...p, placeholder: true })}

                  {renderFCOrNode(p.Title,       { field })}
                  {renderFCOrNode(p.Presets,     { field })}
                  {renderFCOrNode(p.DebugID,     { field })}
               </WidgetLabelContainerUI>
               {renderFCOrNode(p.Toogle, { field: originalField, className: 'ml-0.5' })}
            </>
         }
      />
   )
})

export const ShellCushyList1UI = obs(function ShellCushyList1(p: RenderPropsCompiled) {
   const field = p.field
   const originalField = field /* 🔴 */

   return (
      <CushyShellUI // 1️⃣
         {...p}
         HEADER={
            <>
               {/* prettier-ignore */}
               <WidgetLabelContainerUI tooltip={field.zDescription} justify>
                  {renderFCOrNode(p.Indent,      { depth: field.zDepth })}
                  {renderFCOrNode(p.DragKnob,    { field })}
                  {renderFCOrNode(p.Caret,       { field, placeholder: true })}
                  {renderFCOrNode(p.Icon,        { field, className: 'mr-1' })}
                  {renderFCOrNode(p.Toogle, { field: originalField })}
                  {renderFCOrNode(p.Title,       { field })}
                  {renderFCOrNode(p.DebugID,     { field })}
               </WidgetLabelContainerUI>
               {renderFCOrNode(p.Presets, { field })}
            </>
         }
      />
   )
})

export const ShellCushyRightUI = obs(function ShellCushyRight(p: RenderPropsCompiled) {
   const field = p.field
   const originalField = field /* 🔴 */

   return (
      <CushyShellUI // 2️⃣2️⃣
         {...p}
         HEADER={
            <>
               <WidgetLabelContainerUI //
                  tooltip={field.zDescription}
                  justify
               >
                  {renderFCOrNode(p.Indent /*    */, { depth: field.zDepth })}
                  {renderFCOrNode(p.DragKnob /*  */, { field })}
                  {renderFCOrNode(p.Caret /*     */, { field, caretClassName: 'mr-auto' })}
                  {renderFCOrNode(p.Presets /*   */, { field, className: 'self-start mr-2' })}
                  {/* {p.field.isCollapsible ? 'collapsible' : 'not collapsible'} */}
                  {/* {!p.field.isCollapsed && !p.field.isCollapsible && <div tw='mr-auto' />} */}
                  <div tw='mr-auto' />
                  {renderFCOrNode(p.Title /*     */, { field, className: 'mr-2' })}
                  {renderFCOrNode(p.DebugID /*   */, { field })}
                  {renderFCOrNode(p.Icon /*      */, { field, className: 'mx-1' })}
               </WidgetLabelContainerUI>
               {renderFCOrNode(p.Toogle, { field: originalField })}
            </>
         }
      />
   )
})

export const ShellCushyFluidUI = obs(function ShellCushyFluid(p: RenderPropsCompiled) {
   const field = p.field
   const originalField = field /* 🔴 */

   return (
      <CushyShellUI // 3️⃣3️⃣3️⃣
         {...p}
         HEADER={
            <>
               <WidgetLabelContainerUI //
                  tooltip={field.zDescription}
                  justify={false}
               >
                  {renderFCOrNode(p.Indent, /*    */ { depth: field.zDepth })}
                  {renderFCOrNode(p.DragKnob, /*  */ { field })}
                  {renderFCOrNode(p.Caret, /*     */ { field })}
                  {renderFCOrNode(p.Toogle, /*    */ { field: originalField, className: 'mr-1' })}
                  {renderFCOrNode(p.Icon, /*      */ { field, className: 'mr-1' })}
                  {renderFCOrNode(p.Title, /* */ { field })}
                  {renderFCOrNode(p.DebugID, /*   */ { field })}
                  <WidgetPresetsUI field={field} />
               </WidgetLabelContainerUI>
            </>
         }
      />
   )
})
