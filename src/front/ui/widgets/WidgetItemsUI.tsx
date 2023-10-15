import type { Requestable_group } from 'src/controls/InfoRequest'
import type { FormPath } from 'src/models/Step'

import { observer } from 'mobx-react-lite'
import { useDraft } from '../useDraft'
import { WidgetWithLabelUI } from './WidgetUI'

export const WidgetItemsUI = observer(function WidgetItemsUI_(p: {
    get: () => boolean
    set: (v: boolean) => void
    path: FormPath
    req: Requestable_group<any>
}) {
    const req = p.req
    const draft = useDraft()
    return (
        <div>
            {Object.entries(req.items).map(([rootKey, req], ix) => {
                const path = [...p.path, rootKey]
                return (
                    <div key={rootKey}>
                        {/* <div>{i[0]}</div> */}
                        <WidgetWithLabelUI //
                            draft={draft}
                            path={path}
                            ix={ix}
                            rootKey={rootKey}
                            req={req as any}
                        />
                    </div>
                )
            })}
        </div>
    )
})
