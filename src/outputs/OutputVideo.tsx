import type { MediaVideoL } from '../models/MediaVideo'
import type { StepL } from '../models/Step'

import { observer } from 'mobx-react-lite'

export const OutputVideoPreviewUI = observer(function OutputImagePreviewUI_(p: {
   //
   step?: Maybe<StepL>
   output: MediaVideoL
   size?: string
}) {
   const size = cushy.historySize
   const sizeStr = cushy.historySizeStr
   return (
      <div
         tw={[
            //
            'bg-red-400 text-black',
            'w-full text-center font-bold',
         ]}
         style={{ fontSize: `${size / 2}px` }}
      >
         <span style={{ lineHeight: sizeStr }} className='material-symbols-outlined m-0 p-0'>
            play_circle
         </span>
      </div>
   )
})

export const OutputVideoUI = observer(function OutputVideoUI_(p: {
   step?: Maybe<StepL>
   output: MediaVideoL
}) {
   return (
      <video
         style={{
            objectFit: 'contain',
            // ...extraProps,
         }}
         src={p.output.url}
         controls
         autoPlay
         loop
      />
   )
})
