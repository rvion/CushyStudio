import type { FormPath } from 'src/models/Step'
import type { Requestable, Requestable_group, Requestable_groupOpt } from 'src/controls/InfoRequest'

import { observer } from 'mobx-react-lite'
import { useDraft } from '../useDraft'
import { Panel, Toggle } from 'rsuite'
import { WidgetWithLabelUI } from './WidgetUI'

export const WidgetItemsOptUI = observer(function WidgetItemsOptUI_(p: {
    x: Requestable_groupOpt<{ [key: string]: Requestable }>
    // get: () => boolean
    // set: (v: boolean) => void
    // path: FormPath
    // req: Requestable_groupOpt<any>
}) {
    const x = p.x
    // const req = p.req
    // const draft = useDraft()
    // const checked = draft.getAtPath([...p.path, '__enabled__'])
    const checked = x.state.active
    return (
        <div>
            <Toggle
                // size='sm'
                checked={x.state.active}
                onChange={(v) => (x.state.active = v)}
            />
            {checked &&
                Object.entries(x.state.values).map(([rootKey, req], ix) => {
                    // const path = [...p.path, rootKey]
                    return (
                        <div key={rootKey}>
                            {/* <div>{i[0]}</div> */}
                            <WidgetWithLabelUI //
                                rootKey={rootKey}
                                req={req}
                            />
                        </div>
                    )
                })}
        </div>
    )
})
