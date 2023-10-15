import type { FormPath } from 'src/models/Step'
import type { Requestable, Requestable_group, Requestable_groupOpt } from 'src/controls/InfoRequest'

import { observer } from 'mobx-react-lite'
import { useDraft } from '../useDraft'
import { Panel, Toggle } from 'rsuite'
import { WidgetWithLabelUI } from './WidgetUI'

export const WidgetItemsOptUI = observer(function WidgetItemsOptUI_(p: {
    req: Requestable_groupOpt<{ [key: string]: Requestable }>
}) {
    const req = p.req
    const checked = req.state.active
    return (
        <div>
            <Toggle
                // size='sm'
                checked={req.state.active}
                onChange={(v) => (req.state.active = v)}
            />
            {checked &&
                Object.entries(req.state.values).map(([rootKey, sub], ix) => {
                    return (
                        <div key={rootKey}>
                            <WidgetWithLabelUI //
                                rootKey={rootKey}
                                req={sub}
                            />
                        </div>
                    )
                })}
        </div>
    )
})
