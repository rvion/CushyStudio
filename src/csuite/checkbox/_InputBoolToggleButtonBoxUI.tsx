import type { IconName } from '../icons/icons'

import { observer } from 'mobx-react-lite'

// import { Toggle } from 'rsuite' // 🔴🔴🔴🔴🔴🔴🔴🔴🔴 BAD
import { IkonOf } from '../icons/iconHelpers'

export const CheckboxAndRadioIcon = observer(function InputBoolToggleButtonBoxUI_(p: {
   //
   mode: 'radio' | 'checkbox' | false | 'switch'
   disabled?: boolean
   isActive: boolean
   iconSize?: string
}) {
   // if (p.mode === 'switch') return <Toggle checked={p.isActive} size='sm' /> // 🔴🔴🔴🔴🔴🔴🔴🔴🔴 BAD, and size not flexible
   const { mode, isActive } = p
   const icon: Maybe<IconName> =
      mode === 'radio'
         ? isActive
            ? IKONS.mdiCheckCircle
            : IKONS.mdiCircleOutline
         : mode === 'checkbox'
           ? isActive
              ? IKONS.mdiCheckboxMarked
              : IKONS.mdiCheckboxBlankOutline
           : null

   const color = p.disabled ? 'text-gray-400' : isActive ? 'text-lsuite-primary' : 'text-lsuite-gray'

   return icon && <IkonOf name={icon} tw={[color, 'shrink-0']} size={p.iconSize ?? '1.3em'} />
   // return <div tw='text-lg mr-1'>{icon && <IkonOf name={icon} />}</div>
})
