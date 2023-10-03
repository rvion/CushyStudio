import { observer } from 'mobx-react-lite'
import { Button, Loader, Message, Popover, Whisper } from 'rsuite'
import { useSt } from '../../FrontStateCtx'

export const WebsocketIndicatorUI = observer(function WebsocketIndicatorUI_(p: {}) {
    const st = useSt()
    return (
        <Whisper
            enterable
            placement='auto'
            speaker={
                <Popover>
                    {/*  */}
                    {st.schemaReady.done ? null : (
                        <Message showIcon type='warning'>
                            <span>Is your ComfyUI server running? </span>
                            <span>You config file says it should be accessible at</span>
                            <div>{st.getWSUrl()}</div>
                        </Message>
                    )}
                    Debug Logs:
                    {st.ws.debugMessages.map((x, ix) =>
                        x.type === 'error' ? ( //
                            <div key={ix} className='text-red-400'>
                                {x.message}
                            </div>
                        ) : (
                            <div key={ix}>{x.message}</div>
                        ),
                    )}
                </Popover>
            }
        >
            {st.schemaReady.done ? (
                <div className='flex gap-2'>
                    <span className='material-symbols-outlined text-green-400'>check_circle</span>
                    <span className='text-green-400'>WS ready</span>
                </div>
            ) : (
                <Button color='orange' appearance='ghost' className='flex gap-2'>
                    <Loader />
                    <div>Connecting to ComfyUI</div>
                </Button>
            )}
        </Whisper>
    )
})
