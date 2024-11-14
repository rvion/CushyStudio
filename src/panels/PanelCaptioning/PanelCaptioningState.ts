import { existsSync, unlinkSync, writeFileSync } from 'fs'
import { makeAutoObservable, reaction } from 'mobx'
import { type MutableRefObject, type RefObject, useRef } from 'react'

import { clamp } from '../../csuite/utils/clamp'
import { getCaptionsForImageAt, getImagesInDirectory } from './captionningUtils'

// path means ~ abslute
// name means ~ path.pop()

export type CaptionFocusOption = 'caption' | 'globalCaption'
export class PanelCaptioningState {
   get debug(): string {
      return JSON.stringify(
         {
            folderPath: this.folderPath,
            folderName: this.folderName,
            files: this.files,
            activeImageIndex: this.activeImageIndex,
            imagePath: this.imagePath,
            imageNameWithExt: this.imageNameWithExt,
            imageNameWithoutExt: this.imageNameWithoutExt,
            captions: this.captions,
            captionsFileContent: this.captionsFileContent,
            captionFilePath: this.captionFilePath,
            activeCaptionIndex: this.activeCaptionIndex,
         },
         null,
         3,
      )
   }
   constructor(
      private props: {
         onFolderChange?: (folderPath: string) => void
         startFolder?: Maybe<string>
         inputRefCaption?: RefObject<HTMLInputElement>
         inputRefCaptionGlobal?: RefObject<HTMLInputElement>
      } = {},
   ) {
      if (props.startFolder != null) {
         this.folderPath = props.startFolder
         this.activeImageIndex = 0
      }
      if (props.inputRefCaption != null) this.inputRefCaption = props.inputRefCaption
      if (props.inputRefCaptionGlobal != null) this.inputRefCaptionGlobal = props.inputRefCaptionGlobal

      makeAutoObservable(this)
   }

   // #region Current Folder
   private _folderPath: Maybe<string> = null
   get folderPath(): Maybe<string> {
      return this._folderPath
   }
   set folderPath(val: Maybe<string>) {
      this._folderPath = val
      if (val != null) this.props.onFolderChange?.(val)
   }

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
      val = clamp(val, 0, this.files.length - 1)
      this._activeImageIndex = val
      this.captions = getCaptionsForImageAt(this.captionFilePath)
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
   addCaption(newCaption: string): void {
      if (this.captions.includes(newCaption)) return
      this.captions.push(newCaption)
      this.updateCaptionFile(this.captionsFileContent)
   }
   removeCaption(toRemove: string): void {
      this.removeCaptionAt(this.captions.indexOf(toRemove))
   }
   removeCaptionAt(ix: number): void {
      if (ix == -1) return
      this.captions.splice(ix, 1)
      this.updateCaptionFile(this.captionsFileContent)
   }
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
      val = clamp(val, 0, this.captions.length - 1)
      this._activeCaptionIndex.set(this.imagePath, val)
      // 🎱 this._activeCaptionIndex = val
   }
   // #region Floating caption

   floatingCaption: string = ''

   // #region Utils
   get captionFilePath(): string {
      return `${this.folderPath}/${this.imageNameWithoutExt}.txt`
   }

   inputRefCaption?: RefObject<HTMLInputElement>
   inputRefCaptionGlobal?: RefObject<HTMLInputElement>

   focusInput(type: CaptionFocusOption): void {
      switch (type) {
         case 'caption': {
            if (!this.inputRefCaption || !this.inputRefCaption.current) {
               return
            }
            this.inputRefCaption.current.focus()
            break
         }
         case 'globalCaption': {
            if (!this.inputRefCaptionGlobal || !this.inputRefCaptionGlobal.current) {
               return
            }
            this.inputRefCaptionGlobal.current.focus()
            break
         }
      }
   }

   private updateCaptionFile(content: string): void {
      if (content == null) {
         if (existsSync(this.captionFilePath)) unlinkSync(this.captionFilePath)
      } else {
         writeFileSync(this.captionFilePath, content)
      }
   }

   updateCaptions(): void {
      this.updateCaptionFile(this.captionsFileContent)
   }
}
