import { marked } from 'marked'
import { observer } from 'mobx-react-lite'
import { StepL } from 'src/models/Step'
import { StepOutput_Text } from 'src/types/StepOutput'
import { OutputPreviewWrapperUI } from './OutputPreviewWrapperUI'
import { useSt } from 'src/state/stateContext'
import { TabsUI } from 'src/widgets/misc/TabUI'
import { TabUI } from 'src/app/layout/TabUI'

export const OutputTextPreviewUI = observer(function OutputTextPreviewUI_(p: { step?: Maybe<StepL>; output: StepOutput_Text }) {
    const st = useSt()
    const output = p.output
    const size = st.gallerySize
    const sizeStr = st.gallerySizeStr
    const message =
        output.data.kind === 'markdown' ? ( //
            <div
                tw={[
                    //
                    'bg-accent text-accent-content',
                    'text-center w-full font-bold',
                ]}
                style={{ lineHeight: sizeStr, fontSize: `${size / 4}px` }}
            >
                #MD
            </div>
        ) : output.data.kind === 'html' ? (
            '<HTML/>'
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
            <TabUI tw='w-full'>
                <div>rendered version</div>
                <div className='_MD w-full' dangerouslySetInnerHTML={{ __html: marked(p.output.data.content) }} />
                <div>raw version</div>
                <pre className='w-full'>{p.output.data.content}</pre>
            </TabUI>
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
            <div tw='card'>
                {/*  */}
                {p.output.data.content}
            </div>
        )

    return <div>unknown content</div>
})
