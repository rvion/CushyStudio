import { existsSync, unlinkSync, writeFileSync } from 'fs'
import { makeAutoObservable, reaction } from 'mobx'

import { getCaptionsForImageAt, getImagesInDirectory } from './captionningUtils'

// path means ~ abslute
// name means ~ path.pop()
export class PanelCaptioningState {
   constructor() {
      makeAutoObservable(this)

      // #region Reactions (automatic reactive behaviours)
      // load caption file when image changes
      reaction(
         () => this.captionFilePath,
         (fp) => (this.captions = getCaptionsForImageAt(fp)),
      )

      // save caption file when expected content change
      reaction(
         () => this.captionsFileContent,
         (content) => this.updateCaptionFile(content),
         { delay: 0.3 },
      )
   }

   // #region Current Folder
   folderPath: Maybe<string> = null
   get folderName(): string {
      return this.folderPath?.split('/').pop() ?? 'No Folder'
   }
   get files(): string[] {
      if (this.folderPath == null) return []
      return getImagesInDirectory(this.folderPath)
   }

   // #region Current Image
   private _activeImageIndex: number = 0
   get activeImageIndex(): number {
      return this._activeImageIndex
   }
   set activeImageIndex(val: number) {
      this._activeImageIndex = val
      this.captions = getCaptionsForImageAt(this.imageNameWithExt)
   }

   get imagePath(): string {
      return `${this.folderPath}/${this.imageNameWithExt}`
   }
   get imageNameWithExt(): string {
      return this.files[this.activeImageIndex]!
   }
   // 🔶 wrong code
   get imageNameWithoutExt(): string {
      return this.imageNameWithExt.split('.').shift()!
   }

   // #region Current Captions
   captions: string[] = []

   get captionsFileContent(): string {
      return this.captions.join('\n')
   }

   private _activeCaptionIndex: Map</* this.imagePath */ string, number> = new Map()
   // 🎱 private _activeCaptionIndex: number = 0

   get activeCaptionIndex(): number {
      return this._activeCaptionIndex.get(this.imagePath) ?? 0
      // 🎱 return this._activeCaptionIndex
   }
   set activeCaptionIndex(val: number) {
      this._activeCaptionIndex.set(this.imagePath, val)
      // 🎱 this._activeCaptionIndex = val
   }
   // #region Floating caption

   floatingCaption: string = ''

   // #region Utils
   get captionFilePath(): string {
      return `${this.folderPath}/${this.imageNameWithoutExt}.txt`
   }
   private updateCaptionFile(content: string): void {
      if (content == null) {
         if (existsSync(this.captionFilePath)) unlinkSync(this.captionFilePath)
      } else {
         writeFileSync(this.captionFilePath, content)
      }
   }
}
