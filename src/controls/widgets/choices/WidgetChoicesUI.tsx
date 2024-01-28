import type { Widget } from 'src/controls/Widget'
import type { Widget_choices } from './WidgetChoices'

import { observer } from 'mobx-react-lite'
import { SelectUI } from 'src/rsuite/SelectUI'
import { WidgetWithLabelUI } from '../../shared/WidgetWithLabelUI'
import { makeLabelFromFieldName } from 'src/utils/misc/makeLabelFromFieldName'
import { AnimatedSizeUI } from './AnimatedSizeUI'

// UI
export const WidgetChoicesUI = observer(function WidgetChoicesUI_(p: {
    widget: Widget_choices<{ [key: string]: () => Widget }>
}) {
    if (p.widget.config.appearance === 'tab') return <WidgetChoicesTabUI widget={p.widget} />
    return <WidgetChoicesSelectUI widget={p.widget} />
})

export const WidgetChoicesTabUI = observer(function WidgetChoicesTabUI_(p: {
    widget: Widget_choices<{ [key: string]: () => Widget }>
}) {
    const widget = p.widget
    type Entry = { key: string; value?: Maybe<boolean> }
    const choicesStr: string[] = widget.choices
    const choices: Entry[] = choicesStr.map((v) => ({ key: v }))
    const activeSubwidgets = Object.entries(widget.children) //
        .map(([branch, subWidget]) => ({ branch, subWidget }))

    return (
        <div>
            <div role='tablist' tw='tabs tabs-boxed tabs-sm'>
                {choices.map((c) => {
                    const isSelected = widget.serial.branches[c.key]
                    return (
                        <a
                            onClick={() => widget.toggleBranch(c.key)}
                            key={c.key}
                            role='tab'
                            tw={['tab', isSelected && 'tab-active font-bold']}
                        >
                            {makeLabelFromFieldName(c.key)}
                        </a>
                    )
                })}
            </div>
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
                            />
                        )
                    })}
                </div>
            </AnimatedSizeUI>
        </div>
    )
})

export const WidgetChoicesSelectUI = observer(function WidgetChoicesSelectUI_(p: {
    widget: Widget_choices<{ [key: string]: () => Widget }>
}) {
    const widget = p.widget
    type Entry = { key: string; value?: Maybe<boolean> }
    const choicesStr: string[] = widget.choices
    const choices: Entry[] = choicesStr.map((v) => ({ key: v }))
    const activeSubwidgets = Object.entries(widget.children) //
        .map(([branch, subWidget]) => ({ branch, subWidget }))

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
                        {v.key in widget.serial.values_ && (
                            <div
                                tw='btn btn-square btn-sm'
                                onClick={(ev) => {
                                    ev.preventDefault()
                                    ev.stopPropagation()
                                }}
                            >
                                <span className='material-symbols-outlined'>delete</span>
                            </div>
                        )}
                    </div>
                )}
                equalityCheck={(a, b) => a.key === b.key}
                multiple={widget.config.multi ?? false}
                closeOnPick={false}
                resetQueryOnPick={false}
                onChange={(v) => widget.toggleBranch(v.key)}
            />
            <div tw={[widget.config.layout === 'H' ? 'flex' : null]} className={widget.config.className}>
                {activeSubwidgets.map((val) => {
                    const subWidget = val.subWidget
                    if (subWidget == null) return <>❌ error</>
                    return (
                        <WidgetWithLabelUI //
                            key={val.branch}
                            rootKey={val.branch}
                            widget={subWidget}
                        />
                    )
                })}
            </div>
        </div>
    )
})
