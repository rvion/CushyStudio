import type { Requestable, Requestable_group, Requestable_groupOpt } from 'src/controls/InfoRequest'

import { observer } from 'mobx-react-lite'
import { WidgetWithLabelUI } from './WidgetUI'
import { Button, Panel, Toggle } from 'rsuite'

export const WidgetGroupUI = observer(function WidgetItemsUI_(p: { req: Requestable_group<{ [key: string]: Requestable }> }) {
    const req = p.req
    const collapsed = req.state.collapsed
    return (
        <div tw='relative'>
            <Button tw='float-right' size='xs' onClick={() => (req.state.collapsed = !Boolean(req.state.collapsed))}>
                {collapsed ? '▿' : '▸'}
            </Button>
            {req.state.collapsed ? null : (
                <div
                    // style={{ border: '1px solid gray' }}
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
            )}
        </div>
    )
})

export const WidgetGroupOptUI = observer(function WidgetItemsOptUI_(p: {
    req: Requestable_groupOpt<{ [key: string]: Requestable }>
}) {
    const req = p.req
    const checked = req.state.active
    const collapsed = req.state.collapsed
    return (
        <div tw={[req.input.layout === 'H' ? 'flex' : null]} className={req.input.className}>
            {checked && (
                <Button tw='float-right' size='xs' onClick={() => (req.state.collapsed = !Boolean(req.state.collapsed))}>
                    {collapsed ? '▿' : '▸'}
                </Button>
            )}
            <Toggle
                // size='sm'
                checked={req.state.active}
                onChange={(v) => (req.state.active = v)}
            />
            {checked && (
                <>
                    {req.state.collapsed
                        ? null
                        : Object.entries(req.state.values).map(([rootKey, sub], ix) => {
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
                </>
            )}
        </div>
    )
})
