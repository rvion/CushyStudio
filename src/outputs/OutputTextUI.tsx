import { marked } from 'marked'
import { observer } from 'mobx-react-lite'

import { OutputPreviewWrapperUI } from './OutputPreviewWrapperUI'
import { TabUI } from 'src/app/layout/TabUI'
import { StepL } from 'src/models/Step'
import { MarkdownUI } from 'src/rsuite/MarkdownUI'
import { Panel } from 'src/rsuite/shims'
import { useSt } from 'src/state/stateContext'
import { StepOutput_Text } from 'src/types/StepOutput'

export const OutputTextPreviewUI = observer(function OutputTextPreviewUI_(p: {
    //
    step?: Maybe<StepL>
    output: StepOutput_Text
}) {
    const st = useSt()
    const output = p.output
    const size = st.historySize
    const sizeStr = st.historySizeStr
    const message =
        output.data.kind === 'markdown' ? ( //
            <div
                tw={[
                    //
                    'bg-accent text-accent-content',
                    'text-center w-full font-bold',
                ]}
                style={{ lineHeight: sizeStr, fontSize: `${size / 3}px` }}
            >
                MD
            </div>
        ) : output.data.kind === 'html' ? (
            <div
                tw={[
                    //
                    'bg-purple-500 text-black',
                    'text-center w-full font-bold',
                ]}
                style={{ lineHeight: sizeStr, fontSize: `${size / 5}px` }}
            >
                {'<HTML/>'}
            </div>
        ) : (
            <div tw='bg-base-200 text-base-content text-xs whitespace-pre-wrap overflow-hidden overflow-ellipsis'>
                {output.data.content}
            </div>
        )

    return <OutputPreviewWrapperUI output={p.output}>{message}</OutputPreviewWrapperUI>
})

export const OutputTextUI = observer(function OutputTextUI_(p: { step?: Maybe<StepL>; output: StepOutput_Text }) {
    // 🔴 handle markdown / html / text
    if (p.output.data.kind === 'markdown')
        return (
            <Panel className='w-full m-2'>
                <TabUI tw='w-full'>
                    <div>rendered version</div>
                    <MarkdownUI tw='w-full' markdown={p.output.data.content} />
                    <div>raw version</div>
                    <pre className='w-full'>{p.output.data.content}</pre>
                </TabUI>
            </Panel>
        )

    if (p.output.data.kind === 'html')
        return (
            <Panel className='w-full m-2'>
                <div //
                    className='_HTML _MD w-full'
                    dangerouslySetInnerHTML={{ __html: p.output.data.content }}
                ></div>
            </Panel>
        )

    if (p.output.data.kind === 'text')
        return (
            <Panel className='w-full m-2'>
                {/*  */}
                <div tw='font-bold text-xl'>Text:</div>
                {p.output.data.content}
            </Panel>
        )

    return <div>unknown content</div>
})
