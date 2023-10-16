import type { Requestable, Requestable_group } from 'src/controls/InfoRequest'

import { observer } from 'mobx-react-lite'
import { WidgetWithLabelUI } from './WidgetUI'

export const WidgetItemsUI = observer(function WidgetItemsUI_(p: { req: Requestable_group<{ [key: string]: Requestable }> }) {
    const req = p.req
    return (
        <div tw={[req.input.layout === 'H' ? 'flex' : null]}>
            {Object.entries(req.state.values).map(([rootKey, sub], ix) => {
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
