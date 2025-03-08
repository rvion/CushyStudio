import type { BoolButtonProps } from './InputBoolUI'

import { observer } from 'mobx-react-lite'

import { useCSuite } from '../ctx/useCSuite'
import { Frame } from '../frame/Frame'

export const InputBoolFlipButtonUI = observer(function InputBoolFlipButtonUI_(p: BoolButtonProps) {
   const isActive = p.value ?? false
   const label = p.text
   const mode = p.mode ?? false // 'checkbox'
   // const chroma = getInputBoolChroma(isActive)
   // const contrast = getInputBoolContrast(isActive)

   const csuite = useCSuite()

   return (
      <Frame //Container (Makes it so we follow Fitt's law and neatly contains everything)
         style={p.style}
         className={p.className}
         disabled={p.disabled}
         tooltip={p.tooltip}
         tooltipPlacement={p.tooltipPlacement}
         hover
         triggerOnPress={
            csuite.enableRollingClick !== false
               ? { startingState: isActive, toggleGroup: p.toggleGroup }
               : undefined
         }
         expand={p.expand}
         tw={['flex cursor-pointer !select-none flex-row']}
         onClick={(ev) => {
            if (!p.onValueChange) return
            ev.stopPropagation()
            ev.preventDefault()
            p.onValueChange(!isActive)
         }}
      >
         <Frame // Checkbox
            size='input'
            square
            icon={p.icon ?? (isActive ? IKONS.mdiCheckBold : null)}
            tw={['!select-none', mode === 'radio' ? 'rounded-full' : 'rounded-sm']}
            // border={{ contrast: 0.2, chroma }}
            // base={{ contrast, chroma }}
            // square
            iconSize='var(--input-icon-height)'
            hover
            {...p.box}
         />
         {p.children ?? (label ? <div tw='ml-1'>{label}</div> : null)}
      </Frame>
   )
})
