import { makeAutoObservable } from 'mobx'

export type VirtualFolder<T extends { virtualFolder: string }> = {
   folderPath: string
   // app: CushyAppL
   vh: VirtualHierarchy<T>
}

export class VirtualHierarchy<T extends { virtualFolder: string }> {
   constructor(public getItems: () => T[]) {
      makeAutoObservable(this)
   }

   get items(): T[] {
      return this.getItems()
   }

   // drafts at .... --------------------------------------------
   get topLevelItems(): T[] {
      return this.items.filter((x) => x.virtualFolder === '')
   }

   getItemsInFolder = (virtualFolderPath: string): T[] => {
      // remove tailing '/' if present
      if (virtualFolderPath.endsWith('/')) virtualFolderPath = virtualFolderPath.slice(0, -1)
      return this.items.filter((x) => x.virtualFolder === virtualFolderPath)
   }

   // folders at .... --------------------------------------------
   getTopLevelFolders = (): string[] => {
      const subFolders = new Set<string>()
      for (const draft of this.items) {
         const folder = draft.virtualFolder
         const pieces = folder.split('/')
         if (pieces.length === 0) continue
         const fisrtPiece = pieces[0]
         if (fisrtPiece === '') continue
         subFolders.add(fisrtPiece!)
      }
      // console.log(`[🟢] ${Array.from(subFolders)}`)
      return Array.from(subFolders)
   }

   getSubFolders = (virtualFolder: string): string[] => {
      if (virtualFolder === '') return this.getTopLevelFolders()
      // add tailing '/' if absent
      if (!virtualFolder.endsWith('/')) virtualFolder += '/'
      const subFolders = new Set<string>()
      for (const draft of this.items) {
         const folder = draft.virtualFolder
         if (!folder.startsWith(virtualFolder)) continue
         const subFolder = folder.slice(virtualFolder.length).split('/')[0]
         subFolders.add(virtualFolder + subFolder)
      }
      return Array.from(subFolders)
   }
}
