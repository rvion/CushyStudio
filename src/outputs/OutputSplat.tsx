import type { MediaSplatL } from '../models/MediaSplat'
import type { StepL } from '../models/Step'

export const OutputSplatPreviewUI = obs(function OutputImagePreviewUI_(p: {
   //
   step?: Maybe<StepL>
   output: MediaSplatL
}) {
   const size = cushy.historySize
   const sizeStr = cushy.historySizeStr
   return (
      <div
         tw='bg-secondary text-secondary-content w-full text-center'
         style={{ lineHeight: sizeStr, fontSize: `${size / 4}px` }}
      >
         Splat
      </div>
   )
})

export const OutputSplatUI = obs(function OutputSplatUI_(p: { step?: Maybe<StepL>; output: MediaSplatL }) {
   return (
      <iframe //
         tabIndex={-1}
         autoFocus
         className='size-full'
         frameBorder='0'
         src='https://antimatter15.com/splat/'
      ></iframe>
   )
})
