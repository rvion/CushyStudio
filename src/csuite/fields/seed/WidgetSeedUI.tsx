import type { Field_seed } from './FieldSeed'

import { observer } from 'mobx-react-lite'

import { Button } from '../../button/Button'
import { InputBoolToggleButtonUI } from '../../checkbox/InputBoolToggleButtonUI'
import { useCSuite } from '../../ctx/useCSuite'
import { Frame } from '../../frame/Frame'
import { InputNumberUI } from '../../input-number/InputNumberUI'

export const WidgetSeedUI = observer(function WidgetSeedUI_(p: { field: Field_seed }) {
    const field = p.field
    const val = field.value_or_zero
    const csuite = useCSuite()

    return (
        <Frame
            tw={[
                //
                'h-input',
                'flex-1 flex items-center',
                // bird_d: Need to put this as a tw alias or make a wrapper component
            ]}
            align
            roundness={csuite.inputRoundness}
            border={csuite.inputBorder}
        >
            <InputBoolToggleButtonUI // Random
                toggleGroup={field.id}
                icon='mdiAutoFix'
                value={field.serial.mode === 'randomize'}
                onValueChange={() => {
                    field.setToRandomize()
                    field.touch()
                }}
                // text='Random'
            />
            <InputBoolToggleButtonUI // Fixed
                toggleGroup={field.id}
                icon='mdiNumeric1CircleOutline'
                value={field.serial.mode === 'fixed'}
                onValueChange={() => {
                    field.setToFixed()
                    field.touch()
                }}
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
                onValueChange={(value) => {
                    field.value = value
                    field.touch()
                }}
            />
            <Button // reset fixed value
                size='input'
                tw='!border-l !border-r-0'
                onClick={() => {
                    field.setToFixed(Math.floor(Math.random() * 100000000))
                    field.touch()
                }}
                icon='mdiAutorenew'
                square
            />
        </Frame>
    )
})
