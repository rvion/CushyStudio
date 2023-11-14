import type { Widget, Widget_choices } from 'src/controls/Widget'

import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { TagPicker } from 'rsuite'
import { WidgetWithLabelUI } from './WidgetWithLabelUI'

export const WidgetChoicesUI = observer(function WidgetChoicesUI_(p: { req: Widget_choices<{ [key: string]: Widget }> }) {
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
        <div className='_WidgetChoicesUI' tw='relative'>
            <div tw='flex items-start w-full'>
                <TagPicker
                    tw='flex-grow'
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
                    {choiceSubReq.map((k) => {
                        const subReq = req.state.values[k.value]
                        return (
                            <WidgetWithLabelUI //
                                key={k.value}
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
