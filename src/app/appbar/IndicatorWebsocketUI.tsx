import { observer } from 'mobx-react-lite'
import { RevealUI } from 'src/rsuite/RevealUI'
import { Button, Message } from 'src/rsuite/shims'
import { useSt } from '../../state/stateContext'

export const IndicatorWebsocketUI = observer(function IndicatorWebsocketUI_(p: {}) {
    const st = useSt()
    return (
        <RevealUI>
            {st.ws.isOpen ? (
                <Button size='sm' className='flex gap-1 text-sm px-1 rounded cursor-help'>
                    {/* <span className='material-symbols-outlined text-green-400 '>check_circle</span> */}
                    <span className='text-success'>WS</span>
                </Button>
            ) : (
                <div tw='btn btn-sm btn-error flex-nowrap'>
                    <div tw='loading loading-spinner loading-xs' />
                    ComfyUI
                </div>
            )}
            <div tw='menu'>
                {st.schemaReady.done ? null : (
                    <Message showIcon type='warning'>
                        <span>Is your ComfyUI server running? </span>
                        <span>You config file says it should be accessible at</span>
                        <div>{st.getWSUrl()}</div>
                    </Message>
                )}
                {st.ws.debugMessages.map((x, ix) =>
                    x.type === 'error' ? ( //
                        <div key={ix} className='text-red-400'>
                            {x.message}
                        </div>
                    ) : (
                        <div key={ix}>{x.message}</div>
                    ),
                )}
            </div>
        </RevealUI>
    )
})
