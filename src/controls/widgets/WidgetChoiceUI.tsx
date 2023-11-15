import type { Widget, Widget_choice } from 'src/controls/Widget'

import { observer } from 'mobx-react-lite'
import { SelectPicker } from 'src/rsuite/shims'
import { WidgetUI } from './WidgetUI'

export const WidgetChoiceUI = observer(function WidgetChoiceUI_(p: { req: Widget_choice<{ [key: string]: Widget }> }) {
    const req = p.req
    const choicesStr: string[] = Object.keys(req.state.values)
    const choices = choicesStr.map((v) => ({ label: v, value: v }))
    const choiceSubReq = req.state.values[req.state.pick]
    return (
        <div tw='_WidgetChoiceUI relative w-full'>
            <div>
                <SelectPicker
                    //
                    cleanable={false}
                    size='sm'
                    onChange={(v) => {
                        if (v == null) return
                        req.state.pick = v
                        req.state.active = true
                    }}
                    data={choices}
                    value={req.state.pick}
                />
            </div>

            {req.state.collapsed ? null : (
                <div
                    // style={{ border: '1px solid gray' }}
                    tw={[req.input.layout === 'H' ? 'flex' : null]}
                    className={req.input.className}
                >
                    {choiceSubReq && (
                        <WidgetUI //
                            // labelPos={choiceSubReq.input.labelPos}
                            // rootKey={req.state.pick}
                            req={choiceSubReq}
                        />
                    )}
                </div>
            )}
        </div>
    )
})
