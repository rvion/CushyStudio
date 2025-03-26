import type { RevealState } from '../../RevealState'

import { observer } from 'mobx-react-lite'

export const ShellFocusTrapUI = observer(function ShellFocusTrapUI_(p: { reveal: RevealState }) {
   return (
      <div
         tabIndex={0}
         data-focus-trap
         onFocus={() => {
            p.reveal.close()
            p.reveal.anchorRef.focusOnMountOrNowIfMounted_EVEN_IF_FOCUS_ALREADY_INSIDE()
         }}
      />
   )
})

// TODO: backport https://github.com/LocomotiveHQ/monoloco/pull/2414/files#diff-2b9447e89e8edd765432244c346eeb9c2cc309262ab1c3c21dfaf72ebc94369e
