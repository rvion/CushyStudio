import { observer } from 'mobx-react-lite'

import { Button } from '../../csuite/button/Button'
import { Message } from '../../csuite/inputs/shims'
import { RevealUI } from '../../csuite/reveal/RevealUI'
import { HostL } from '../../models/Host'

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
        <RevealUI
            showDelay={0}
            content={() => (
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
                    <div
                        tw='btn btn-sm'
                        onClick={async () => {
                            await host.fetchAndUpdateSchema()
                            return host.manager.updateHostPluginsAndModels()
                        }}
                    >
                        Reload Schema
                    </div>
                    <div tw='btn btn-sm btn-warning flex-1' onClick={() => host.manager.rebootComfyUI()}>
                        Restart ComfyUI
                    </div>
                </div>
            )}
        >
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
                    <Button loading={host.isUpdatingSchema} icon='mdiAlertCircle' look='error'>
                        empty schema
                    </Button>
                ) : (
                    <div className='btn btn-sm btn-ghost cursor-help'>
                        {p.showIcon && <span className='material-symbols-outlined text-green-400 '>check_circle</span>}
                        {host.isUpdatingSchema && <div tw='loading loading-spinner loading-xs' />}
                        <span className='text-success'>Schema</span>
                        {sizeTxt}
                    </div>
                )}
            </div>
        </RevealUI>
    )
})
