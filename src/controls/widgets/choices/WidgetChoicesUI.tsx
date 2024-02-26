import type { Widget_choices } from './WidgetChoices'
import type { SchemaDict } from 'src/cards/App'

import { observer } from 'mobx-react-lite'
import { useState } from 'react'

import { WidgetWithLabelUI } from '../../shared/WidgetWithLabelUI'
import { AnimatedSizeUI } from './AnimatedSizeUI'
import { SelectUI } from 'src/rsuite/SelectUI'
import { makeLabelFromFieldName } from 'src/utils/misc/makeLabelFromFieldName'

// UI
export const WidgetChoices_HeaderUI = observer(function WidgetChoices_LineUI_<T extends SchemaDict>(p: {
    widget: Widget_choices<T>
}) {
    if (p.widget.config.appearance === 'tab') return <WidgetChoices_TabHeaderUI widget={p.widget} />
    else return <WidgetChoices_SelectHeaderUI widget={p.widget} />
})

export const WidgetChoices_BodyUI = observer(function WidgetChoices_BodyUI_<T extends SchemaDict>(p: {
    widget: Widget_choices<T>
}) {
    const widget = p.widget
    const activeSubwidgets = Object.entries(widget.children) //
        .map(([branch, subWidget]) => ({ branch, subWidget }))

    return (
        <div>
            <AnimatedSizeUI>
                <div //
                    tw={[widget.config.layout === 'H' ? 'flex' : null]}
                    className={widget.config.className}
                >
                    {activeSubwidgets.map((val) => {
                        const subWidget = val.subWidget
                        if (subWidget == null) return <>❌ error</>
                        return (
                            <WidgetWithLabelUI //
                                key={val.branch}
                                rootKey={val.branch}
                                widget={subWidget}
                                label={widget.isSingle ? false : undefined}
                            />
                        )
                    })}
                </div>
            </AnimatedSizeUI>
        </div>
    )
})

// ============================================================================================================

const WidgetChoices_TabHeaderUI = observer(function WidgetChoicesTab_LineUI_<T extends SchemaDict>(p: {
    widget: Widget_choices<T>
}) {
    const widget = p.widget
    const choices = widget.choicesWithLabels // choicesStr.map((v) => ({ key: v }))
    const [isDragging, setIsDragging] = useState<boolean>(false)
    const [wasEnabled, setWasEnabled] = useState<boolean>(false)

    const isDraggingListener = (ev: MouseEvent) => {
        if (ev.button == 0) {
            setIsDragging(false)
            window.removeEventListener('mouseup', isDraggingListener, true)
        }
    }

    return (
        <div tw='rounded select-none ml-auto justify-end flex flex-wrap gap-x-0.5 gap-y-0'>
            {choices.map((c) => {
                const isSelected = widget.serial.branches[c.key]
                return (
                    <div
                        onMouseDown={(ev) => {
                            // console.log('DOWN!!')
                            if (ev.button == 0) {
                                widget.toggleBranch(c.key)
                                setWasEnabled(!isSelected)
                                setIsDragging(true)
                                window.addEventListener('mouseup', isDraggingListener, true)
                            }
                        }}
                        onMouseEnter={(ev) => {
                            if (isDragging && (wasEnabled != isSelected || !widget.isMulti)) {
                                widget.toggleBranch(c.key)
                            }
                        }}
                        key={c.key}
                        tw={[
                            //
                            'cursor-pointer',
                            'rounded',
                            'border px-2 flex flex-nowrap gap-0.5 whitespace-nowrap items-center bg-base-100',
                            isSelected
                                ? 'bg-primary text-base-300 border-base-200 text-shadow-inv'
                                : 'bg-base-200 hover:filter hover:brightness-110 border-base-100 text-shadow',
                            'border-b-2 border-b-base-300',
                        ]}
                    >
                        {makeLabelFromFieldName(c.label)}
                    </div>
                )
            })}
        </div>
    )
})

export const WidgetChoices_SelectHeaderUI = observer(function WidgetChoices_SelectLineUI_<T extends SchemaDict>(p: {
    widget: Widget_choices<T>
}) {
    const widget = p.widget
    type Entry = { key: string; value?: Maybe<boolean> }
    const choicesStr: string[] = widget.choices
    const choices: Entry[] = choicesStr.map((v) => ({ key: v }))
    return (
        <div className='_WidgetChoicesUI' tw='relative'>
            {/* {widget.config.multi ? 'MULTI' : 'SINGLE'} */}
            <SelectUI<Entry>
                tw='flex-grow'
                placeholder={p.widget.config.placeholder}
                value={() =>
                    Object.entries(widget.serial.branches)
                        .map(([key, value]) => ({ key, value }))
                        .filter((x) => x.value)
                }
                options={() => choices}
                getLabelText={(v) => v.key}
                getLabelUI={(v) => (
                    <div tw='flex flex-1 justify-between'>
                        <div tw='flex-1'>{v.key}</div>
                        {/* 👇 TODO: clean this */}
                        {/* {v.key in widget.serial.values_ && (
                            <div
                                tw='btn btn-square btn-sm'
                                onClick={(ev) => {
                                    ev.preventDefault()
                                    ev.stopPropagation()
                                }}
                            >
                                <span className='material-symbols-outlined'>delete</span>
                            </div>
                        )} */}
                    </div>
                )}
                equalityCheck={(a, b) => a.key === b.key}
                multiple={widget.config.multi ?? false}
                closeOnPick={false}
                resetQueryOnPick={false}
                onChange={(v) => widget.toggleBranch(v.key)}
            />
        </div>
    )
})
