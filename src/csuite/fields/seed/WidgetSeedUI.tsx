import type { Widget_seed } from './WidgetSeed'

import { observer } from 'mobx-react-lite'

import { Button } from '../../button/Button'
import { InputBoolToggleButtonUI } from '../../checkbox/InputBoolToggleButtonUI'
import { useCSuite } from '../../ctx/useCSuite'
import { Frame } from '../../frame/Frame'
import { InputNumberUI } from '../../input-number/InputNumberUI'

export const WidgetSeedUI = observer(function WidgetSeedUI_(p: { widget: Widget_seed }) {
    const widget = p.widget
    const val = widget.serial.val
    const csuite = useCSuite()
    const border = csuite.inputBorder

    return (
        <Frame border={{ contrast: border }} tw={['h-input', 'flex-1 flex items-center']}>
            <InputBoolToggleButtonUI // Random
                icon='mdiAutoFix'
                value={widget.serial.mode === 'randomize'}
                onValueChange={() => widget.setToRandomize()}
                // text='Random'
            />
            <InputBoolToggleButtonUI // Fixed
                icon='mdiNumeric1CircleOutline'
                value={widget.serial.mode === 'fixed'}
                onValueChange={() => widget.setToFixed()}
                // text='Fixed'
            />
            <InputNumberUI // Fixed value
                disabled={widget.serial.mode === 'randomize'}
                tw={['!border-none flex-1']}
                min={widget.config.min}
                max={widget.config.max}
                step={1}
                value={val}
                mode='int'
                onValueChange={(value) => (widget.value = value)}
            />
            <Button // reset fixed value
                size='input'
                tw='!border-l !border-r-0'
                onClick={() => widget.setToFixed(Math.floor(Math.random() * 100000000))}
                icon='mdiAutorenew'
                square
            />
        </Frame>
    )
})
