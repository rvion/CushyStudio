import { observer } from 'mobx-react-lite'

import { TreeIcon1UI } from './RenderTreeIcon1'
import { TreeNode } from './xxx/TreeNode'

export const RenderItemTitleUI = observer(function RenderItemTitleUI_(p: { node: TreeNode }) {
    const node = p.node
    const item = node.data
    let icon = node.isOpen //
        ? item.iconExpanded ?? item.icon
        : item.icon ?? item.iconExpanded
    if (typeof icon === 'string') {
        icon = <img src={icon} style={{ width: '1.3rem', height: '1.3rem' }} />
        // icon = <span className='material-icons-outlined'>{icon}</span>
    }

    return (
        <div tw='flex flex-grow items-center gap-0.5 whitespace-nowrap overflow-ellipsis'>
            {icon}
            <div
                tw={[
                    //
                    '_TreeItemTitle',
                    'cursor-pointer',
                    'flex-grow relative overflow-hidden overflow-ellipsis',
                ]}
                onClick={() => {
                    item.onPrimaryAction?.(node)
                }}
            >
                &nbsp;
                <div tw='absolute inset-0'>{item.name}</div>
            </div>
            <div tw='ml-auto opacity-40 hover:opacity-100'>
                {item.extra?.()}
                {item.actions?.map((action, ix) => {
                    return <TreeIcon1UI key={ix} node={node} {...action} />
                })}
            </div>
        </div>
    )
})
