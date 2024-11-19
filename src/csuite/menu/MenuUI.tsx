import type { MenuInstance } from './MenuInstance'

import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { type MouseEvent } from 'react'

import { activityManager } from '../activity/ActivityManager'
import { MenuItem } from '../dropdown/MenuItem'
import { IkonOf } from '../icons/iconHelpers'
import { isBoundCommand } from '../introspect/_isBoundCommand'
import { isCommand } from '../introspect/_isCommand'
import { isMenu } from '../introspect/_isMenu'
import { isWidget } from '../model/$FieldSym'
import { RevealUI } from '../reveal/RevealUI'
import { renderFCOrNode } from '../utils/renderFCOrNode'
import { SimpleMenuAction } from './SimpleMenuAction'
import { SimpleMenuModal } from './SimpleMenuModal'

// -----------------------
export type MenuUIProps = {
   menu: MenuInstance
} & React.HTMLAttributes<HTMLDivElement>

export const MenuUI = observer(function MenuUI_({
   // own props
   menu,

   // top-level 'div' patches
   tabIndex,
   autoFocus,
   onKeyDown,

   // rest (so custom JSX magic can work)
   ...rest
}: MenuUIProps) {
   return (
      <div
         tabIndex={tabIndex ?? -1}
         autoFocus={autoFocus ?? true}
         tw='w-fit'
         // TODO: this should be handled by the menu activity instead.
         onKeyDown={(ev) => {
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
                  menu.onStop()
                  ev.stopPropagation()
                  ev.preventDefault()
                  return
               }
            }
         }}
         {...rest}
      >
         {menu.entriesWithKb.map(({ entry: entry, char, charIx }, ix) => {
            // 1. simple menu action
            if (entry instanceof SimpleMenuAction) {
               return (
                  <MenuItem //
                     tw='_SimpleMenuAction min-w-60'
                     key={ix}
                     localShortcut={char}
                     label={entry.opts.label}
                     // children={formatMenuLabel(charIx, entry.opts.label)}
                     icon={entry.opts.icon}
                     beforeShortcut={entry.opts.beforeShortcut}
                     onClick={async () => {
                        await entry.opts.onClick?.()
                        menu.onStop()
                     }}
                  />
               )
            }
            // 2. simple menu modal
            if (entry instanceof SimpleMenuModal) {
               return (
                  <MenuItem //
                     tw='_SimpleMenuModal min-w-60'
                     key={ix}
                     icon={entry.p.icon}
                     localShortcut={char}
                     label={entry.p.label}
                     onClick={(event?: MouseEvent) => {
                        activityManager.start({
                           event,
                           placement: 'auto',
                           shell: 'popup-lg',
                           UI: (p) => (
                              <entry.p.UI //
                                 close={() => p.stop()}
                                 submit={entry.p.submit}
                                 submitLabel={entry.p.submitLabel}
                              />
                           ),
                        })
                     }}
                  />
               )
            }
            // 3. commands and bound commands
            if (isBoundCommand(entry) || isCommand(entry)) {
               return (
                  <MenuItem
                     tw='min-w-60'
                     key={ix}
                     label={entry.label}
                     labelAcceleratorIx={charIx}
                     globalShortcut={isCommand(entry) ? entry.firstCombo : char}
                     icon={entry.icon}
                     onClick={() => {
                        void entry.execute()
                        menu.onStop()
                     }}
                  />
               )
            }

            // bound menu
            else if (isMenu(entry)) {
               const label = entry.title
               return (
                  <RevealUI //
                     key={ix}
                     trigger='hover'
                     hideTriggers={{}}
                     tw='!block min-w-60'
                     placement='rightStart'
                     content={() => <MenuUI menu={entry.init(menu.allocatedKeys)} />}
                  >
                     <MenuItem //
                        disabled={entry.def.disabled}
                        localShortcut={char}
                        icon={entry.icon}
                        afterShortcut={<IkonOf name='mdiMenuRight' />}
                        label={label}
                        labelAcceleratorIx={charIx}
                     />
                  </RevealUI>
               )
            }
            //
            else if (isWidget(entry)) {
               return <div key={ix}>{entry.UI()}</div>
            }

            return <div key={ix}>{renderFCOrNode(entry, {})}</div>
            // plain jsx
            // else if (React.isValidElement(entry)) {
            //     return entry
            // }

            // // custom element
            // else {
            //     return <React.Fragment key={ix}>{createElement(entry)}</React.Fragment>
            //     // return entry as any as React.ReactNode
            // }
         })}
      </div>
   )
})
