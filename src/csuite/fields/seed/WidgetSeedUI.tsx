import type { Field_seed } from './FieldSeed'

import { Button } from '../../button/Button'
import { ToggleButtonUI } from '../../checkbox/InputBoolToggleButtonUI'
import { useCSuite } from '../../ctx/useCSuite'
import { Frame } from '../../frame/Frame'
import { InputNumberUI } from '../../input-number/InputNumberUI'

export const WidgetSeedUI = obs(function WidgetSeedUI_(p: { field: Field_seed }) {
   const field = p.field
   const val = field.ϟvalue_or_zero
   const csuite = useCSuite()

   return (
      <Frame border={csuite.inputBorder} tw={['h-input', 'flex flex-1 items-center']}>
         <ToggleButtonUI // Random
            icon={IKONS.mdiAutoFix}
            value={field.ϟserial.mode === 'randomize'}
            onValueChange={() => {
               field.setToRandomize()
               field.ϟtouch()
            }}
            toggleGroup={field.ϟuid}
            // text='Random'
         />
         <ToggleButtonUI // Fixed
            icon={IKONS.mdiNumeric1CircleOutline}
            value={field.ϟserial.mode === 'fixed'}
            onValueChange={() => {
               field.setToFixed()
               field.ϟtouch()
            }}
            toggleGroup={field.ϟuid}
            // text='Fixed'
         />
         <InputNumberUI // Fixed value
            disabled={field.ϟserial.mode === 'randomize'}
            tw={['flex-1 !border-none']}
            min={field.ϟconfig.min}
            max={field.ϟconfig.max}
            step={1}
            value={val}
            mode='int'
            onValueChange={(value) => {
               field.ϟvalue = value
               field.ϟtouch()
            }}
         />
         <Button // reset fixed value
            size='input'
            tw='!border-l !border-r-0'
            onClick={() => {
               field.setToFixed(Math.floor(Math.random() * 100000000))
               field.ϟtouch()
            }}
            icon={IKONS.mdiAutorenew}
            square
         />
      </Frame>
   )
})
