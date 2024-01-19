import { observer } from 'mobx-react-lite'
import { Button, Joined, InputNumberBase } from 'src/rsuite/shims'
import { Widget_seed } from 'src/controls/Widget'

export const WidgetSeedUI = observer(function WidgetSeedUI_(p: { widget: Widget_seed }) {
    const widget = p.widget
    const val = widget.state.val
    return (
        <div tw='flex items-center join virtualBorder'>
            <button
                type='button'
                tw={['join-item btn-sm btn-ghost', widget.state.mode === 'randomize' && 'btn-active']}
                onClick={() => {
                    widget.state.mode = 'randomize'
                    widget.state.active = true
                }}
            >
                🎲 Rand
            </button>
            <button
                type='button'
                tw={['join-item btn-sm btn-ghost', widget.state.mode === 'fixed' && 'btn-active']}
                onClick={() => {
                    widget.state.mode = 'fixed'
                    widget.state.active = true
                    // req.state.val = Math.floor(Math.random() * 1000000)
                }}
            >
                💎 Fixed
            </button>
            <InputNumberBase //
                _size='sm'
                style={{
                    fontFamily: 'monospace',
                    width: val.toString().length + 6 + 'ch',
                }}
                className='input-sm'
                disabled={!(widget.state.mode !== 'randomize' || !widget.state.active)}
                value={val}
                min={widget.config.min}
                max={widget.config.max}
                step={1}
                onChange={(ev) => {
                    const next = ev.target.value
                    // parse value
                    let num =
                        typeof next === 'string' //
                            ? parseInt(next, 10)
                            : next

                    // ensure is a number
                    if (isNaN(num) || typeof num != 'number') {
                        return console.log(`${JSON.stringify(next)} is not a number`)
                    }
                    // ensure ints are ints
                    num = Math.round(num)
                    widget.state.val = num
                }}
            />
            <Button
                size='sm'
                appearance='subtle'
                onClick={() => {
                    widget.state.mode = 'fixed'
                    widget.state.active = true
                    widget.state.val = Math.floor(Math.random() * 1000000)
                }}
                icon={<span className='material-symbols-outlined'>autorenew</span>}
            >
                New
                {/* Random */}
            </Button>
        </div>
    )
})
