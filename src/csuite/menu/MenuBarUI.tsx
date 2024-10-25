import type { RevealStateLazy } from '../reveal/RevealStateLazy'

import { observer } from 'mobx-react-lite'
import React from 'react'

import { isBoundCommand } from '../introspect/_isBoundCommand'
import { isCommand } from '../introspect/_isCommand'
import { isMenu } from '../introspect/_isMenu'
import { isWidget } from '../model/$FieldSym'
import { RevealUI } from '../reveal/RevealUI'
import { renderFCOrNode } from '../utils/renderFCOrNode'
import { formatMenuLabel } from './formatMenuLabel'
import { MenuUI, type MenuUIProps } from './MenuUI'
import { SimpleMenuAction } from './SimpleMenuAction'
import { SimpleMenuModal } from './SimpleMenuModal'

export const MenuBarUI = observer(function MenuBar({
   // own props
   menu,

   // top-level 'div' patches
   tabIndex,
   autoFocus,
   onKeyDown,

   // rest (so custom JSX magic can work)
   ...rest
}: MenuUIProps) {
   const ENTRIES = menu.entriesWithKb.map((ABC, ix) => {
      const { entry: entry, char, charIx } = ABC
      // 1. simple menu action
      if (entry instanceof SimpleMenuAction) {
         return <div key={ix}>❌ TODO</div>
         // return (
         //     <MenuItem //
         //         tw='_SimpleMenuAction min-w-60'
         //         key={ix}
         //         localShortcut={char}
         //         label={formatLabel(charIx, entry.opts.label)}
         //         icon={entry.opts.icon}
         //         onClick={() => {
         //             entry.opts.onPick()
         //             menu.onStop()
         //         }}
         //     />
         // )
      }
      // 2. simple menu modal
      if (entry instanceof SimpleMenuModal) {
         return <div key={ix}>❌ TODO</div>
         // return (
         //     <MenuItem //
         //         tw='_SimpleMenuModal min-w-60'
         //         key={ix}
         //         icon={entry.p.icon}
         //         localShortcut={char}
         //         label={entry.p.label}
         //         onClick={(event: MouseEvent) => {
         //             activityManager.start({
         //                 event,
         //                 placement: 'auto',
         //                 shell: 'popup-lg',
         //                 UI: (p) => (
         //                     <entry.p.UI //
         //                         close={() => p.stop()}
         //                         submit={entry.p.submit}
         //                         submitLabel={entry.p.submitLabel}
         //                     />
         //                 ),
         //             })
         //         }}
         //     />
         // )
      }
      // 3. commands and bound commands
      if (isBoundCommand(entry) || isCommand(entry)) {
         return <div key={ix}>❌ TODO</div>
         // return (
         //     <MenuItem
         //         tw='min-w-60'
         //         key={ix}
         //         label={formatLabel(charIx, entry.label)}
         //         globalShortcut={isCommand(entry) ? entry.firstCombo : char}
         //         icon={entry.icon}
         //         onClick={() => {
         //             void entry.execute()
         //             menu.onStop()
         //         }}
         //     />
         // )
      }

      // bound menu
      else if (isMenu(entry)) {
         const label = entry.title

         // 🔴 wrong place
         if (ABC.ref == null) {
            ABC.ref = React.createRef<RevealStateLazy>()
            // console.log(`[🔴🔴🔴]`, ABC)
         }

         return (
            <RevealUI //
               tw='inline-flex'
               key={entry.id}
               ref={ABC.ref}
               trigger='menubar-item'
               hasBackdrop={false}
               showBackdrop={false}
               // hideTriggers={{clic}}
               placement='bottomStart'
               content={() => <MenuUI menu={entry.init(menu.allocatedKeys)} />}
            >
               <div tw='px-1'>{formatMenuLabel(charIx, label)}</div>
               {/* <MenuItem //
                    key={ix}
                    localShortcut={char}
                    icon={entry.icon}
                    afterShortcut={<IkonOf name='mdiMenuRight' />}
                    label={formatLabel(charIx, label)}
                /> */}
            </RevealUI>
         )
      }

      //
      else if (isWidget(entry)) {
         return entry.UI()
      }

      //
      return renderFCOrNode(entry, {})

      // else if (React.isValidElement(entry)) {
      //     return <React.Fragment key={ix}>{createElement(entry)}</React.Fragment>
      // } else {
      //     return { entry }
      // }
   })
   return (
      <RevealUI
         // tabIndex={tabIndex ?? -1}
         // autoFocus={autoFocus ?? true}
         tw='flex w-fit'
         // TODO: this should be handled by the menu activity instead.
         hasBackdrop
         showBackdrop
         placement='above-no-clamp'
         trigger='none'
         content={() => ENTRIES}
         hideTriggers={{ backdropClick: true }}
         anchorProps={{
            onKeyDown: (ev) => {
               console.log(
                  `[🤠] COUCOU`,
                  ev.key,
                  menu.entriesWithKb.map((i) => i.char),
               )
               // call the original onKeyDown
               onKeyDown?.(ev)

               // handle the shortcut key
               const key = ev.key
               for (const entry of menu.entriesWithKb) {
                  if (entry.char === key) {
                     if (entry.entry instanceof SimpleMenuAction) entry.entry.opts.onClick?.()
                     // if (entry.entry instanceof SimpleMenuEntryPopup) entry.entry.onPick()
                     else if (isBoundCommand(entry.entry)) void entry.entry.execute()
                     else if (isCommand(entry.entry)) void entry.entry.execute()
                     else if (isMenu(entry.entry)) {
                        if (entry.ref == null) console.log(`[🔴] no REFFOR`, entry)
                        else if (entry.ref.current == null) console.log(`[🔴] no entry ref current`)
                        else
                           void entry.ref.current.getRevealState().open('programmatically-via-open-function')
                     }
                     menu.onStop()
                     ev.stopPropagation()
                     ev.preventDefault()
                     return
                  }
               }
            },
            // {...rest}
         }}
      >
         {ENTRIES}
      </RevealUI>
   )
})
