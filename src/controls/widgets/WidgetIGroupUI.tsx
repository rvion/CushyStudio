import type { Widget, Widget_group, Widget_groupOpt } from 'src/controls/Widget'

import { observer } from 'mobx-react-lite'
import { WidgetWithLabelUI } from './WidgetUI'

export const WidgetGroupUI = observer(function WidgetItemsUI_(p: {
    //
    req:
        | Widget_group<{ [key: string]: Widget }> //
        | Widget_groupOpt<{ [key: string]: Widget }>
}) {
    const req = p.req
    // const isTopLevel = req.input.topLevel
    return (
        <div
            tw={[
                //
                'relative flex items-start w-full',
                // isTopLevel ? 'px-2' : 'px-2',
            ]}
            style={
                {
                    //
                    // borderLeft: isTopLevel ? undefined : '1px solid #636363',
                    // borderRadius: isTopLevel ? undefined : '1rem',
                }
            }
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
