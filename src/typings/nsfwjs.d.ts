/// <reference types="node" />

export declare const NSFW_CLASSES: {
   [classId: number]: 'Drawing' | 'Hentai' | 'Neutral' | 'Porn' | 'Sexy'
}

export declare type frameResult = {
   index: number
   totalFrames: number
   predictions: Array<predictionType>
   image: HTMLCanvasElement | ImageData
}
export declare type classifyConfig = {
   topk?: number
   fps?: number
   onFrame?: (result: frameResult) => any
}
interface nsfwjsOptions {
   size?: number
   type?: string
}
export declare type predictionType = {
   className: (typeof NSFW_CLASSES)[keyof typeof NSFW_CLASSES]
   probability: number
}
export declare function load(
   base?: string,
   options?: {
      size: number
   },
): Promise<NSFWJS>
interface IOHandler {
   load: () => any
}
export declare class NSFWJS {
   endpoints: string[]
   model: any // tf.LayersModel | tf.GraphModel
   private options
   private pathOrIOHandler
   private intermediateModels
   private normalizationOffset
   constructor(modelPathBaseOrIOHandler: string | IOHandler, options: nsfwjsOptions)
   load(): Promise<void>
   infer(
      img: /* tf.Tensor3D | */ ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement,
      endpoint?: string,
   ): unknown /* tf.Tensor */
   classify(
      img: /* tf.Tensor3D |*/ ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement,
      topk?: number,
   ): Promise<Array<predictionType>>
   classifyGif(gif: HTMLImageElement | Buffer, config?: classifyConfig): Promise<Array<Array<predictionType>>>
}
export {}
