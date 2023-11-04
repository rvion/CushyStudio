import type { Widget, Widget_group, Widget_groupOpt } from 'src/controls/Widget'

import { observer } from 'mobx-react-lite'
import { Button, Toggle } from 'rsuite'
import { WidgetWithLabelUI } from './WidgetUI'

export const WidgetGroupUI = observer(function WidgetItemsUI_(p: { req: Widget_group<{ [key: string]: Widget }> }) {
    const req = p.req
    const collapsed = req.state.collapsed
    const isTopLevel = req.input.topLevel
    return (
        <div tw='relative flex items-start w-full'>
            {/* {isTopLevel ? null : (
                <Button appearance='subtle' tw='' size='xs' onClick={() => (req.state.collapsed = !Boolean(req.state.collapsed))}>
                    {collapsed ? '▸' : '▿'}
                </Button>
            )} */}
            {/*
            <Button
                appearance='subtle'
                tw=''
                size='xs'
                onClick={() => (req.state.verticalLabels = !Boolean(req.state.verticalLabels))}
            >
                {req.state.verticalLabels ? '👇' : '👉'}
            </Button> */}

            {req.state.collapsed ? null : (
                <div
                    style={isTopLevel ? undefined : { border: '1px solid #262626' }}
                    tw={['p-2 w-full', req.input.layout === 'H' ? 'flex' : null]}
                    className={req.input.className}
                >
                    {Object.entries(req.state.values).map(([rootKey, sub], ix) => (
                        <WidgetWithLabelUI //
                            vertical={req.state.verticalLabels}
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
                <div
                    style={{ border: '1px solid #424242' }}
                    tw={['px-1 mx-1', req.input.layout === 'H' ? 'flex' : null]}
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
            ) : (
                <Button size='xs' disabled>
                    ▸
                </Button>
            )}
        </div>
    )
})
