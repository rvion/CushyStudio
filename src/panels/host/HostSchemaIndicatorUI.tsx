import { observer } from 'mobx-react-lite'
import { HostL } from 'src/models/Host'
import { RevealUI } from 'src/rsuite/RevealUI'
import { Loader, Message } from 'src/rsuite/shims'

export const HostSchemaIndicatorUI = observer(function HostSchemaIndicatorUI_(p: {
    //
    showIcon?: boolean
    showSize?: boolean
    host: HostL
}) {
    const host = p.host
    const size = host.schema?.size ?? 0
    const sizeTxt = p.showSize ? <div tw='text-xs text-opacity-50'>({size} nodes)</div> : null
    return (
        <RevealUI showDelay={0}>
            <div tw='flex'>
                {host.schema == null ? '🔴' : null}
                {/* LAST UPDATE */}
                {host.schemaUpdateResult ? (
                    host.schemaUpdateResult.type === 'error' ? (
                        <div className='btn btn-sm cursor-help'>
                            <span className='text-error'>update error</span>
                        </div>
                    ) : (
                        <div className='btn btn-sm cursor-help'>
                            <span className='text-success'>updated</span>
                        </div>
                    )
                ) : null}

                {/* SIZE */}
                {size === 0 ? (
                    <div tw='btn btn-sm bg-error text-error-content'>
                        <span className='material-symbols-outlined'>error</span>
                        {host.isUpdatingSchema && <div tw='loading loading-spinner loading-xs' />}
                        <div>empty schema</div>
                    </div>
                ) : (
                    <div className='btn btn-sm cursor-help'>
                        {p.showIcon && <span className='material-symbols-outlined text-green-400 '>check_circle</span>}
                        {host.isUpdatingSchema && <div tw='loading loading-spinner loading-xs' />}
                        <span className='text-success'>Schema</span>
                        {sizeTxt}
                    </div>
                )}
            </div>
            <div tw='menu'>
                {p.host.ws?.isOpen ? null : (
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
