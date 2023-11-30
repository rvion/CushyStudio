import { marked } from 'marked'
import { observer } from 'mobx-react-lite'
import { StepL } from 'src/models/Step'
import { StepOutput_Text } from 'src/types/StepOutput'
import { OutputPreviewWrapperUI } from './OutputPreviewWrapperUI'

export const OutputTextPreviewUI = observer(function OutputTextPreviewUI_(p: { step?: Maybe<StepL>; output: StepOutput_Text }) {
    const output = p.output
    const message =
        output.data.kind === 'markdown' //
            ? '# MD'
            : output.data.kind === 'html'
            ? '<HTML/>'
            : output.data.content

    return (
        <OutputPreviewWrapperUI output={p.output}>
            <div
                //
                tw='bg-base-200 text-xs whitespace-pre-wrap overflow-hidden overflow-ellipsis'
            >
                {message}
            </div>
        </OutputPreviewWrapperUI>
    )
})

export const OutputTextUI = observer(function OutputTextUI_(p: { step?: Maybe<StepL>; output: StepOutput_Text }) {
    // 🔴 handle markdown / html / text
    if (p.output.data.kind === 'markdown')
        return (
            <div //
                className='_MD w-full'
                dangerouslySetInnerHTML={{ __html: marked(p.output.data.content) }}
            ></div>
        )

    if (p.output.data.kind === 'html')
        return (
            <div //
                className='_HTML w-full'
                dangerouslySetInnerHTML={{ __html: p.output.data.content }}
            ></div>
        )

    if (p.output.data.kind === 'text')
        return (
            <div //
                className='_TEXT w-full'
                dangerouslySetInnerHTML={{ __html: p.output.data.content }}
            ></div>
        )

    return <div>unknown content</div>
})
