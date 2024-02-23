import type { Widget_seed } from './WidgetSeed'

import { observer } from 'mobx-react-lite'

import { Button, InputNumberBase } from 'src/rsuite/shims'

export const WidgetSeedUI = observer(function WidgetSeedUI_(p: { widget: Widget_seed }) {
    const widget = p.widget
    const val = widget.serial.val
    return (
        <div tw='flex-1 flex items-center join virtualBorder'>
            <button
                type='button'
                tw={['flex-1 whitespace-nowrap join-item btn-sm btn-ghost', widget.serial.mode === 'randomize' && 'btn-active']}
                onClick={() => {
                    widget.serial.mode = 'randomize'
                    widget.serial.active = true
                }}
            >
                🎲 Rand
            </button>
            <button
                type='button'
                tw={['flex-1 whitespace-nowrap join-item btn-sm btn-ghost', widget.serial.mode === 'fixed' && 'btn-active']}
                onClick={() => {
                    widget.serial.mode = 'fixed'
                    widget.serial.active = true
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
                disabled={!(widget.serial.mode !== 'randomize' || !widget.serial.active)}
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
                    widget.serial.val = num
                }}
            />
            <Button
                size='sm'
                appearance='subtle'
                onClick={() => {
                    widget.serial.mode = 'fixed'
                    widget.serial.active = true
                    widget.serial.val = Math.floor(Math.random() * 1000000)
                }}
                icon={<span className='material-symbols-outlined'>autorenew</span>}
            >
                New
                {/* Random */}
            </Button>
        </div>
    )
})
