import type { MediaSplatL } from '../models/MediaSplat'
import type { StepL } from '../models/Step'

import { observer } from 'mobx-react-lite'


export const OutputSplatPreviewUI = observer(function OutputImagePreviewUI_(p: {
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

export const OutputSplatUI = observer(function OutputSplatUI_(p: {
   step?: Maybe<StepL>
   output: MediaSplatL
}) {
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
