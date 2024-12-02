import type { MediaTextL } from '../models/MediaText'
import type { StepL } from '../models/Step'

import { observer } from 'mobx-react-lite'

import { LegacySurfaceUI } from '../csuite/inputs/LegacySurfaceUI'
import { MarkdownUI } from '../csuite/markdown/MarkdownUI'
import { TabUI } from '../csuite/tabs/TabUI'

export const OutputTextPreviewUI = observer(function OutputTextPreviewUI_(p: {
   //
   step?: Maybe<StepL>
   output: MediaTextL
}) {
   const output = p.output
   const message =
      output.data.kind === 'markdown' ? ( //
         <div
            tw={[
               //
               '[font-size:60%] [line-height:100%]',
               'bg-accent text-accent-content',
               'w-full text-center font-bold',
            ]}
         >
            MD
         </div>
      ) : output.data.kind === 'html' ? (
         <div
            tw={[
               //
               '[font-size:60%] [line-height:100%]',
               'bg-purple-500 text-black',
               'w-full text-center font-bold',
            ]}
         >
            {'<HTML/>'}
         </div>
      ) : (
         <div //
            tw='overflow-hidden whitespace-pre-wrap text-xs '
         >
            {output.data.content}
         </div>
      )

   return message
})

export const OutputTextUI = observer(function OutputTextUI_(p: { step?: Maybe<StepL>; output: MediaTextL }) {
   // 🔴 handle markdown / html / text
   if (p.output.data.kind === 'markdown')
      return (
         <LegacySurfaceUI className='m-2 w-full'>
            <TabUI tw='w-full'>
               <div>rendered version</div>
               <MarkdownUI tw='w-full' markdown={p.output.data.content} />
               <div>raw version</div>
               <pre className='w-full'>{p.output.data.content}</pre>
            </TabUI>
         </LegacySurfaceUI>
      )

   if (p.output.data.kind === 'html')
      return (
         <LegacySurfaceUI className='m-2 w-full'>
            <div //
               className='_HTML _MD w-full'
               dangerouslySetInnerHTML={{ __html: p.output.data.content }}
            ></div>
         </LegacySurfaceUI>
      )

   if (p.output.data.kind === 'text')
      return (
         <LegacySurfaceUI className='m-2 w-full'>
            {/*  */}
            <div tw='text-xl font-bold'>Text:</div>
            {p.output.data.content}
         </LegacySurfaceUI>
      )

   return <div>unknown content</div>
})
