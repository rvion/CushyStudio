import type { SchemaDict } from '../../ISpec'
import type { Widget_choices } from './WidgetChoices'

import { observer } from 'mobx-react-lite'

import { SelectUI } from '../../../rsuite/SelectUI'
import { WidgetWithLabelUI } from '../../shared/WidgetWithLabelUI'
import { AnimatedSizeUI } from '../../utils/AnimatedSizeUI'
import { InputBoolUI } from '../bool/InputBoolUI'

// UI
export const WidgetChoices_HeaderUI = observer(function WidgetChoices_LineUI_(p: { widget: Widget_choices<any> }) {
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
    return (
        <div
            style={{
                justifyContent:
                    widget.config.tabPosition === 'start' //
                        ? 'flex-start'
                        : widget.config.tabPosition === 'center'
                          ? 'center'
                          : widget.config.tabPosition === 'end'
                            ? 'flex-end'
                            : 'flex-end',
            }}
            tw='rounded select-none flex flex-1 flex-wrap gap-x-0.5 gap-y-0'
        >
            {choices.map((c) => {
                const isSelected = widget.serial.branches[c.key]
                return (
                    <InputBoolUI
                        key={c.key}
                        active={isSelected}
                        display='button'
                        text={c.label}
                        onValueChange={(value) => {
                            if (value != isSelected) {
                                widget.toggleBranch(c.key)
                            }
                        }}
                    ></InputBoolUI>
                )
            })}
        </div>
    )
})

export const WidgetChoices_SelectHeaderUI = observer(function WidgetChoices_SelectLineUI_<T extends SchemaDict>(p: {
    widget: Widget_choices<T>
}) {
    const widget = p.widget
    type Entry = { key: string; label: string }
    const choices: Entry[] = widget.choicesWithLabels
    return (
        <div
            tw={[
                //
                'relative',
                p.widget.expand || p.widget.config.alignLabel ? 'w-full' : 'w-64',
            ]}
            onMouseDown={(ev) => {
                ev.preventDefault()
                ev.stopPropagation()
            }}
        >
            <SelectUI<Entry>
                tw='flex-grow'
                placeholder={p.widget.config.placeholder}
                value={() =>
                    Object.entries(widget.serial.branches)
                        .filter(([_, value]) => value)
                        .map(([key, _]) => ({ key, label: choices.find((v) => v.key === key)?.label ?? key }))
                }
                options={() => choices}
                getLabelText={(v) => v.label}
                getLabelUI={(v) => (
                    <div tw='flex flex-1 justify-between'>
                        <div tw='flex-1'>{v.label}</div>
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
