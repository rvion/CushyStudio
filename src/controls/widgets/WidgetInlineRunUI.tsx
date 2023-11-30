import { observer } from 'mobx-react-lite'
import { Widget_inlineRun } from 'src/controls/Widget'
import { Button } from 'src/rsuite/shims'
import { useDraft } from 'src/widgets/misc/useDraft'

export const WidgetInlineRunUI = observer(function WidgetInlineRunUI_(p: { req: Widget_inlineRun }) {
    const draft = useDraft()
    return (
        <Button
            tw='btn-sm join-item btn-primary'
            className='self-start'
            icon={
                draft.shouldAutoStart ? ( //
                    <span className='material-symbols-outlined'>pause</span>
                ) : (
                    <span className='material-symbols-outlined'>play_arrow</span>
                )
            }
            onClick={() => {
                p.req.state.val = true
                draft.setAutostart(false)
                draft.start()

                // Reset value back to false for future runs
                setTimeout(() => {
                    p.req.state.val = false
                }, 100)
            }}
            // size={'sm'}
        >
            Run
        </Button>
    )
})
