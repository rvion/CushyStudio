import type { Widget, Widget_group, Widget_groupOpt } from 'src/controls/Widget'

import { observer } from 'mobx-react-lite'
import { Button, Toggle } from 'rsuite'
import { WidgetWithLabelUI } from './WidgetUI'

export const WidgetGroupUI = observer(function WidgetItemsUI_(p: { req: Widget_group<{ [key: string]: Widget }> }) {
    const req = p.req
    const isTopLevel = req.input.topLevel
    return (
        <div
            tw={['relative flex items-start w-full', isTopLevel ? 'px-2' : 'px-2']}
            style={{
                //
                borderLeft: isTopLevel ? undefined : '1px solid #636363',
                borderRadius: isTopLevel ? undefined : '1rem',
            }}
        >
            {/* {isTopLevel ? '🟢' : '🔴'} */}
            {req.state.collapsed ? null : (
                <div
                    // style={isTopLevel ? undefined : { border: '1px solid #262626' }}
                    tw={['w-full', req.input.layout === 'H' ? 'flex gap-2' : null]}
                    className={req.input.className}
                >
                    {Object.entries(req.state.values).map(([rootKey, sub], ix) => (
                        <WidgetWithLabelUI //
                            vertical={req.state.vertical}
                            key={rootKey}
                            labelPos={sub.input.labelPos}
                            rootKey={rootKey}
                            req={sub}
                        />
                    ))}
                </div>
            )}
        </div>
    )
})

export const WidgetGroupOptUI = observer(function WidgetItemsOptUI_(p: { req: Widget_groupOpt<{ [key: string]: Widget }> }) {
    const req = p.req
    const checked = req.state.active
    const isTopLevel = false
    return (
        <div tw={[req.input.layout === 'H' ? 'flex gap-2' : null]} className={req.input.className}>
            <Toggle
                // size='sm'
                checked={req.state.active}
                onChange={(v) => (req.state.active = v)}
            />

            {checked ? (
                <div
                    // style={{ border: '1px solid #424242' }}
                    tw={['px-1 mx-1', req.input.layout === 'H' ? 'flex' : null]}
                    style={{
                        //
                        borderLeft: isTopLevel ? undefined : '1px solid #636363',
                        borderRadius: isTopLevel ? undefined : '1rem',
                    }}
                    className={req.input.className}
                >
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
                </div>
            ) : null}
        </div>
    )
})
