import type { STATE } from '../../state/state'

import { makeInputToken } from '../../csuite/commands/CommandManager'
import { bang } from '../../csuite/utils/bang'
import { createMediaImage_fromPath } from '../../models/createMediaImage_fromWebFile'
import { FPath } from '../../models/FPath'

export type FileDownloaded_IPCPayload = {
   originalFilename: string
   fileName: string
   absolutePath: string
   relativePath: string
}

// 🔶 type manually written by inspecting internal electron payload
export type SearchResult_IPCPayload = {
   requestId: number // 2
   matches: number // 76
   selectionArea: { x: number; y: number; width: number; height: number } //{ x: 619; y: 465; width: 37; height: 14 }
   activeMatchOrdinal: number // 1
   finalUpdate: boolean // true
}

export type Clipboard_ImagePayload = {
   format?: string // 'png' | 'webp' | 'raw' | 'jpeg'
   buffer: Buffer
}

export class ElectronUtils {
   ipc: Electron.IpcRenderer

   constructor(public st: STATE) {
      const ipcRenderer = window.require('electron').ipcRenderer
      this.ipc = ipcRenderer

      ipcRenderer.removeAllListeners('execute')
      ipcRenderer.on('execute', async function (event, data): Promise<void> {
         const uid: number = data.uid
         const draftID: string = data.payload?.query?.draftID
         if (typeof draftID === 'number') {
            console.log(`[API] ❌ ERROR RETRIEVING `, event, data)
            ipcRenderer.send('executed', { uid, success: false, result: 698008 })
         } else {
            console.log(`[API] 🟢 must call draft(id=${draftID}) with payload:`, data.payload)
            const draft = cushy.db.draft.getOrThrow(draftID)
            draft.AWAKE()
            const step = draft.start({ httpPayload: data.payload })
            const res = await step.finished
            // 🔴 ugly API; will get refined later
            ipcRenderer.send('executed', {
               uid,
               success: true,
               result: res,
               imageURLs: step.generatedImages.map((img) => img.url),
               imageDataURL: step.generatedImages.map((img) => img.getBase64Url()),
               // result: 69.1337,
            })
         }
         // alert('execute') // this never gets called :(
      })

      ipcRenderer.removeAllListeners('filedownloaded')
      ipcRenderer.on('filedownloaded', (_ev, json: FileDownloaded_IPCPayload) => {
         createMediaImage_fromPath(new FPath(json.relativePath), {})
         // console.log(`[🧐] `, { json })
      })

      ipcRenderer.removeAllListeners('search-result')
      ipcRenderer.on('search-result', (_ev, json: SearchResult_IPCPayload) => {
         cushy.search.results = json
         // console.log(`[🔎] search-result =`, { json })
         // createMediaImage_fromPath(st, json.relativePath, {})
      })

      // 2024-08-16 rvion: 🏑
      ipcRenderer.removeAllListeners('custom-cmd-w')
      ipcRenderer.on('custom-cmd-w', (_ev, json: SearchResult_IPCPayload) => {
         console.log('B. custom-cmd-w')
         cushy.commands.processKeyDown({
            inInput: false,
            inputToken: makeInputToken(['cmd', 'w']),
         })
      })
      ipcRenderer.removeAllListeners('custom-ctrl-w')
      ipcRenderer.on('custom-ctrl-w', (_ev, json: SearchResult_IPCPayload) => {
         console.log('B. custom-ctrl-w')
         cushy.commands.processKeyDown({
            inInput: false,
            inputToken: makeInputToken(['ctrl', 'w']),
         })
      })
   }

   toggleDevTools(): void {
      try {
         const prevPref = Boolean(this.st.configFile.value.preferDevToolsOpen)
         this.st.configFile.update({ preferDevToolsOpen: !prevPref })
         this.ipc.send('toggle-devtools')
      } catch (error) {
         console.error('❌ failed to toggle DevTools', error)
      }
   }

   openDevTools = (updateConfig: boolean = false): void => {
      try {
         this.st.configFile.update({ preferDevToolsOpen: true })
         this.ipc.send('open-devtools')
      } catch (error) {
         console.error('❌ failed to open DevTools', error)
      }
   }

   closeDevTools = (updateConfig: boolean = false): void => {
      try {
         this.st.configFile.update({ preferDevToolsOpen: false })
         const ipcRenderer = this.ipc
         ipcRenderer.send('close-devtools')
      } catch (error) {
         console.error('❌ failed to close DevTools', error)
      }
   }

   copyImageToClipboard = (payload: Clipboard_ImagePayload): Promise<unknown> => {
      return new Promise((resolve, reject) => {
         const format = payload.format ?? 'png'
         const ipcRenderer = this.ipc
         ipcRenderer.once('image-copied', (event, response) => {
            response.result === true ? resolve(response.data) : reject(response.data)
         })

         ipcRenderer.send('copy-image-to-clipboard', {
            format,
            buffer: payload.buffer,
         })
      })
   }

   private _mkProxyFor(objectName: string): ProxyHandler<Record<string, any>> {
      return {
         get: (target, prop): any => {
            if (typeof prop === 'string') {
               if (target[prop]) return target[prop]
               const fn = async (...args: any[]): Promise<any> => {
                  const result = await this.ipc.invoke('proxy', {
                     object: objectName,
                     method: prop,
                     props: args,
                  })
                  return result
               }
               target[prop] = fn
               return fn
            }
         },
      }
   }

   /** allow access to every electron dialog methods */
   dialog: Remotify<typeof Electron.dialog> = new Proxy({} as any, this._mkProxyFor('dialog'))
   clipboard: Remotify<typeof Electron.clipboard> = new Proxy({} as any, this._mkProxyFor('clipboard'))
   nativeImage: Remotify<typeof Electron.nativeImage> = new Proxy({} as any, this._mkProxyFor('nativeImage'))
   nativeTheme: Remotify<typeof Electron.nativeTheme> = new Proxy({} as any, this._mkProxyFor('nativeTheme'))
   safeStorage: Remotify<typeof Electron.safeStorage> = new Proxy({} as any, this._mkProxyFor('safeStorage'))
   net: Remotify<typeof Electron.net> = new Proxy({} as any, this._mkProxyFor('net'))

   /**
    * this is just a simple openFolder method to showcase how we can wrap electron methods;
    * I think it's better to use the dialog object directly.
    * for more complex use-case, use the dialog object above directly
    */
   async simpleOpenFolder(): Promise<AbsolutePath> {
      // require('electron').net.online
      const res = await this.dialog.showOpenDialog({ properties: ['openDirectory'] })
      return bang(res.filePaths[0] as AbsolutePath)
   }
}

type Promisify<T> = T extends Promise<infer U> ? T : Promise<T>
type Remotify<T extends object> = {
   [K in keyof T]: T[K] extends (...args: any[]) => any
      ? (...args: Parameters<T[K]>) => Promisify<ReturnType<T[K]>>
      : T[K] extends string | number | boolean
        ? () => Promisify<T[K]>
        : never
}
