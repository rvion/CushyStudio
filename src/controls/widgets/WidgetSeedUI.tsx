import { observer } from 'mobx-react-lite'
import { Button, Joined, InputNumberBase } from 'src/rsuite/shims'
import { Widget_seed } from 'src/controls/Widget'

export const WidgetSeedUI = observer(function WidgetSeedUI_(p: { req: Widget_seed }) {
    const req = p.req
    const val = req.state.val
    return (
        <div tw='flex items-center join border border-'>
            <button
                type='button'
                tw={['join-item btn-xs btn-ghost', req.state.mode === 'randomize' && 'btn-active']}
                onClick={() => {
                    req.state.mode = 'randomize'
                    req.state.active = true
                }}
            >
                🎲 Rand
            </button>
            <button
                type='button'
                tw={['join-item btn-xs btn-ghost', req.state.mode === 'fixed' && 'btn-active']}
                onClick={() => {
                    req.state.mode = 'fixed'
                    req.state.active = true
                    // req.state.val = Math.floor(Math.random() * 1000000)
                }}
            >
                💎 Fixed
            </button>
            <InputNumberBase //
                _size='xs'
                style={{
                    fontFamily: 'monospace',
                    width: val.toString().length + 6 + 'ch',
                }}
                className='input-sm'
                disabled={!(req.state.mode !== 'randomize' || !req.state.active)}
                value={val}
                min={req.input.min}
                max={req.input.max}
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
                    req.state.val = num
                }}
            />
            <Button
                size='xs'
                appearance='subtle'
                onClick={() => {
                    req.state.mode = 'fixed'
                    req.state.active = true
                    req.state.val = Math.floor(Math.random() * 1000000)
                }}
                icon={'🎲'}
            >
                New
                {/* Random */}
            </Button>
        </div>
    )
})
