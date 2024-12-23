import { observer } from 'mobx-react-lite'

import { SelectUI } from '../select/SelectUI'

export const MenuFuzzySearchActivityUI = observer(function MenuFuzzySearchActivityUI(p: {}) {
   return (
      <div>
         <SelectUI //
            revealProps={{}}
            options={() => ['a', 'b', 'c', null]}
            value={() => null}
            getLabelText={(t) => t ?? 'null'}
            onOptionToggled={(val) => console.log(val)}
         />
      </div>
   )
})
