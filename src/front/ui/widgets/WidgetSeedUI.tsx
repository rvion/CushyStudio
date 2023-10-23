import { observer } from 'mobx-react-lite'
import { Button, ButtonGroup, InputNumber } from 'rsuite'
import { Requestable_seed } from 'src/controls/InfoRequest'

export const WidgetSeedUI = observer(function WidgetSeedUI_(p: { req: Requestable_seed }) {
    const req = p.req
    const val = req.state.val
    return (
        <div tw='flex flex-row gap-1'>
            <InputNumber //
                size='sm'
                disabled={req.state.mode !== 'randomize' || !req.state.active}
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
            <ButtonGroup tw='flex' size='xs'>
                <Button
                    appearance={req.state.mode === 'randomize' ? 'ghost' : 'subtle'}
                    onClick={() => {
                        req.state.mode = 'randomize'
                        req.state.active = true
                    }}
                    startIcon={'🎲'}
                >
                    Randomize
                    {/* Each Time */}
                </Button>
                <Button
                    appearance={req.state.mode === 'fixed' ? 'ghost' : 'subtle'}
                    onClick={() => {
                        req.state.mode = 'fixed'
                        req.state.active = true
                        req.state.val = Math.floor(Math.random() * 1000000)
                    }}
                    startIcon={'🎲'}
                >
                    New Fixed
                    {/* Random */}
                </Button>
                <Button
                    //
                    appearance={req.state.mode === 'last' ? 'ghost' : 'subtle'}
                    onClick={() => {
                        req.state.mode = 'last'
                        req.state.active = true
                    }}
                    startIcon={'♻️'}
                >
                    Use Last
                    {/* Queued Seed */}
                </Button>
            </ButtonGroup>
        </div>
    )
})
