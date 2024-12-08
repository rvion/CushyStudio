import type { MediaTextL } from '../models/MediaText'
import type { StepL } from '../models/Step'

import { observer } from 'mobx-react-lite'

import { Frame } from '../csuite/frame/Frame'
import { Surface } from '../csuite/inputs/shims'
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
         <Frame //
            tooltip={'Text Output'}
            square
            icon='mdiText'
            iconSize='80%'
         />
      )

   return message
})

export const OutputTextUI = observer(function OutputTextUI_(p: { step?: Maybe<StepL>; output: MediaTextL }) {
   // 🔴 handle markdown / html / text
   if (p.output.data.kind === 'markdown')
      return (
         <Surface className='m-2 w-full'>
            <TabUI tw='w-full'>
               <div>rendered version</div>
               <MarkdownUI tw='w-full' markdown={p.output.data.content} />
               <div>raw version</div>
               <pre className='w-full'>{p.output.data.content}</pre>
            </TabUI>
         </Surface>
      )

   if (p.output.data.kind === 'html')
      return (
         <Surface className='m-2 w-full'>
            <div //
               className='_HTML _MD w-full'
               dangerouslySetInnerHTML={{ __html: p.output.data.content }}
            ></div>
         </Surface>
      )

   if (p.output.data.kind === 'text')
      return (
         <Surface className='m-2 w-full'>
            {/*  */}
            <div tw='text-xl font-bold'>Text:</div>
            {p.output.data.content}
         </Surface>
      )

   return <div>unknown content</div>
})
