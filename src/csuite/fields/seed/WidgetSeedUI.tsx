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
      <Frame border={csuite.inputBorder} tw={['h-input', 'flex flex-1 items-center']}>
         <InputBoolToggleButtonUI // Random
            icon={IKONS.mdiAutoFix}
            value={field.serial.mode === 'randomize'}
            onValueChange={() => {
               field.setToRandomize()
               field.touch()
            }}
            toggleGroup={field._uid}
            // text='Random'
         />
         <InputBoolToggleButtonUI // Fixed
            icon={IKONS.mdiNumeric1CircleOutline}
            value={field.serial.mode === 'fixed'}
            onValueChange={() => {
               field.setToFixed()
               field.touch()
            }}
            toggleGroup={field._uid}
            // text='Fixed'
         />
         <InputNumberUI // Fixed value
            disabled={field.serial.mode === 'randomize'}
            tw={['flex-1 !border-none']}
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
            icon={IKONS.mdiAutorenew}
            square
         />
      </Frame>
   )
})
