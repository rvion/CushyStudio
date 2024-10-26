import type { RevealState } from '../reveal/RevealState'
import type { AutoCompleteSelectState } from './SelectState'
import type { ListChildComponentProps } from 'react-window'

import { observer } from 'mobx-react-lite'

import { SelectOptionUI } from './SelectOptionUI'

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
