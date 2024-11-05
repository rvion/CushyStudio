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
import { PieMenuItem } from '../pie_menu/PieMenuItem'
import { RevealUI } from '../reveal/RevealUI'
import { renderFCOrNode } from '../utils/renderFCOrNode'
import { SimpleMenuAction } from './SimpleMenuAction'
import { SimpleMenuModal } from './SimpleMenuModal'

// -----------------------
export type MenuUIProps = {
   menu: MenuInstance
   startX: number
   startY: number
} & React.HTMLAttributes<HTMLDivElement>

export const MenuPieUI = observer(function MenuPieUI_({
   // own props
   menu,

   // top-level 'div' patches
   tabIndex,
   autoFocus,
   onKeyDown,

   startX,
   startY,

   // rest (so custom JSX magic can work)
   ...rest
}: MenuUIProps) {
   const position = { x: startX, y: startY }

   console.log('[FD] :', position)

   return (
      <div
         tabIndex={tabIndex ?? -1}
         autoFocus={autoFocus ?? true}
         tw='absolute'
         style={{ top: startY, left: startX }}
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
         <div tw='absolute bg-red-500 ' style={{ transform: 'translate(-50%, -50%)' }}>
            {menu.entriesWithKb.map(({ entry: entry, char, charIx }, ix) => {
               const angle = (ix / menu.entriesWithKb.length) * 2 * Math.PI + Math.PI
               const radius = 100 // Distance from center

               // Calculate x, y positions based on angle
               const x = radius * Math.cos(angle)
               const y = radius * Math.sin(angle)

               const style = {
                  transform: `translate(${x - 50}%, ${y - 25}%)`,
                  width: '200px',
                  height: '100px',
               }

               // TODO(bird_d): Make sure to implement div for 2/3/4/etc.
               // 1. simple menu action
               if (entry instanceof SimpleMenuAction) {
                  return (
                     <div //
                        tw='absolute left-0 top-0'
                        style={style}
                     >
                        <PieMenuItem //
                           tw='_SimpleMenuAction'
                           key={ix}
                           localShortcut={char}
                           label={entry.opts.label}
                           // children={formatMenuLabel(charIx, entry.opts.label)}
                           icon={entry.opts.icon}
                           onClick={async () => {
                              await entry.opts.onClick?.()
                              menu.onStop()
                           }}
                        />
                     </div>
                  )
               }
               // 2. simple menu modal
               if (entry instanceof SimpleMenuModal) {
                  return (
                     <PieMenuItem //
                        tw='_SimpleMenuModal min-w-60'
                        style={style}
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
                     <PieMenuItem
                        tw='min-w-60'
                        style={style}
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
                  // return (
                  //    <RevealUI //
                  //       key={ix}
                  //       trigger='hover'
                  //       hideTriggers={{}}
                  //       tw='!block min-w-60'
                  //       placement='rightStart'
                  //       content={() => <MenuPieUI menu={entry.init(menu.allocatedKeys)} />}
                  //    >
                  //       <MenuItem //
                  //          disabled={entry.def.disabled}
                  //          localShortcut={char}
                  //          icon={entry.icon}
                  //          afterShortcut={<IkonOf name='mdiMenuRight' />}
                  //          label={label}
                  //          labelAcceleratorIx={charIx}
                  //       />
                  //    </RevealUI>
                  // )
                  return <>NESTED PIES ARE NOT SUPPORTED</>
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
      </div>
   )
})
