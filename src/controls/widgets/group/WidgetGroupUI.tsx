import type { Widget } from 'src/controls/Widget'
import type { Widget_group } from './WidgetGroup'

import { observer } from 'mobx-react-lite'
import { WidgetWithLabelUI } from '../../shared/WidgetWithLabelUI'
import { bang } from 'src/utils/misc/bang'

// UI

export const WidgetGroupUI = observer(function WidgetItemsUI_(p: {
    //
    widget: Widget_group<{ [key: string]: Widget }>
}) {
    const widget = p.widget
    const isTopLevel = widget.config.topLevel
    // Alt
    // | const groupKeys = widget.childKeys
    // | const groupFields = groupKeys.map((k) => [k, widget.values[k]])
    const groupFields = Object.entries(widget.values)
    const isHorizontal = widget.config.layout === 'H'
    return (
        <div tw={['WIDGET-GROUP', 'flex items-start w-full text-base-content']} style={{ position: 'relative' }}>
            {widget.serial.collapsed ? null : (
                <div
                    tw={[
                        //
                        '_WidgetGroupUI w-full',
                        isHorizontal ? `flex flex-wrap gap-1` : `flex flex-col gap-1.5`,
                    ]}
                    className={widget.config.className}
                >
                    {groupFields.map(([rootKey, sub], ix) => (
                        <WidgetWithLabelUI //
                            isTopLevel={isTopLevel}
                            key={rootKey}
                            rootKey={rootKey}
                            widget={bang(sub)}
                        />
                    ))}
                </div>
            )}
        </div>
    )
})
