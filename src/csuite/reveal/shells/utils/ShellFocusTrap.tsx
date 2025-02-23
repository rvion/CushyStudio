import { observer } from 'mobx-react-lite'
import type { RevealState } from '../../RevealState'

export const ShellFocusTrapUI = observer(function ShellFocusTrapUI_(p: { reveal: RevealState }) {
   return (
      <div
         tabIndex={0}
         onFocus={() => {
            p.reveal.close()
            p.reveal.anchorRef.focusOnMountOrNowIfMounted_EVEN_IF_FOCUS_ALREADY_INSIDE()
         }}
      >
      </div>
   )
})
