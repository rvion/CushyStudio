import type { Menu } from '../menu/Menu'
import type { Field } from '../model/Field'

import { Button } from '../../csuite/button/Button'
import { RevealUI } from '../../csuite/reveal/RevealUI'
import { useProvenance } from '../provenance/Provenance'
import { fieldActionMenu } from './fieldActionMenu'

export type WidgetMenuProps = {
   className?: string | null
   field: Field
}

export const WidgetMenuUI = obs(function WidgetMenu(p: WidgetMenuProps) {
   const field = p.field
   const provenance = useProvenance()
   const menu: Menu = fieldActionMenu.useBind({ field, provenance })
   return (
      <RevealUI //
         className={p.className ?? undefined}
         content={() => <menu.UI />}
      >
         <Button //
            tooltip='Open field menu'
            tabIndex={-1}
            borderless
            subtle
            icon={IKONS.mdiDotsVertical}
            look='ghost'
            size='widget'
            // square
            tw='!px-0'
         />
      </RevealUI>
   )
})
