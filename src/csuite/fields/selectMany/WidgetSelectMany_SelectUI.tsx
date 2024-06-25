import type { BaseSelectEntry } from '../selectOne/WidgetSelectOne'
import type { Widget_selectMany } from './WidgetSelectMany'

import { observer } from 'mobx-react-lite'

import { InputBoolFlipButtonUI } from '../../checkbox/InputBoolFlipButtonUI'
import { SelectUI } from '../../select/SelectUI'

export const WidgetSelectMany_SelectUI = observer(function WidgetSelectMany_SelectUI_<T extends BaseSelectEntry>(p: {
    widget: Widget_selectMany<T>
}) {
    const widget = p.widget
    return (
        <div tw='flex flex-1 gap-1'>
            <SelectUI<T>
                multiple
                wrap={widget.wrap}
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
            <InputBoolFlipButtonUI
                tooltip='Wrap items'
                tw='self-start'
                icon={p.widget.wrap ? 'mdiWrapDisabled' : 'mdiWrap'}
                value={p.widget.wrap}
                onValueChange={(next) => (p.widget.wrap = next)}
            />
        </div>
    )
})
