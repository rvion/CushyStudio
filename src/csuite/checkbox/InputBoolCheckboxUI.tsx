import type { BoolButtonProps } from './InputBoolUI'

import { observer } from 'mobx-react-lite'

import { Frame } from '../frame/Frame'
import { run_tint } from '../kolor/prefab_Tint'
import { CheckboxAndRadioIcon } from './_InputBoolToggleButtonBoxUI'

// 2024-07-31: domi: not 100% sure what the difference is supposed to be with InputBoolToggleButtonUI
// => ok the the other one is probably a togglable button. it was just unclear in SelectOptionUI
// => can probably merge the two of them, except "input" like style may not make sense for buttons... let's see later
export const InputBoolCheckboxUI = observer(function InputBoolCheckboxUI_(p: BoolButtonProps) {
   const { onValueChange, iconOff, toggleGroup, widgetLabel, value, ...rest } = p
   const isActive = value ?? false
   const mode = p.mode ?? 'checkbox' // 'checkbox'
   // const chroma = getInputBoolChroma(isActive)
   // const contrast = getInputBoolContrast(isActive)
   return (
      <Frame //Container (Makes it so we follow Fitt's law and neatly contains everything)
         // hoverable
         line
         hover
         size='input'
         triggerOnPress={{ startingState: isActive, toggleGroup }}
         tw={['!h-full cursor-pointer select-none !bg-transparent px-0.5']}
         onClick={(ev) => {
            if (p.disabled) return
            if (!p.onValueChange) return
            ev.stopPropagation()
            p.onValueChange(!isActive)
         }}
         {...rest}
         role='checkbox'
         aria-checked={isActive}
         aria-disabled={p.disabled}
         text={run_tint(cushy.preferences.theme.value.global.active)}
      >
         {p.iconOff !== true && (
            <CheckboxAndRadioIcon
               // tw='h-full items-center text-center'
               isActive={isActive}
               disabled={p.disabled}
               mode={mode}
               iconSize='1.2rem' // 🔴 should be var(--inside-height), but for now we lose the csuite context in old modals. (cf fiche client in ticket modal)
            />
         )}
         {p.children ?? (widgetLabel ? <div tw='pl-1'>{widgetLabel}</div> : null)}
      </Frame>
   )
})
