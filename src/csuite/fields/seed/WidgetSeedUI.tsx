import type { Field_seed } from './FieldSeed'

import { Button } from '../../button/Button'
import { ToggleButtonUI } from '../../checkbox/InputBoolToggleButtonUI'
import { useCSuite } from '../../ctx/useCSuite'
import { Frame } from '../../frame/Frame'
import { InputNumberUI } from '../../input-number/InputNumberUI'

export const WidgetSeedUI = obs(function WidgetSeedUI_(p: { field: Field_seed }) {
   const field = p.field
   const val = field.zValueOrZero
   const csuite = useCSuite()

   return (
      <Frame border={csuite.inputBorder} tw={['h-input', 'flex flex-1 items-center']}>
         <ToggleButtonUI // Random
            icon={IKONS.mdiAutoFix}
            value={field.zSerial.mode === 'randomize'}
            onValueChange={() => {
               field.setToRandomize()
               field.zTouch()
            }}
            toggleGroup={field.zUid}
            // text='Random'
         />
         <ToggleButtonUI // Fixed
            icon={IKONS.mdiNumeric1CircleOutline}
            value={field.zSerial.mode === 'fixed'}
            onValueChange={() => {
               field.setToFixed()
               field.zTouch()
            }}
            toggleGroup={field.zUid}
            // text='Fixed'
         />
         <InputNumberUI // Fixed value
            disabled={field.zSerial.mode === 'randomize'}
            tw={['flex-1 !border-none']}
            min={field.zConfig.min}
            max={field.zConfig.max}
            step={1}
            value={val}
            mode='int'
            onValueChange={(value) => {
               field.zValue = value
               field.zTouch()
            }}
         />
         <Button // reset fixed value
            size='input'
            tw='!border-l !border-r-0'
            onClick={() => {
               field.setToFixed(Math.floor(Math.random() * 100000000))
               field.zTouch()
            }}
            icon={IKONS.mdiAutorenew}
            square
         />
      </Frame>
   )
})
