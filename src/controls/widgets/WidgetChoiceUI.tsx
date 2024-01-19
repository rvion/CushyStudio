import type { Widget, Widget_choice } from 'src/controls/Widget'

import { observer } from 'mobx-react-lite'
import { SelectUI } from 'src/rsuite/SelectUI'
import { WidgetUI } from './WidgetUI'
import { runInAction } from 'mobx'

export const WidgetChoiceUI = observer(function WidgetChoiceUI_(p: { widget: Widget_choice<{ [key: string]: Widget }> }) {
    const widget = p.widget
    const choicesStr: string[] = widget.possibleChoices // Object.keys(req.state.values)
    const choiceSubWidget = widget.state.values[widget.state.pick]
    return (
        <div tw='_WidgetChoiceUI relative w-full'>
            <SelectUI
                getLabelText={(v) => v}
                cleanable={false}
                options={() => choicesStr}
                value={() => widget.state.pick}
                onChange={(v) => {
                    if (v == null) return
                    runInAction(() => {
                        widget.state.pick = v
                        widget.state.active = true
                    })
                }}
            />

            {widget.state.collapsed ? null : (
                <div
                    // style={{ border: '1px solid gray' }}
                    tw={[widget.config.layout === 'H' ? 'flex' : null]}
                    className={widget.config.className}
                >
                    {choiceSubWidget && (
                        <WidgetUI //
                            // labelPos={choiceSubReq.input.labelPos}
                            // rootKey={req.state.pick}
                            widget={choiceSubWidget}
                        />
                    )}
                </div>
            )}
        </div>
    )
})
