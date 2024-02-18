import { observer } from 'mobx-react-lite'
import { Widget_inlineRun } from 'src/controls/Widget'
import { Button } from 'src/rsuite/shims'
import { useDraft } from 'src/widgets/misc/useDraft'

export const WidgetInlineRunUI = observer(function WidgetInlineRunUI_(p: { widget: Widget_inlineRun }) {
    const draft = useDraft()
    return (
        <Button
            tw={[
                'btn-sm join-item',
                p.widget.config.kind === `special`
                    ? `btn-secondary`
                    : p.widget.config.kind === `warning`
                    ? `btn-warning`
                    : `btn-primary`,
            ]}
            className='self-start'
            icon={
                draft.shouldAutoStart ? ( //
                    <span className='material-symbols-outlined'>pause</span>
                ) : (
                    <span className='material-symbols-outlined'>play_arrow</span>
                )
            }
            onClick={() => {
                p.widget.serial.val = true
                draft.setAutostart(false)
                draft.start({})

                // Reset value back to false for future runs
                setTimeout(() => {
                    p.widget.serial.val = false
                }, 100)
            }}
            // size={'sm'}
        >
            {p.widget.config.text ?? `Run`}
        </Button>
    )
})
