import type { Activity } from '../activity/Activity'
import type { Trigger } from '../trigger/Trigger'
import type { Menu } from './Menu'
import type { MenuEntry, MenuEntryWithKey } from './MenuEntry'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { createElement, type UIEvent } from 'react'

import { Command } from '../commands/Command'
import { isMenu } from '../introspect/_isMenu'
import { menuBuilder } from './MenuBuilder'
import { MenuUI } from './MenuUI'
import { SimpleMenuAction } from './SimpleMenuAction'

export class MenuInstance implements Activity {
   /** called when menu starts */
   onStart(): void {}

   /** callled when menu is closed */
   onStop(): void {}

   /** calle */
   UI = (): JSX.Element => createElement(MenuUI, { menu: this })

   /** unique volative menu id */
   uid: string = nanoid()

   onEvent = (event: UIEvent): Trigger | null => {
      // event.stopImmediatePropagation()
      event.stopPropagation()
      event.preventDefault()
      return null
   }

   constructor(
      //
      public menu: Menu,
      public keysTaken: Set<string> = new Set(),
   ) {
      makeAutoObservable(this, {
         uid: false,
         UI: false,
      })
   }

   get entries(): MenuEntry[] {
      return this.menu.def.entries(menuBuilder)
   }

   // 💬 2024-10-10 rvion:
   // | TODO: better cache stuff (see [REFFOR])
   // | and find way to make shortcuts properly work

   get entriesWithKb(): MenuEntryWithKey[] {
      // console.log(`[REFFOR] ${this.uid} entriesWithKb...`)
      return this.acceleratedEntries.out
   }

   get allocatedKeys(): Set<string> {
      // console.log(`[REFFOR] ${this.uid} allocatedKeys...`)
      return this.acceleratedEntries.allocatedKeys
   }

   private get acceleratedEntries(): {
      out: MenuEntryWithKey[]
      allocatedKeys: Set<string>
   } {
      // console.log(`[REFFOR] ${this.uid} acceleratedEntries...`)
      const allocatedKeys = new Set<string>([...this.keysTaken])
      const out: MenuEntryWithKey[] = []
      for (const entry of this.entries) {
         if (entry instanceof SimpleMenuAction) {
            const res = this.findSuitableKeys(entry.opts.label, allocatedKeys)
            // 💬 2024-06-22 rvion: we don't want to skip entries,
            // | we want to show them with no key if we can't find letter
            // | for them
            // | ⏸️ if (res == null) continue
            out.push({ entry: entry, char: res?.char, charIx: res?.pos })
         } else if (entry instanceof Command) {
            const res = this.findSuitableKeys(entry.label, allocatedKeys)
            // ⏸️ if (res == null) continue
            out.push({ entry: entry, char: res?.char, charIx: res?.pos })
         } else if (isMenu(entry)) {
            const res = this.findSuitableKeys(entry.title, allocatedKeys)
            // ⏸️ if (res == null) continue
            out.push({ entry: entry, char: res?.char, charIx: res?.pos })
         } else {
            out.push({ entry: entry })
         }
      }
      return { out, allocatedKeys }
   }

   findSuitableKeys = (
      //
      label: string,
      allocatedKeys: Set<string>,
   ): Maybe<{ char: string; pos: number }> => {
      let ix = 0
      for (const char of [...label]) {
         const key = char.toLowerCase()
         if (!allocatedKeys.has(key)) {
            allocatedKeys.add(key)
            return { char: key, pos: ix }
         }
         ix++
      }
   }
}
