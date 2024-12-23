import type { MediaImageL } from '../../models/MediaImage'
import type { STATE } from '../../state/state'

import { action, makeObservable, observable } from 'mobx'
import { nanoid } from 'nanoid'

import { createMediaImage_fromBlobObject } from '../../models/createMediaImage_fromWebFile'
import { FPath } from '../../models/FPath'

export const getLayers = (): any => {
   // console.log('🟢', (document as any).getElementById('miniPaint').contentWindow.Layers)
   return (document as any).getElementById('miniPaint').contentWindow.Layers
}

export class MinipaintState {
   constructor(public st: STATE) {
      makeObservable(this, {
         autoSave: observable,
         toggleAutoSave: action,
      })
   }

   autoSave: Maybe<NodeJS.Timeout> = null
   toggleAutoSave(): void {
      if (this.autoSave != null) {
         clearInterval(this.autoSave)
         this.autoSave = null
         return
      }
      this.autoSave = setInterval(() => {
         this.saveImage()
      }, 1000)
   }
   // { uri: img.comfyURL }
   // { uri: string }
   loadImage(iamgeL: MediaImageL): void {
      // window.getElemnt
      const img = document.createElement('img')
      img.crossOrigin = 'Anonymous'
      img.src = iamgeL.url
      img.onload = function (): void {
         const iframe = document.getElementById('miniPaint') as any
         const Layers = iframe.contentWindow.Layers
         const new_layer = {
            name: nanoid(8),
            type: 'image',
            data: img,
            width: img.naturalWidth || img.width,
            height: img.naturalHeight || img.height,
            width_original: img.naturalWidth || img.width,
            height_original: img.naturalHeight || img.height,
         }
         Layers.insert(new_layer)

         // if (true) {
         //     var mask_layer = {
         //         name: 'MASK',
         //         type: 'image',
         //         data: '',
         //         width: img.naturalWidth || img.width,
         //         height: img.naturalHeight || img.height,
         //         width_original: img.naturalWidth || img.width,
         //         height_original: img.naturalHeight || img.height,
         //     }
         //     Layers.insert(mask_layer)
         // }
      }
   }

   fileName: string = nanoid(8)

   get fileNameWithExt(): string {
      return this.fileName + '.png'
   }

   saveImage(): void {
      const Layers = getLayers()
      const dim = Layers.get_dimensions()
      const tempCanvas = document.createElement('canvas')
      const tempCtx = tempCanvas.getContext('2d')
      tempCanvas.width = dim.width
      tempCanvas.height = dim.height
      Layers.convert_layers_to_canvas(tempCtx)

      const data = tempCanvas.toDataURL()
      console.log(`${data.length} bytes`)
      tempCanvas.toBlob(async (blob) => {
         if (blob == null) throw new Error(`❌ blob is null`)
         const fpath = new FPath(`outputs/minipaint/${this.fileNameWithExt}`)
         void createMediaImage_fromBlobObject(blob, fpath)
      })
   }
}
