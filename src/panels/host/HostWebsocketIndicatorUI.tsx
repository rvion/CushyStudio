import { observer } from 'mobx-react-lite'

import { HostL } from '../../models/Host'
import { RevealUI } from '../../rsuite/reveal/RevealUI'
import { Message } from '../../rsuite/shims'
import { useSt } from '../../state/stateContext'
import { _formatAsRelativeDateTime } from '../../updater/_getRelativeTimeString'

export const HostWebsocketIndicatorUI = observer(function HostWebsocketIndicatorUI_(p: {
    //
    showIcon?: boolean
    host: HostL
}) {
    const ws = p.host.ws
    if (p.host.data.isVirtual)
        return (
            <RevealUI showDelay={0} content={() => <div tw='p-2'>Not Applicable</div>}>
                <div tw='btn btn-sm btn-ghost text-opacity-25'>WS</div>
            </RevealUI>
        )
    return (
        <RevealUI showDelay={0} content={() => <HostQuickMenuUI host={p.host} />}>
            {ws == null ? (
                <div tw='btn btn-sm btn-ghost opacity-50'>
                    {p.showIcon && <span className='material-symbols-outlined '>cloud_off</span>}
                    <span className=''>WS</span>
                </div>
            ) : ws?.isOpen ? (
                <div tw='btn btn-sm btn-ghost'>
                    {p.showIcon && <span className='material-symbols-outlined text-green-400 '>check_circle</span>}
                    <span className='text-success'>WS</span>
                </div>
            ) : (
                <div tw='btn btn-sm btn-ghost btn-error flex-nowrap'>
                    <div tw='loading loading-spinner loading-xs' />
                    WS
                </div>
            )}
        </RevealUI>
    )
})

export const HostQuickMenuUI = observer(function HostQuickMenuUI_(p: { host: HostL }) {
    const st = useSt()
    const host = p.host
    const ws = host.ws
    return (
        <div tw='menu'>
            {ws?.isOpen ? null : (
                <Message showIcon type='warning'>
                    <span>Is your ComfyUI server running? </span>
                    <span>You config file says it should be accessible at</span>
                    <div>{st.getWSUrl()}</div>
                </Message>
            )}
            {ws?.debugMessages.map((x, ix) =>
                x.type === 'error' ? ( //
                    <div key={ix} className='text-red-400'>
                        {x.message}
                    </div>
                ) : (
                    <div key={ix}>{x.message}</div>
                ),
            )}
            <div // logs
                tw='opacity-85 overflow-auto resize'
                style={{ width: '800px', maxHeight: '400px' }}
            >
                <div>
                    Logs:
                    <div className='join'>
                        <div onClick={() => host.enableServerLogs()} className='btn btn-sm'>
                            On
                        </div>
                        <div onClick={() => host.enableServerLogs()} className='btn btn-sm'>
                            Off
                        </div>
                    </div>
                </div>
                {p.host.serverLogs.toReversed().map((l) => {
                    return (
                        <div style={{ borderBottom: '.5px solid #555' }} key={l.id} tw='text-xs text-opacity-75'>
                            {l.at}
                            {l.content}
                        </div>
                    )
                })}
            </div>
        </div>
    )
})
