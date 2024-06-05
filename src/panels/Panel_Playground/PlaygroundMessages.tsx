import { observer } from 'mobx-react-lite'

import { ErrorBoundaryUI } from '../../rsuite/errors/ErrorBoundaryUI'
import { MessageErrorUI } from '../../rsuite/messages/MessageErrorUI'
import { MessageInfoUI } from '../../rsuite/messages/MessageInfoUI'
import { MessageWarningUI } from '../../rsuite/messages/MessageWarningUI'

/** Freely modify this as you like, then pick the "Scratch Pad" option in the top left. Do not commit changes made to this. */
export const PlaygroundMessages = observer(function PlaygroundImportFromComfy_(p: {}) {
    return (
        <ErrorBoundaryUI>
            <div tw='flex flex-col gap-1'>
                <div tw='divider my-0'>test</div>
                <div tw='w-fit'>
                    <MessageInfoUI title='foo' />
                    <MessageErrorUI title='foo' />
                    <MessageWarningUI title='foo' />
                </div>
                <div tw='divider my-0'>test</div>
                <MessageInfoUI>test</MessageInfoUI>
                <MessageErrorUI>test</MessageErrorUI>
                <MessageWarningUI>test</MessageWarningUI>
                <div tw='divider my-0'>test</div>
                <div tw='flex gap-1'>
                    <MessageInfoUI>test</MessageInfoUI>
                    <MessageErrorUI>test</MessageErrorUI>
                    <MessageWarningUI>test</MessageWarningUI>
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
