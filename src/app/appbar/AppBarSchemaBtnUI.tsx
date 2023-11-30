import { observer } from 'mobx-react-lite'
import { RevealUI } from 'src/rsuite/RevealUI'
import { Loader, Message } from 'src/rsuite/shims'
import { useSt } from '../../state/stateContext'

export const IndicatorSchemaUI = observer(function IndicatorSchemaUI_(p: {}) {
    const st = useSt()
    return (
        <RevealUI showDelay={0}>
            <div>
                {st.schemaReady.done ? (
                    <div className='flex gap-1 px-1 rounded cursor-help'>
                        <span className='text-success'>Schema</span>
                    </div>
                ) : (
                    <div tw='btn btn-sm btn-outline flex-nowrap'>
                        <Loader size='xs' />
                        schema
                    </div>
                )}
            </div>
            <div tw='menu'>
                {st.schemaReady.done ? null : (
                    <Message showIcon type='warning'>
                        Is your ComfyUI server running? You config file says it should be accessible at
                        <div>{st.getServerHostHTTP()}</div>
                        <div>{st.getWSUrl()}</div>
                    </Message>
                )}
                <pre>{st.schemaRetrievalLogs.join('\n')}</pre>
            </div>
        </RevealUI>
    )
})
