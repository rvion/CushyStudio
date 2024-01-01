import type { Widget, Widget_choices } from 'src/controls/Widget'

import { observer } from 'mobx-react-lite'
import { SelectUI } from 'src/rsuite/SelectUI'
import { WidgetWithLabelUI } from '../shared/WidgetWithLabelUI'

// 🔴 why "branches" field; why not just use sub wiget active state instead?
export const WidgetChoicesUI = observer(function WidgetChoicesUI_(p: { widget: Widget_choices<{ [key: string]: Widget }> }) {
    const req = p.widget

    type Entry = { key: string; value?: Maybe<boolean> }

    // choices
    const choicesStr: string[] = Object.keys(req.state.values)
    const choices: Entry[] = choicesStr.map((v) => ({ key: v }))

    // values
    const values = Object.entries(req.state.branches)
        .map(([key, value]) => ({ key, value }))
        .filter((x) => x.value)

    return (
        <div className='_WidgetChoicesUI' tw='relative'>
            <div tw='flex items-start w-full'>
                <SelectUI<Entry>
                    tw='flex-grow'
                    value={() =>
                        Object.entries(req.state.branches)
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
                        const prev = Boolean(req.state.branches[v.key])
                        req.state.branches[v.key] = !prev
                    }}
                />
                {/* <Button appearance='subtle' size='xs' onClick={() => (req.state.collapsed = !Boolean(req.state.collapsed))}>
                    {collapsed ? '▿' : '▸'}
                </Button> */}
            </div>
            {req.state.collapsed ? null : (
                <div
                    // style={{ border: '1px solid gray' }}
                    tw={[req.input.layout === 'H' ? 'flex' : null]}
                    className={req.input.className}
                >
                    {values.map((val) => {
                        const subReq = req.state.values[val.key]
                        return (
                            <WidgetWithLabelUI //
                                key={val.key}
                                rootKey={val.key}
                                labelPos={subReq.input.labelPos}
                                req={subReq}
                            />
                        )
                    })}
                </div>
            )}
        </div>
    )
})
