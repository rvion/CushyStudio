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
    const isTopLevel = req.input.topLevel
    return (
        <div
            // isTopLevel ? 'px-2' : 'px-2',
            tw={['flex items-start w-full mb-2']}
            style={{
                position: 'relative',
                borderRadius: '0.5rem',
                border: isTopLevel ? undefined : '1px solid #484848',
                paddingLeft: isTopLevel ? undefined : '.2rem',
            }}
        >
            {/* {isTopLevel ? '🟢' : '🔴'} */}
            {req.state.collapsed ? null : (
                <div
                    // style={isTopLevel ? undefined : { border: '1px solid #262626' }}
                    tw={['_WidgetGroupUI w-full', req.input.layout === 'H' ? 'flex gap-2' : null]}
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
