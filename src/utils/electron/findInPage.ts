import type { STATE } from '../../state/state'
import type { SearchResult_IPCPayload } from './ElectronUtils'

import { makeAutoObservable } from 'mobx'

import { Debounced } from '../../csuite/utils/Debounced'

type SearchOptions = {
   findNext: boolean // true
   forward: boolean // true
   matchCase: boolean // true
}

export class SearchManager {
   constructor(public st: STATE) {
      makeAutoObservable(this)
   }

   /** when true, show the global search view at the top-right side */
   private _active: boolean = false
   get active(): boolean {
      return this._active
   }

   activate(): void {
      this.query.resetTo('')
      this._active = true
   }

   results: Maybe<SearchResult_IPCPayload> = null

   /** debounce search state */
   query = new Debounced('', 300 /* (next) => this.searchQuery(next) */)

   deactivate = (): void => {
      this.query.resetTo('')
      this._active = false
      const ipcRenderer = window.require('electron').ipcRenderer
      ipcRenderer.send('search-stop')
   }

   jumpToNext = (): void => {
      const ipcRenderer = window.require('electron').ipcRenderer
      ipcRenderer.send('search-next')
   }

   lastSearchedText: Maybe<string> = null

   searchQuery = (text: string, forward: boolean): void => {
      const findNext = this.lastSearchedText === text
      const options: SearchOptions = {
         findNext,
         forward,
         matchCase: true,
      }
      this.lastSearchedText = text
      console.log(`[🔎] starting search...`)
      // ⏸️ const text = Array.from(textWithInvisilbeQuery)
      // ⏸️     .filter((c) => c !== '$')
      // ⏸️     .join('')
      // ⏸️ console.log(`[🤠] text.length`, text.length)
      const ipcRenderer = window.require('electron').ipcRenderer
      ipcRenderer.send('search-start', text, options)
   }
}
