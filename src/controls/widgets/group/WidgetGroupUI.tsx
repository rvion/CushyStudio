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
    const groupFields = Object.entries(widget.values)
    const isHorizontal = widget.config.layout === 'H'
    return (
        <div
            tw={['flex rounded-box bg-opacity-95 items-start w-full text-base-content']}
            style={{
                position: 'relative',
            }}
        >
            {/* 🟢
            {widget.serial.collapsed ? 'Coolapsed' : undefined}
            {groupFields.length}
            {groupFields.map(([rootKey, sub], ix) => (
                <div key={rootKey}>{rootKey}</div>
            ))} */}
            {widget.serial.collapsed ? null : (
                <div
                    // style={isTopLevel ? undefined : { border: '1px solid #262626' }}
                    tw={[
                        //
                        '_WidgetGroupUI w-full',
                        isHorizontal //
                            ? `flex flex-wrap gap-2`
                            : `flex flex-col gap-1`,
                    ]}
                    className={widget.config.className}
                >
                    {groupFields.map(([rootKey, sub], ix) => (
                        <WidgetWithLabelUI //
                            isTopLevel={isTopLevel}
                            key={rootKey}
                            // labelPos={sub.input.labelPos}
                            rootKey={rootKey}
                            widget={bang(sub)}
                        />
                    ))}
                </div>
            )}
        </div>
    )
})
