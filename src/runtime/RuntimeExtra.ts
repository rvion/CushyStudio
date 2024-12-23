import type { Runtime } from './Runtime'

import { makeAutoObservable } from 'mobx'

/** namespace for all extra utils */
export class RuntimeExtra {
   constructor(private rt: Runtime) {
      makeAutoObservable(this)
   }

   // ⏸️ // UPLOAD ------------------------------------------------------------------------------------------
   // ⏸️ /** upload an image present on disk to ComfyUI */
   // ⏸️ upload_FileAtAbsolutePath: Uploader['upload_FileAtAbsolutePath']
   // ⏸️
   // ⏸️ /** upload an image that can be downloaded form a given URL to ComfyUI */
   // ⏸️ upload_ImageAtURL: Uploader['upload_ImageAtURL']
   // ⏸️
   // ⏸️ /** upload an image from dataURL */
   // ⏸️ upload_dataURL: Uploader['upload_dataURL']
   // ⏸️
   // ⏸️ /** upload a deck asset to ComfyUI */
   // ⏸️ upload_Asset: Uploader['upload_Asset']
   // ⏸️
   // ⏸️ /** upload a Blob */
   // ⏸️ upload_Blob: Uploader['upload_Blob']
   // ⏸️
   // ⏸️ // LOAD IMAGE --------------------------------------------------------------------------------------
   // ⏸️ /** load an image present on disk to ComfyUI */
   // ⏸️ load_FileAtAbsolutePath = async (absPath: AbsolutePath): Promise<ImageAndMask> => {
   // ⏸️     const res = await this.st.uploader.upload_FileAtAbsolutePath(absPath)
   // ⏸️     return this.loadImageAnswer({ type: 'ComfyImage', imageName: res.name })
   // ⏸️ }
   // ⏸️
   // ⏸️ /** load an image that can be downloaded form a given URL to ComfyUI */
   // ⏸️ load_ImageAtURL = async (url: string): Promise<ImageAndMask> => {
   // ⏸️     const res = await this.st.uploader.upload_ImageAtURL(url)
   // ⏸️     return this.loadImageAnswer({ type: 'ComfyImage', imageName: res.name })
   // ⏸️ }
   // ⏸️ /** load an image from dataURL */
   // ⏸️ load_dataURL = async (dataURL: string): Promise<ImageAndMask> => {
   // ⏸️     const res: ComfyUploadImageResult = await this.st.uploader.upload_dataURL(dataURL)
   // ⏸️     // this.st.db.images.create({ infos:  })
   // ⏸️     return this.loadImageAnswer({ type: 'ComfyImage', imageName: res.name })
   // ⏸️ }
   // ⏸️
   // ⏸️ /** load a deck asset to ComfyUI */
   // ⏸️ load_Asset = async (asset: RelativePath): Promise<ImageAndMask> => {
   // ⏸️     const res = await this.st.uploader.upload_Asset(asset)
   // ⏸️     return this.loadImageAnswer({ type: 'ComfyImage', imageName: res.name })
   // ⏸️ }
   // ⏸️ /** load a Blob */
   // ⏸️ load_Blob = async (blob: Blob): Promise<ImageAndMask> => {
   // ⏸️     const res = await this.st.uploader.upload_Blob(blob)
   // ⏸️     return this.loadImageAnswer({ type: 'ComfyImage', imageName: res.name })
   // ⏸️ }
}
