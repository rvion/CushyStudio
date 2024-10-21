import { observer } from 'mobx-react-lite'

import { ErrorBoundaryUI } from '../../csuite/errors/ErrorBoundaryUI'
import { InputStringUI } from '../../csuite/input-string/InputStringUI'
import { sampleInputStringUIProps } from '../../csuite/input-string/sampleInputStringUIProps'
import { MessageErrorUI } from '../../csuite/messages/MessageErrorUI'
import { MessageInfoUI } from '../../csuite/messages/MessageInfoUI'
import { MessageWarningUI } from '../../csuite/messages/MessageWarningUI'

/** Freely modify this as you like, then pick the "Scratch Pad" option in the top left. Do not commit changes made to this. */
export const PlaygroundMessages = observer(function PlaygroundImportFromComfy_(p: {}) {
    return (
        <ErrorBoundaryUI>
            <div tw='flex flex-col gap-1'>
                <div tw='flex flex-col gap-1'>
                    <div tw='divider my-0'>text non-buffered</div>
                    <InputStringUI tw='w-96' {...sampleInputStringUIProps} placeholder='test' />
                    <InputStringUI tw='w-96' getValue={() => ''} setValue={() => {}} placeholder='test' />
                    <InputStringUI tw='w-96' {...sampleInputStringUIProps} buffered={null} />
                    <div tw='divider my-0'>text buffered</div>
                    <InputStringUI tw='w-96' {...sampleInputStringUIProps} />
                    <InputStringUI tw='w-96' icon='mdiText' {...sampleInputStringUIProps} />
                    <InputStringUI tw='w-96' icon='mdiAccessPointCheck' {...sampleInputStringUIProps} />
                </div>
                <div tw='divider my-0'>w-fit on container</div>
                <div tw='w-fit'>
                    <MessageInfoUI title='foo' />
                    <MessageErrorUI title='foobar' />
                    <MessageWarningUI title='foo' />
                </div>
                <div tw='divider my-0'>w-fit on message</div>
                <div>
                    <MessageInfoUI tw='w-fit' title='foo' />
                    <MessageErrorUI tw='w-fit' title='foobar' />
                    <MessageWarningUI tw='w-fit' title='foo' />
                </div>
                <div tw='divider my-0'>messages w-full with simple test</div>
                <MessageInfoUI>test</MessageInfoUI>
                <MessageErrorUI>test</MessageErrorUI>
                <MessageWarningUI>test</MessageWarningUI>
                <div tw='divider my-0'>inline flex-start</div>
                <div tw='flex items-start gap-1'>
                    <MessageInfoUI>test</MessageInfoUI>
                    <MessageErrorUI title='test'>test</MessageErrorUI>
                    <MessageWarningUI>test</MessageWarningUI>
                    <MessageErrorUI title='test'>
                        <div>test</div>
                        <div>test</div>
                        <div>test</div>
                    </MessageErrorUI>
                </div>
                <div tw='divider my-0'>inline</div>
                <div tw='flex gap-1 '>
                    <MessageInfoUI>test</MessageInfoUI>
                    <MessageErrorUI title='test'>test</MessageErrorUI>
                    <MessageWarningUI>test</MessageWarningUI>
                    <MessageErrorUI title='test'>
                        <div>test</div>
                        <div>test</div>
                        <div>test</div>
                    </MessageErrorUI>
                </div>
                <div tw='divider my-0'>test</div>
                <MessageInfoUI title='Info title'>test</MessageInfoUI>
                <MessageErrorUI title='Error title'>test</MessageErrorUI>
                <MessageWarningUI title='Warning title'>test</MessageWarningUI>
                <div tw='divider my-0'>test</div>
                <MessageInfoUI markdown='### test' />
                <MessageErrorUI markdown='### test' />
                <MessageWarningUI markdown='### test' />
                <div tw='divider my-0'>test</div>
            </div>
        </ErrorBoundaryUI>
    )
})
