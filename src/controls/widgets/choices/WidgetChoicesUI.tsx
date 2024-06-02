import type { SchemaDict } from '../../ISpec'
import type { Widget_choices } from './WidgetChoices'

import { observer } from 'mobx-react-lite'

import { InputBoolUI } from '../../../rsuite/checkbox/InputBoolUI'
import { SelectUI } from '../../../rsuite/select/SelectUI'
import { useTheme } from '../../../rsuite/theme/useTheme'
import { WidgetWithLabelUI } from '../../shared/WidgetWithLabelUI'
import { WidgetFieldsContainerUI } from '../group/WidgetGroupUI'

// UI
export const WidgetChoices_HeaderUI = observer(function WidgetChoices_LineUI_(p: { widget: Widget_choices<any> }) {
    if (p.widget.config.appearance === 'tab') return <WidgetChoices_TabHeaderUI widget={p.widget} />
    else return <WidgetChoices_SelectHeaderUI widget={p.widget} />
})

export const WidgetChoices_BodyUI = observer(function WidgetChoices_BodyUI_<T extends SchemaDict>(p: {
    widget: Widget_choices<T>
    alignLabel?: boolean
    className?: string
}) {
    const widget = p.widget
    const activeSubwidgets = Object.entries(widget.children) //
        .map(([branch, subWidget]) => ({ branch, subWidget }))

    return (
        <WidgetFieldsContainerUI //
            layout={widget.config.layout}
            tw={[widget.config.className, p.className]}
        >
            {activeSubwidgets.map((val) => {
                const subWidget = val.subWidget
                if (subWidget == null) return <>❌ error</>
                return (
                    <WidgetWithLabelUI //
                        alignLabel={p.alignLabel}
                        key={val.branch}
                        rootKey={val.branch}
                        widget={subWidget}
                        label={widget.isSingle ? false : undefined}
                    />
                )
            })}
        </WidgetFieldsContainerUI>
    )
})

// ============================================================================================================

export const WidgetChoices_TabHeaderUI = observer(function WidgetChoicesTab_LineUI_<T extends SchemaDict>(p: {
    widget: Widget_choices<T>
}) {
    const widget = p.widget
    const choices = widget.choicesWithLabels // choicesStr.map((v) => ({ key: v }))
    const theme = useTheme()
    return (
        <div
            tw='rounded select-none flex flex-1 flex-wrap gap-x-1 gap-y-0'
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
        >
            {choices.map((c) => {
                const isSelected = widget.serial.branches[c.key]
                return (
                    <InputBoolUI
                        key={c.key}
                        value={isSelected}
                        display='button'
                        mode={p.widget.isMulti ? 'checkbox' : 'radio'}
                        text={c.label}
                        box={isSelected ? undefined : { text: theme.value.labelText }}
                        onValueChange={(value) => {
                            if (value != isSelected) {
                                widget.toggleBranch(c.key)
                            }
                        }}
                    />
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
