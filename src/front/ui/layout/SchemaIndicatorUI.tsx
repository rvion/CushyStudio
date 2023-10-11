import { observer } from 'mobx-react-lite'
import { Button, Loader, Message, Popover, Whisper } from 'rsuite'
import { useSt } from '../../FrontStateCtx'

export const SchemaIndicatorUI = observer(function SchemaIndicatorUI_(p: {}) {
    const st = useSt()
    return (
        <Whisper
            enterable
            placement='autoVertical'
            speaker={
                <Popover>
                    {/*  */}
                    {st.schemaReady.done ? null : (
                        <Message showIcon type='warning'>
                            Is your ComfyUI server running? You config file says it should be accessible at
                            <div>{st.getServerHostHTTP()}</div>
                            <div>{st.getWSUrl()}</div>
                        </Message>
                    )}
                    <pre>{st.schemaRetrievalLogs.join('\n')}</pre>
                </Popover>
            }
        >
            {st.schemaReady.done ? (
                <div className='flex gap-1'>
                    <span className='material-symbols-outlined text-green-400'>check_circle</span>
                    <span className='text-green-400'>Schema</span>
                </div>
            ) : (
                <Button appearance='ghost' color='orange' className='flex gap-2'>
                    <Loader />
                    <div> schema</div>
                </Button>
            )}
        </Whisper>
    )
})
