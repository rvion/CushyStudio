import type { SelectProps } from './SelectProps'

import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'

import { Button } from '../button/Button'
import { Row } from '../frame/Dov/Dov'
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

   if (p.readonly)
      return (
         <Row
            expand
            tabIndex={0}
            tw={[
               'UI-Select minh-input',
               'relative',
               'h-full',
               'w-full',
               'ANCHOR-REVEAL',
               'overflow-hidden',
               'cursor-not-allowed',
               p.hasErrors ? 'border border-red-700' : 'border border-transparent',
            ]}
         >
            <AnchorContentComp select={select} fullyShrinkable={fullyShrinkable} />
         </Row>
      )

   return (
      <Row>
         <RevealUI //
            ref={select.revealStateRef}
            trigger='pseudofocus'
            // shell='popover'
            shell={SelectShellUI}
            // placement={p.placement ?? 'autoVerticalStart'}
            placement='cover'
            content={({ reveal }) => (
               <PopupComp reveal={reveal} selectState={select} createOption={p.createOption} />
            )}
            // 🔶 be careful to not override stuff with that (goes both ways)
            {...p.revealProps}
            onHidden={(reason) => {
               select.revealState?.log(`🔶 revealUI - onHidden (focus anchor)`)
               select.clean()

               p.revealProps?.onHidden?.(reason)
            }}
            sharedAnchorRef={select.anchorRef}
         >
            <Row
               expand
               tabIndex={0}
               tw={[
                  'UI-Select minh-input',
                  'relative',
                  'h-full',
                  'ANCHOR-REVEAL',
                  'overflow-hidden',
                  'group',
                  p.hasErrors && 'border border-red-700',
               ]}
               hoverable
               /** ⚠ these anchorProps are not the ones that are used by RevealUI, so we need to handle them ourselves */
               {...p.anchorProps}
               onKeyDown={(ev) => {
                  select.handleTooltipKeyDown(ev)
                  p.anchorProps?.onKeyDown?.(ev)
               }}
            >
               <AnchorContentComp fullyShrinkable={fullyShrinkable} select={select} />
            </Row>
         </RevealUI>
         {p.onCleared && (
            <Button
               disabled={select.value == null}
               subtle
               borderless
               size='input'
               icon={IKONS._clear}
               onFocus={(ev) => ev.stopPropagation()}
               onClick={(ev) => {
                  console.log('🟢 00')
                  ev.preventDefault()
                  ev.stopPropagation()
                  p.onCleared!()
               }}
            />
         )}
      </Row>
   )
})
