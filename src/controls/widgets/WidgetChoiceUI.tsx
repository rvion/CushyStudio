import type { Widget, Widget_choice } from 'src/controls/Widget'

import { observer } from 'mobx-react-lite'
import { SelectUI } from 'src/rsuite/SelectUI'
import { WidgetUI } from './WidgetUI'

export const WidgetChoiceUI = observer(function WidgetChoiceUI_(p: { widget: Widget_choice<{ [key: string]: Widget }> }) {
    const req = p.widget
    const choicesStr: string[] = Object.keys(req.state.values)
    const choiceSubReq = req.state.values[req.state.pick]
    return (
        <div tw='_WidgetChoiceUI relative w-full'>
            <SelectUI
                getLabelText={(v) => v}
                cleanable={false}
                options={choicesStr}
                value={() => req.state.pick}
                onChange={(v) => {
                    if (v == null) return
                    req.state.pick = v
                    req.state.active = true
                }}
            />

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
                            widget={choiceSubReq}
                        />
                    )}
                </div>
            )}
        </div>
    )
})
