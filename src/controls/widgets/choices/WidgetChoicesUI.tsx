import type { Widget } from 'src/controls/Widget'
import type { Widget_choices } from './WidgetChoices'

import { observer } from 'mobx-react-lite'
import { SelectUI } from 'src/rsuite/SelectUI'
import { WidgetWithLabelUI } from '../../shared/WidgetWithLabelUI'

// UI

export const WidgetChoicesUI = observer(function WidgetChoicesUI_(p: {
    widget: Widget_choices<{ [key: string]: () => Widget }>
}) {
    const widget = p.widget

    type Entry = { key: string; value?: Maybe<boolean> }

    // choices
    const choicesStr: string[] = Object.keys(widget.config.items)
    const choices: Entry[] = choicesStr.map((v) => ({ key: v }))

    // values
    const activeSubwidgets = Object.entries(widget.children) //
        .map(([branch, subWidget]) => ({ branch, subWidget }))

    return (
        <div className='_WidgetChoicesUI' tw='relative'>
            <div tw='flex items-start w-full'>
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
                            {/*  */}
                            <div tw='flex-1'>{v.key}</div>
                            <div
                                tw='btn btn-square btn-sm'
                                onClick={(ev) => {
                                    ev.preventDefault()
                                    ev.stopPropagation()
                                    console.log(`[👙] ok`, 1)
                                }}
                            >
                                <span className='material-symbols-outlined'>delete</span>
                            </div>
                        </div>
                    )}
                    equalityCheck={(a, b) => a.key === b.key}
                    multiple={widget.config.multi ?? false}
                    closeOnPick={false}
                    resetQueryOnPick={false}
                    onChange={(v) => widget.toggleBranch(v.key)}
                />
            </div>
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
