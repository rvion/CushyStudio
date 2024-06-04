import type { Widget_seed } from './WidgetSeed'

import { observer } from 'mobx-react-lite'

import { Button } from '../../../rsuite/button/Button'
import { InputBoolToggleButtonUI } from '../../../rsuite/checkbox/InputBoolToggleButtonUI'
import { Frame } from '../../../rsuite/frame/Frame'
import { useTheme } from '../../../rsuite/theme/useTheme'
import { InputNumberUI } from '../number/InputNumberUI'

export const WidgetSeedUI = observer(function WidgetSeedUI_(p: { widget: Widget_seed }) {
    const widget = p.widget
    const val = widget.serial.val
    const border = useTheme().value.inputBorder

    return (
        <Frame border={{ contrast: border }} tw={['WIDGET-FIELD', 'flex-1 flex items-center']}>
            <InputBoolToggleButtonUI // Random
                // tw='!border-l-0'
                icon='mdiShuffle'
                value={widget.serial.mode === 'randomize'}
                onValueChange={() => widget.setToRandomize()}
                text='Random'
            />
            <InputBoolToggleButtonUI // Fixed
                // tw='!border-l !border-r'
                icon='mdiDotsGrid'
                value={widget.serial.mode === 'fixed'}
                onValueChange={() => widget.setToFixed()}
                text='Fixed'
            />
            <InputNumberUI // Fixed value
                disabled={widget.serial.mode === 'randomize'}
                tw={['!border-none flex-1']}
                min={widget.config.min}
                max={widget.config.max}
                step={1}
                value={val}
                mode='int'
                onValueChange={(value) => widget.setValue(value)}
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
