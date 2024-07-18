import type { MediaTextL } from '../models/MediaText'

import { observer } from 'mobx-react-lite'

import { Surface } from '../csuite/inputs/shims'
import { MarkdownUI } from '../csuite/markdown/MarkdownUI'
import { TabUI } from '../csuite/tabs/TabUI'
import { StepL } from '../models/Step'

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
                    '[line-height:100%] [font-size:60%]',
                    'bg-accent text-accent-content',
                    'text-center w-full font-bold',
                ]}
            >
                MD
            </div>
        ) : output.data.kind === 'html' ? (
            <div
                tw={[
                    //
                    '[line-height:100%] [font-size:60%]',
                    'bg-purple-500 text-black',
                    'text-center w-full font-bold',
                ]}
            >
                {'<HTML/>'}
            </div>
        ) : (
            <div //
                tw='text-xs whitespace-pre-wrap overflow-hidden '
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
            <Surface className='w-full m-2'>
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
            <Surface className='w-full m-2'>
                <div //
                    className='_HTML _MD w-full'
                    dangerouslySetInnerHTML={{ __html: p.output.data.content }}
                ></div>
            </Surface>
        )

    if (p.output.data.kind === 'text')
        return (
            <Surface className='w-full m-2'>
                {/*  */}
                <div tw='font-bold text-xl'>Text:</div>
                {p.output.data.content}
            </Surface>
        )

    return <div>unknown content</div>
})
