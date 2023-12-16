import { observer } from 'mobx-react-lite'
import { HostL } from 'src/models/Host'
import { RevealUI } from 'src/rsuite/RevealUI'
import { Loader, Message } from 'src/rsuite/shims'

export const HostSchemaIndicatorUI = observer(function HostSchemaIndicatorUI_(p: {
    //
    showIcon?: boolean
    host: HostL
}) {
    const host = p.host

    return (
        <RevealUI showDelay={0}>
            <div>
                {host.schemaReady.done ? (
                    <div className='btn btn-sm cursor-help'>
                        {p.showIcon && <span className='material-symbols-outlined text-green-400 '>check_circle</span>}
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
                {host.schemaReady.done ? null : (
                    <Message showIcon type='warning'>
                        Is your ComfyUI server running? You config file says it should be accessible at
                        <div>{host.getServerHostHTTP()}</div>
                        <div>{host.getWSUrl()}</div>
                    </Message>
                )}
                <pre>{host.schemaRetrievalLogs.join('\n')}</pre>
            </div>
        </RevealUI>
    )
})
