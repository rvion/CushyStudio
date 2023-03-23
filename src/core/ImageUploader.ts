export const x = 1
// import type { ComfyClient } from './CushyClient'

// import { Body, fetch, ResponseType } from '@tauri-apps/api/http'
// import { CushyImage } from './CushyImage'

// export type ImageUploadResult = { name: string }

// export class ImageUploader {
//     constructor(public client: ComfyClient) {}

//     convertToInput = async (x: CushyImage): Promise<string> => {
//         // const foo = await this.get()
//         // foo.images[0]
//         const url = x.url
//         const i8arr: Uint8Array = await this.client.uploader.urlToBinary(url)
//         const name = await this.client.uploader.uploadToComfy(i8arr)
//         // console.log({ inputName })
//         return name
//     }

//     urlToBinary = async (url: string /* filename: string, mimeType: 'image/png'*/): Promise<Uint8Array> => {
//         const response = await fetch(url, {
//             headers: { 'Content-Type': 'image/png' },
//             method: 'GET',
//             responseType: ResponseType.Binary,
//         })
//         const rawArray: number[] = response.data as any
//         // const arr = new ArrayBuffer(rawArray)
//         if (!(response.data instanceof Uint8Array)) {
//             console.log(response.data)
//             console.log(typeof response.data)
//             console.log((response.data as any).constructor.name)
//             throw new Error('ERROR: response.data is not a Uint8Array')
//         }
//         return response.data
//     }
//     // const mime = 'image/png'
//     // const blob = new Blob([response.data as Uint8Array], { type: mime })
//     // console.log('🟢', response)
//     // const file = new File([blob], 'image123112.png', { type: mime })
//     // console.log(file)
//     // return file
//     // let data = await response.blob()
//     // let metadata = { type: mimeType }
//     // let file = new File([data], filename, metadata)
//     // return file
//     /** upload a file to comfy so you can use it as input */

//     uploadToComfy = async (file: Uint8Array): Promise<string> => {
//         // try {
//         // Wrap file in formdata so it includes filename
//         // const body = new FormData()
//         // body.append('image', file)
//         const uploadURL = this.client.serverHostHTTP + '/upload/image'
//         console.log({ uploadURL })
//         // console.log({ body })

//         try {
//             const resp = await fetch(uploadURL, {
//                 method: 'POST',
//                 body: Body.form({ image: file }),
//             })
//             console.log(resp)
//             if (resp.status === 200) {
//                 const data: ImageUploadResult = (await resp.data) as any
//                 console.log('🚀 ~ file: ImageUploader.ts:16 ~ ImageUploader ~ upload= ~ data:', data)
//                 // Add the file as an option and update the widget value
//                 // if (!imageWidget.options.values.includes(data.name)) {
//                 //     imageWidget.options.values.push(data.name)
//                 // }

//                 // if (updateNode) {
//                 //     showImage(data.name)

//                 //     imageWidget.value = data.name
//                 // }

//                 return data.name
//             } else {
//                 alert(resp.status + ' - ' + resp.ok)
//             }
//             return ''
//             // } catch (error) {
//             //     alert(error);
//             // }
//         } catch (error) {
//             console.log(error)
//             return 'error'
//         }
//     }
// }
