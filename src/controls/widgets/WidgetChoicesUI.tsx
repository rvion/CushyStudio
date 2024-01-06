import type { Widget, Widget_choices } from 'src/controls/Widget'

import { observer } from 'mobx-react-lite'
import { SelectUI } from 'src/rsuite/SelectUI'
import { WidgetWithLabelUI } from '../shared/WidgetWithLabelUI'

// 🔴 why "branches" field; why not just use sub wiget active state instead?
export const WidgetChoicesUI = observer(function WidgetChoicesUI_(p: { widget: Widget_choices<{ [key: string]: Widget }> }) {
    const widget = p.widget

    type Entry = { key: string; value?: Maybe<boolean> }

    // choices
    const choicesStr: string[] = Object.keys(widget.state.values)
    const choices: Entry[] = choicesStr.map((v) => ({ key: v }))

    // values
    const values = Object.entries(widget.state.branches)
        .map(([key, value]) => ({ key, value }))
        .filter((x) => x.value)

    return (
        <div className='_WidgetChoicesUI' tw='relative'>
            <div tw='flex items-start w-full'>
                <SelectUI<Entry>
                    tw='flex-grow'
                    placeholder={p.widget.input.placeholder}
                    value={() =>
                        Object.entries(widget.state.branches)
                            .map(([key, value]) => ({ key, value }))
                            .filter((x) => x.value)
                    }
                    options={() => choices}
                    getLabelText={(v) => v.key ?? v.key}
                    equalityCheck={(a, b) => a.key === b.key}
                    multiple
                    closeOnPick={false}
                    resetQueryOnPick={false}
                    onChange={(v) => {
                        const prev = Boolean(widget.state.branches[v.key])
                        widget.state.branches[v.key] = !prev
                    }}
                />
                {/* <Button appearance='subtle' size='xs' onClick={() => (req.state.collapsed = !Boolean(req.state.collapsed))}>
                    {collapsed ? '▿' : '▸'}
                </Button> */}
            </div>
            {widget.state.collapsed ? null : (
                <div
                    // style={{ border: '1px solid gray' }}
                    tw={[widget.input.layout === 'H' ? 'flex' : null]}
                    className={widget.input.className}
                >
                    {values.map((val) => {
                        const subWidget = widget.state.values[val.key]
                        return (
                            <WidgetWithLabelUI //
                                key={val.key}
                                rootKey={val.key}
                                // labelPos={subReq.input.labelPos}
                                widget={subWidget}
                            />
                        )
                    })}
                </div>
            )}
        </div>
    )
})
