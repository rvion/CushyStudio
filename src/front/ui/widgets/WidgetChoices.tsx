import type { Requestable, Requestable_choice, Requestable_choices } from 'src/controls/InfoRequest'

import { observer } from 'mobx-react-lite'
import { Button, SelectPicker, TagPicker } from 'rsuite'
import { WidgetWithLabelUI } from './WidgetUI'
import { runInAction } from 'mobx'

export const WidgetChoicesUI = observer(function WidgetChoicesUI_(p: {
    req: Requestable_choices<{ [key: string]: Requestable }>
}) {
    const req = p.req
    const collapsed = req.state.collapsed

    // choices
    const choicesStr: string[] = Object.keys(req.state.values)
    const choices = choicesStr.map((v) => ({ label: v, value: v }))
    // values
    const choiceSubReq = Object.entries(req.state.branches)
        .map(([k, v]) => ({ label: k, value: k }))
        .filter((x) => x.value)
    const values = choiceSubReq.map((i) => i.value)

    return (
        <div tw='relative'>
            <Button tw='float-right' size='xs' onClick={() => (req.state.collapsed = !Boolean(req.state.collapsed))}>
                {collapsed ? '▿' : '▸'}
            </Button>
            <TagPicker
                value={values}
                data={choices}
                style={{ width: 300 }}
                onChange={(vs: string[]) => {
                    runInAction(() => {
                        req.state.branches = {}
                        for (const v of vs) {
                            req.state.branches[v] = true
                        }
                    })
                }}
            />
            {req.state.collapsed ? null : (
                <div
                    // style={{ border: '1px solid gray' }}
                    tw={[req.input.layout === 'H' ? 'flex' : null]}
                    className={req.input.className}
                >
                    {choiceSubReq.map((k) => {
                        const subReq = req.state.values[k.value]
                        return (
                            <WidgetWithLabelUI //
                                rootKey={k.value}
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
