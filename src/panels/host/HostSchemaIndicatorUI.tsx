import { observer } from 'mobx-react-lite'
import { HostL } from 'src/models/Host'
import { RevealUI } from 'src/rsuite/reveal/RevealUI'
import { Message } from 'src/rsuite/shims'

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
                        <div className='btn btn-sm btn-ghost cursor-help'>
                            <span className='text-error'>history</span>
                        </div>
                    ) : p.showIcon ? (
                        <div className='btn btn-sm btn-ghost cursor-help'>
                            {p.showIcon && <span className='material-symbols-outlined text-green-400 '>check_circle</span>}
                        </div>
                    ) : null
                ) : null}

                {/* SIZE */}
                {size === 0 ? (
                    <div tw='btn btn-sm btn-ghost bg-error text-error-content'>
                        <span className='material-symbols-outlined'>error</span>
                        {host.isUpdatingSchema && <div tw='loading loading-spinner loading-xs' />}
                        <div>empty schema</div>
                    </div>
                ) : (
                    <div className='btn btn-sm btn-ghost cursor-help'>
                        {p.showIcon && <span className='material-symbols-outlined text-green-400 '>check_circle</span>}
                        {host.isUpdatingSchema && <div tw='loading loading-spinner loading-xs' />}
                        <span className='text-success'>Schema</span>
                        {sizeTxt}
                    </div>
                )}
            </div>
            <div tw='menu'>
                <div tw='text-xs text-opacity-50'>({size} nodes)</div>
                {p.host.ws?.isOpen ? null : (
                    <Message showIcon type='warning'>
                        <div>Is your ComfyUI server running? </div>
                        <div>You config file says it should be accessible at</div>
                        <div>{host.getServerHostHTTP()}</div>
                        <div>{host.getWSUrl()}</div>
                    </Message>
                )}
                <pre>{host.schemaRetrievalLogs.join('\n')}</pre>
                <div tw='btn btn-sm btn-warning flex-1' onClick={() => host.manager.rebootComfyUI()}>
                    Restart ComfyUI
                </div>
            </div>
        </RevealUI>
    )
})
