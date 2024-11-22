import type { TreeEntryAction } from './TreeEntry'
import type { TreeNode } from './TreeNode'

import { observer } from 'mobx-react-lite'

import { Button } from '../button/Button'
import { IkonOf } from '../icons/iconHelpers'

export const TreeIcon1UI = observer(function TreeIcon1UI_(p: TreeEntryAction & { node: TreeNode }) {
   const action = p
   return (
      <Button
         className={p.className}
         key={action.name}
         size='xs'
         square
         subtle
         onClick={(e) => {
            e.stopPropagation()
            action.onClick?.(p.node)
         }}
      >
         <IkonOf name={action.icon} />
      </Button>
   )
})
