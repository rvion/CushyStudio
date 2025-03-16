import type { SelectProps } from './SelectProps'

import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'

import { Button } from '../button/Button'
import { csuiteConfig } from '../config/configureCsuite'
import { Frame } from '../frame/Frame'
import { RevealUI } from '../reveal/RevealUI'
import { SelectAnchorContentUI } from './SelectAnchorContentUI'
import { SelectPopupUI } from './SelectPopupUI'
import { SelectShellUI } from './SelectShellUI'
import { AutoCompleteSelectState } from './SelectState'

// TODO fork this component
export const SelectUI = observer(function SelectUI_<T>(p: SelectProps<T>) {
   const select = useMemo(() => new AutoCompleteSelectState(/* st, */ p), [])
   const fullyShrinkable = p.fullyShrinkable ?? true
   const PopupComp = p.slotPopupUI ?? SelectPopupUI
   const AnchorContentComp = p.slotAnchorContentUI ?? SelectAnchorContentUI
   const theme = cushy.preferences.theme.value

   // if (p.readonly) return <AnchorContentComp select={select} />
   if (p.readonly)
      return (
         <Frame
            hover
            expand
            tabIndex={0}
            tw={[
               //
               'UI-Select minh-input',
               'ANCHOR-REVEAL',
               p.hasErrors && 'rsx-field-error',
            ]}
         >
            <AnchorContentComp select={select} fullyShrinkable={fullyShrinkable} />
         </Frame>
      )

   const WUI = (
      <RevealUI //
         ref={select.revealStateRef}
         trigger='pseudofocus'
         // shell='popover'
         shell={SelectShellUI}
         // placement={p.placement ?? 'autoVerticalStart'}
         placement='cover'
         content={({ reveal }) => (
            <PopupComp reveal={reveal} selectState={select} createOption={p.createOption} />
         )} // 🔶 be careful to not override stuff with that (goes both ways)
         {...p.revealProps}
         onHidden={(reason) => {
            // select.revealState?.log(`🔶 revealUI - onHidden (focus anchor)`)
            select.clean()
            p.revealProps?.onHidden?.(reason)
         }}
         sharedAnchorRef={select.anchorRef}
         anchorProps={{
            ...p.revealProps?.anchorProps,
            onKeyDown: (ev) => {
               // 🔶 note: the anchor gets all keyboard events even when input inside popup via portal is focused!
               select.handleTooltipKeyDown(ev)
               p.revealProps?.anchorProps?.onKeyDown?.(ev)
            },
         }}
      >
         <Frame
            tw={[
               //
               'overflow-clip',
               'UI-Select minh-input',
               'relative',
               'h-full',
               'flex items-center',
               p.hasErrors && 'rsx-field-error',
            ]}
            align
            base={theme.global.contrast}
            border={theme.global.border}
            roundness={theme.global.roundness}
            dropShadow={cushy.preferences.theme.value.global.shadow}
            expand // </RevealUI>={p.expand ?? true}
            tabIndex={0}
            tooltip={p.tooltip}
            {...p.frameProps}
            // line
            // hover
         >
            <AnchorContentComp select={select} />
            {p.onCleared && (
               <Button
                  disabled={select.value == null}
                  square
                  size='input'
                  icon={IKONS._clear}
                  onFocus={(ev) => ev.stopPropagation()}
                  onClick={(ev) => {
                     ev.preventDefault()
                     ev.stopPropagation()
                     p.onCleared!()
                  }}
               />
            )}
         </Frame>
      </RevealUI>
   )
   if (p.createOption == null) return WUI

   return (
      <>
         {WUI}
         {p.createOption != null && p.createOption.isActive?.() !== false && (
            <Button subtle size='input' onClick={() => select.createOption()}>
               {p.createOption.label ?? csuiteConfig.i18n.ui.select.create}
            </Button>
         )}
      </>
   )
})
