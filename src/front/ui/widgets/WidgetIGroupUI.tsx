import type { Requestable, Requestable_group, Requestable_groupOpt } from 'src/controls/InfoRequest'

import { observer } from 'mobx-react-lite'
import { WidgetWithLabelUI } from './WidgetUI'
import { Toggle } from 'rsuite'

export const WidgetGroupUI = observer(function WidgetItemsUI_(p: { req: Requestable_group<{ [key: string]: Requestable }> }) {
    const req = p.req

    return (
        <div
            //
            tw={[req.input.layout === 'H' ? 'flex' : null]}
            className={req.input.className}
        >
            {Object.entries(req.state.values).map(([rootKey, sub], ix) => {
                return (
                    <div key={rootKey}>
                        <WidgetWithLabelUI //
                            labelPos={sub.input.labelPos}
                            rootKey={rootKey}
                            req={sub}
                        />
                    </div>
                )
            })}
        </div>
    )
})

export const WidgetGroupOptUI = observer(function WidgetItemsOptUI_(p: {
    req: Requestable_groupOpt<{ [key: string]: Requestable }>
}) {
    const req = p.req
    const checked = req.state.active
    return (
        <div tw={[req.input.layout === 'H' ? 'flex' : null]} className={req.input.className}>
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
                                labelPos={sub.input.labelPos}
                                rootKey={rootKey}
                                req={sub}
                            />
                        </div>
                    )
                })}
        </div>
    )
})
