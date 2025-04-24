import { SelectUI } from '../select/SelectUI'

export const MenuFuzzySearchActivityUI = obs(function MenuFuzzySearchActivityUI(p: {}) {
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
