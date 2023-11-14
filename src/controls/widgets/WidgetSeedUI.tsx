import { observer } from 'mobx-react-lite'
import { Button, ButtonGroup, InputNumber } from 'rsuite'
import { Widget_seed } from 'src/controls/Widget'

export const WidgetSeedUI = observer(function WidgetSeedUI_(p: { req: Widget_seed }) {
    const req = p.req
    const val = req.state.val
    return (
        <div tw='w-96 flex'>
            <ButtonGroup tw='flex' size='xs'>
                <Button
                    appearance='subtle'
                    active={req.state.mode === 'randomize'}
                    onClick={() => {
                        req.state.mode = 'randomize'
                        req.state.active = true
                    }}
                    startIcon={'🎲'}
                >
                    Rand
                    {/* Each Time */}
                </Button>
                <Button
                    appearance='subtle'
                    active={req.state.mode === 'fixed'}
                    onClick={() => {
                        req.state.mode = 'fixed'
                        req.state.active = true
                        // req.state.val = Math.floor(Math.random() * 1000000)
                    }}
                    startIcon={'🎲'}
                >
                    Fixed
                    {/* Random */}
                </Button>
                {/* <Button
                    //
                    appearance={req.state.mode === 'last' ? 'ghost' : 'subtle'}
                    onClick={() => {
                        req.state.mode = 'last'
                        req.state.active = true
                    }}
                    startIcon={'♻️'}
                >
                    Use Last
                </Button> */}
            </ButtonGroup>
            <InputNumber //
                style={{
                    fontFamily: 'monospace',
                    width: val.toString().length + 6 + 'ch',
                }}
                size='sm'
                disabled={!(req.state.mode !== 'randomize' || !req.state.active)}
                value={val}
                min={req.input.min}
                max={req.input.max}
                step={1}
                onChange={(next) => {
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
                appearance='subtle'
                onClick={() => {
                    req.state.mode = 'fixed'
                    req.state.active = true
                    req.state.val = Math.floor(Math.random() * 1000000)
                }}
                startIcon={'🎲'}
            >
                New
                {/* Random */}
            </Button>
        </div>
    )
})
