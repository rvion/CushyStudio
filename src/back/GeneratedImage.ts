// import type { PromptL } from '../models/Prompt'
// import type { ComfyImageInfo } from '../types/ComfyWsApi'
// import type { Maybe } from '../utils/types'

// import { nanoid } from 'nanoid'
// import * as path from 'path'
// import { ImageID, ImageT } from 'src/models/Image'
// import { logger } from '../logger/logger'
// import { AbsolutePath } from '../utils/fs/BrandedPaths'
// import { asAbsolutePath } from '../utils/fs/pathUtils'

// enum ImageStatus {
//     Known = 1,
//     Downloading = 2,
//     Saved = 3,
// }
// /** Cushy wrapper around ComfyImageInfo */
// export class ImageX implements ImageT {
//     private workspace: ServerState

//     /** 🔴 do not use */
//     convertToImageInput = (): string => {
//         return `../outputs/${this.data.filename}`
//         // return this.LoadImage({ image: name })
//     }

//     /** unique image id */
//     id: ImageID

//     constructor(
//         /** the prompt this file has been generated from */
//         public prompt: PromptL,
//         /** image info as returned by Comfy */
//         public data: ComfyImageInfo, // public uid: string,
//     ) {
//         this.id = nanoid() // `${this.prompt.name}_${GeneratedImage.imageID++}`
//         this.workspace = prompt.workspace
//         this.ready = this.downloadImageAndSaveToDisk()
//     }

//     // high level API ----------------------------------------------------------------------

//     // COMFY RELATIVE ----------------------------------------------------------------------
//     /** file name within the ComfyUI folder */
//     get comfyFilename() {
//         return this.data.filename
//     }

//     /** relative path on the comfy URL */
//     get comfyRelativePath(): string {
//         return `./outputs/${this.data.filename}`
//     }

//     /** url to acces the image */
//     get comfyURL(): string {
//         return this.workspace.getServerHostHTTP() + '/view?' + new URLSearchParams(this.data).toString()
//     }

//     // CONTENT ADRESS ----------------------------------------------------------------------

//     /** short md5 hash of the image content
//      * used to know if a ComfyUI server already has the image
//      */
//     get hash(): string {
//         throw new Error('🔴 NOT IMPLEMENTED')
//     }

//     /** path within the input folder */
//     comfyInputPath?: Maybe<string> = null

//     /** 🔴 */
//     uploadAsNamedInput = async (): Promise<string> => {
//         const res = await this.prompt.run.uploadURL(this.comfyURL)
//         console.log(`[makeAvailableAsInput]`, res)
//         this.comfyInputPath = res.name
//         return res.name
//     }

//     // CUSHY RELATIVE ----------------------------------------------------------------------
//     /** local workspace file name, without extension */
//     get localFileNameNoExt(): string {
//         return /*this.prompt.uid + '_' +*/ this.id
//     }

//     /** local workspace file name, WITH extension */
//     get localFileName(): string {
//         return this.localFileNameNoExt + '.png'
//     }

//     /** absolute path on the machine with vscode */
//     get localAbsolutePath(): AbsolutePath {
//         return asAbsolutePath(path.join(this.workspace.cacheFolderPath, 'outputs', this.localFileName))
//     }

//     // .cushy/cache/Run-20230501220410/FaxYjyW1-fLr8ovwECJzZ_prompt-4_21.png
//     // http://127.0.0.1:8388/Run-20230501220410/FaxYjyW1-fLr8ovwECJzZ_prompt-4_19.png
//     get localURL(): string {
//         return this.workspace.server.baseURL + this.localAbsolutePath.replace(this.workspace.cacheFolderPath, '')
//     }

//     toJSON = (): ImageT => {
//         return {
//             id: this.id,
//             // comfy
//             comfyURL: this.comfyURL,
//             comfyRelativePath: this.comfyRelativePath,
//             // local
//             localURL: this.localURL,
//             localAbsolutePath: this.localAbsolutePath,
//         }
//     }
//     // MISC ----------------------------------------------------------------------
//     /** true if file exists on disk; false otherwise */
//     status: ImageStatus = ImageStatus.Known
//     ready: Promise<true>

//     /** @internal */
//     private downloadImageAndSaveToDisk = async (): Promise<true> => {
//         if (this.status !== ImageStatus.Known) throw new Error(`image status is ${this.status}`)
//         this.status = ImageStatus.Downloading
//         const response = await fetch(this.comfyURL, {
//             headers: { 'Content-Type': 'image/png' },
//             method: 'GET',
//             // responseType: ResponseType.Binary,
//         })
//         const binArr = await response.buffer()
//         // const binArr = new Uint16Array(numArr)

//         this.workspace.writeBinaryFile(this.localAbsolutePath, binArr)
//         logger().info('🖼️ image saved')
//         this.status = ImageStatus.Saved
//         return true
//     }
// }
