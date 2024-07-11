import type { Field_seed } from './FieldSeed'

import { observer } from 'mobx-react-lite'

import { Button } from '../../button/Button'
import { InputBoolToggleButtonUI } from '../../checkbox/InputBoolToggleButtonUI'
import { useCSuite } from '../../ctx/useCSuite'
import { Frame } from '../../frame/Frame'
import { InputNumberUI } from '../../input-number/InputNumberUI'

export const WidgetSeedUI = observer(function WidgetSeedUI_(p: { field: Field_seed }) {
    const field = p.field
    const val = field.serial.val
    const csuite = useCSuite()
    const border = csuite.inputBorder

    return (
        <Frame border={{ contrast: border }} tw={['h-input', 'flex-1 flex items-center']}>
            <InputBoolToggleButtonUI // Random
                icon='mdiAutoFix'
                value={field.serial.mode === 'randomize'}
                onValueChange={() => field.setToRandomize()}
                // text='Random'
            />
            <InputBoolToggleButtonUI // Fixed
                icon='mdiNumeric1CircleOutline'
                value={field.serial.mode === 'fixed'}
                onValueChange={() => field.setToFixed()}
                // text='Fixed'
            />
            <InputNumberUI // Fixed value
                disabled={field.serial.mode === 'randomize'}
                tw={['!border-none flex-1']}
                min={field.config.min}
                max={field.config.max}
                step={1}
                value={val}
                mode='int'
                onValueChange={(value) => (field.value = value)}
            />
            <Button // reset fixed value
                size='input'
                tw='!border-l !border-r-0'
                onClick={() => field.setToFixed(Math.floor(Math.random() * 100000000))}
                icon='mdiAutorenew'
                square
            />
        </Frame>
    )
})
