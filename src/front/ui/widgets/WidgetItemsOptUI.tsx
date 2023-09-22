import type { FormPath } from 'src/models/Step'
import type { Requestable_itemsOpt } from 'src/controls/InfoRequest'

import { observer } from 'mobx-react-lite'
import { useDraft } from '../useDraft'
import { Toggle } from 'rsuite'
import { WidgetWithLabelUI } from './WidgetUI'

export const WidgetItemsOptUI = observer(function WidgetItemsOptUI_(p: {
    get: () => boolean
    set: (v: boolean) => void
    path: FormPath
    req: Requestable_itemsOpt<any>
}) {
    const req = p.req
    const draft = useDraft()
    const checked = draft.getAtPath([...p.path, '__enabled__'])
    return (
        <div>
            <Toggle
                checked={checked}
                onChange={(v) => {
                    if (v) draft.setAtPath([...p.path, '__enabled__'], true)
                    else draft.setAtPath([...p.path, '__enabled__'], false)
                }}
            />
            {checked &&
                Object.entries(req.items).map(([rootKey, req], ix) => {
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
