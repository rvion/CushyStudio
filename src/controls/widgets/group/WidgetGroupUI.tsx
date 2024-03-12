import type { Widget_group } from './WidgetGroup'
import type { SchemaDict } from 'src/controls/Spec'

import { observer } from 'mobx-react-lite'

import { WidgetWithLabelUI } from '../../shared/WidgetWithLabelUI'
import { bang } from 'src/utils/misc/bang'
import { InputBoolUI } from '../bool/InputBoolUI'

// UI
export const WidgetGroup_LineUI = observer(function WidgetGroup_LineUI_(p: {
    //
    widget: Widget_group<any>
}) {
    if (!p.widget.serial.collapsed) return null
    // return (
    //     <div tw='rounded select-none ml-auto justify-end flex flex-wrap gap-x-0.5 gap-y-0'>
    //         {p.widget.optionalFields.map(([key, sub]) => {
    //             const isSelected = sub.serial.active
    //             return (
    //                 <InputBoolUI
    //                     key={key}
    //                     active={isSelected}
    //                     display='button'
    //                     text={key}
    //                     onValueChange={(value) => {
    //                         if (value != isSelected) {
    //                             sub.serial.active = true
    //                         }
    //                     }}
    //                 ></InputBoolUI>
    //             )
    //         })}
    //     </div>
    // )
    return <div tw='line-clamp-1 italic opacity-50'>{p.widget.summary}</div>
})

export const WidgetGroup_BlockUI = observer(function WidgetGroup_BlockUI_<T extends SchemaDict>(p: {
    //
    className?: string
    widget: Widget_group<T>
}) {
    const widget = p.widget
    const isTopLevel = widget.config.topLevel
    // Alt
    // | const groupKeys = widget.childKeys
    // | const groupFields = groupKeys.map((k) => [k, widget.values[k]])
    const groupFields = Object.entries(widget.fields)
    const isHorizontal = widget.config.layout === 'H'
    return (
        <div
            className={p.className}
            tw={['WIDGET-GROUP', 'flex items-start w-full text-base-content']}
            // style={{ position: 'relative' }}
        >
            {widget.serial.collapsed ? null : (
                <div
                    className={widget.config.className}
                    tw={[
                        '_WidgetGroupUI w-full',
                        isHorizontal //
                            ? `GROUP-HORIZONTAL flex gap-1 flex-wrap`
                            : `GROUP-VERTICAL   flex gap-1 flex-col`,
                    ]}
                >
                    {groupFields.map(([rootKey, sub], ix) => (
                        <WidgetWithLabelUI //
                            isTopLevel={isTopLevel}
                            key={rootKey}
                            rootKey={rootKey}
                            alignLabel={isHorizontal ? false : widget.config.alignLabel}
                            widget={bang(sub)}
                        />
                    ))}
                </div>
            )}
        </div>
    )
})
