import type { BaseSelectEntry } from '../selectOne/WidgetSelectOne'
import type { Widget_selectMany } from './WidgetSelectMany'

import { observer } from 'mobx-react-lite'

import { MessageErrorUI } from '../../../panels/MessageUI'
import { SelectUI } from '../../../rsuite/SelectUI'
import { InputBoolUI } from '../bool/InputBoolUI'

export const WidgetSelectManyUI = observer(function WidgetSelectManyUI_<T extends BaseSelectEntry>(p: {
    widget: Widget_selectMany<T>
}) {
    const widget = p.widget
    if (widget.config.appearance === 'tab') return <WidgetSelectMany_TabUI widget={widget} />
    return <WidgetSelectMany_SelectUI widget={widget} />
})

export const WidgetSelectMany_TabUI = observer(function WidgetSelectMany_TabUI_<T extends BaseSelectEntry>(p: {
    widget: Widget_selectMany<T>
}) {
    const widget = p.widget
    return (
        <div>
            <div tw='rounded select-none flex flex-wrap gap-x-0.5 gap-y-0'>
                {widget.choices.map((c) => {
                    const isSelected = Boolean(widget.serial.values.find((item) => item.id === c.id))
                    return (
                        <InputBoolUI
                            active={isSelected}
                            display='button'
                            text={c.label}
                            onValueChange={(value) => {
                                if (value != isSelected) widget.toggleItem(c)
                            }}
                        />
                    )
                })}

                {/* ERROR ITEMS (items that are no longer valid to pick from) */}
                {/* We need to display them so we can properly uncheck them. */}
                {widget.serial.values
                    .filter((v) => widget.choices.find((i) => i.id === v.id) == null)
                    .map((item) => (
                        <InputBoolUI
                            active={true}
                            style={{ border: '1px solid oklch(var(--er))' }}
                            display='button'
                            text={item.label ?? 'no label'}
                            onValueChange={(value) => widget.toggleItem(item)}
                        />
                    ))}
            </div>
            {widget.baseErrors && (
                <MessageErrorUI>
                    <ul>
                        {widget.baseErrors.map((e, ix) => (
                            <li key={ix}>{e}</li>
                        ))}
                    </ul>
                </MessageErrorUI>
            )}
        </div>
    )
})

export const WidgetSelectMany_SelectUI = observer(function WidgetSelectMany_SelectUI_<T extends BaseSelectEntry>(p: {
    widget: Widget_selectMany<T>
}) {
    const widget = p.widget
    return (
        <div tw='flex-1'>
            <SelectUI<T>
                multiple
                tw={[widget.baseErrors && 'rsx-field-error']}
                getLabelText={(t) => t.label ?? t.id}
                getLabelUI={widget.config.getLabelUI}
                getSearchQuery={() => widget.serial.query ?? ''}
                setSearchQuery={(query) => (widget.serial.query = query)}
                disableLocalFiltering={widget.config.disableLocalFiltering}
                options={() => widget.choices}
                value={() => widget.serial.values}
                equalityCheck={(a, b) => a.id === b.id}
                onChange={(selectOption) => widget.toggleItem(selectOption)}
            />
            {widget.baseErrors && (
                <div tw='text-red-500 flex items-center gap-1'>
                    <span className='material-symbols-outlined'>error</span>
                    {widget.baseErrors}
                </div>
            )}
        </div>
    )
})
