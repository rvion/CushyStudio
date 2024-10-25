import type { BoolButtonMode, BoolButtonProps } from '../checkbox/InputBoolUI'
import type { RevealState } from '../reveal/RevealState'
import type { AutoCompleteSelectState } from './SelectState'
import type { CSSProperties } from 'react'

import { observer } from 'mobx-react-lite'
import { type ListChildComponentProps } from 'react-window'

import { InputBoolCheckboxUI } from '../checkbox/InputBoolCheckboxUI'

export type SelectOptionProps<T> = {
   reveal: RevealState
   index: number
   style?: CSSProperties
   option: T
   state: AutoCompleteSelectState<T>
   isScrolling?: boolean
   boolButtonProps?: BoolButtonProps
}

export const SelectOptionUI = observer(function SelectOptionUI_<T>(p: SelectOptionProps<T>) {
   const state = p.state
   const isSelected = state.values.find((v) => state.isEqual(v, p.option)) != null
   const mode: BoolButtonMode = state.isMultiSelect ? 'checkbox' : 'radio'

   return (
      <>
         <InputBoolCheckboxUI
            tw='px-2'
            style={p.style}
            expand
            mode={mode}
            hovered={(b) => b || state.selectedIndex === p.index}
            value={isSelected}
            onValueChange={(value) => {
               if (value != isSelected) state.toggleOptionFromFilteredOptionsAtIndex(p.index)
            }}
            {...p.boolButtonProps}
            iconOff={p.state.p.hideOptionCheckbox}
            toggleGroup={state.uid}
         >
            {state.DisplayOptionUI(p.option, { where: 'options-list' })}
         </InputBoolCheckboxUI>
      </>
   )
})

export const SelectOptionUI_FixedList = observer(function SelectOptionUI_<T>({
   data,
   index,
   style,
   isScrolling,
}: ListChildComponentProps<{ s: AutoCompleteSelectState<T>; reveal: RevealState }>) {
   const s = data.s
   const option = s.filteredOptions[index]!
   // 🔶 TODO: onClick on option loses input focus => input should refocus onBlur when target isChildOf stuff
   return (
      <SelectOptionUI //
         option={option}
         reveal={data.reveal}
         state={s}
         index={index}
         style={style}
         isScrolling={isScrolling}
      />
   )
})
