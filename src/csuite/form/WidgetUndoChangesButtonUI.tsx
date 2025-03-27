import type { Field } from '../model/Field'

import { Button } from '../../csuite/button/Button'

export const WidgetUndoChangesButtonUI = obs(function WidgetUndoChangesButtonUI_(p: {
   //
   className?: string
   field: Field
}) {
   const field = p.field
   return (
      <Button
         subtle
         tabIndex={-1}
         tooltip='Reset to default values'
         borderless
         className={p.className}
         onClick={() => field?.ϟreset()}
         disabled={!(field?.ϟhasChanges ?? false)}
         icon={IKONS.mdiUndoVariant}
         look='ghost'
         size='widget'
         // square
         tw='!px-0'
      />
   )
})
