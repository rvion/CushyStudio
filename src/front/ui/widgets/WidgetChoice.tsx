import type { Widget, Widget_choice } from 'src/controls/InfoRequest'

import { observer } from 'mobx-react-lite'
import { Button, SelectPicker } from 'rsuite'
import { WidgetWithLabelUI } from './WidgetUI'

export const WidgetChoiceUI = observer(function WidgetChoiceUI_(p: { req: Widget_choice<{ [key: string]: Widget }> }) {
    const req = p.req
    const collapsed = req.state.collapsed
    const choicesStr: string[] = Object.keys(req.state.values)
    const choices = choicesStr.map((v) => ({ label: v, value: v }))
    const choiceSubReq = req.state.values[req.state.pick]
    return (
        <div tw='relative'>
            <Button tw='float-right' size='xs' onClick={() => (req.state.collapsed = !Boolean(req.state.collapsed))}>
                {collapsed ? '▿' : '▸'}
            </Button>
            <SelectPicker
                //
                onChange={(v) => {
                    if (v == null) return
                    req.state.pick = v
                    req.state.active = true
                }}
                data={choices}
                value={req.state.pick}
            />

            {req.state.collapsed ? null : (
                <div
                    // style={{ border: '1px solid gray' }}
                    tw={[req.input.layout === 'H' ? 'flex' : null]}
                    className={req.input.className}
                >
                    {choiceSubReq && (
                        <WidgetWithLabelUI //
                            labelPos={choiceSubReq.input.labelPos}
                            rootKey={req.state.pick}
                            req={choiceSubReq}
                        />
                    )}
                </div>
            )}
        </div>
    )
})
