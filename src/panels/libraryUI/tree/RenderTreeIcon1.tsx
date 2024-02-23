import { observer } from 'mobx-react-lite'

import { TreeEntryAction } from './TreeEntry'
import { TreeNode } from './xxx/TreeNode'

export const TreeIcon1UI = observer(function TreeIcon1UI_(p: TreeEntryAction & { node: TreeNode }) {
    const action = p
    return (
        <div
            className={p.className}
            key={action.name}
            tw='btn btn-xs btn-square btn-ghost'
            onClick={(e) => {
                e.stopPropagation()
                action.onClick?.(p.node)
            }}
        >
            <span className='material-symbols-outlined'>{action.icon}</span>
        </div>
    )
})
