import type { Requestable, Requestable_group, Requestable_groupOpt } from 'src/controls/InfoRequest'

import { observer } from 'mobx-react-lite'
import { Button, Toggle } from 'rsuite'
import { WidgetWithLabelUI } from './WidgetUI'

export const WidgetGroupUI = observer(function WidgetItemsUI_(p: { req: Requestable_group<{ [key: string]: Requestable }> }) {
    const req = p.req
    const collapsed = req.state.collapsed

    return (
        <div tw='relative flex items-start'>
            <Button tw='' size='xs' onClick={() => (req.state.collapsed = !Boolean(req.state.collapsed))}>
                {collapsed ? '▸' : '▿'}
            </Button>
            {req.state.collapsed ? null : (
                <div
                    style={{ border: '1px solid #303030', backgroundColor: '#0f0f0f2a' }}
                    tw={['px-1 mx-1', req.input.layout === 'H' ? 'flex' : null]}
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
            <Toggle
                // size='sm'
                checked={req.state.active}
                onChange={(v) => (req.state.active = v)}
            />
            {checked && (
                <Button size='xs' onClick={() => (req.state.collapsed = !Boolean(req.state.collapsed))}>
                    {collapsed ? '▸' : '▿'}
                </Button>
            )}
            {checked ? (
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
            ) : (
                <Button size='xs' disabled>
                    ▸
                </Button>
            )}
        </div>
    )
})
