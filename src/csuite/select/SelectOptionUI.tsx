import type { BoolButtonMode, BoolButtonProps } from '../checkbox/InputBoolUI'
import type { RevealState } from '../reveal/RevealState'
import type { AutoCompleteSelectState } from './SelectState'
import type { CSSProperties } from 'react'

import { observer } from 'mobx-react-lite'

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

/*
 * this is just a wrapper around SelectOptionUI that respect
 * what react-window (virtualization library) expects as a component
 */
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
