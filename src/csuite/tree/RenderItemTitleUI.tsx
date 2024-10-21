import type { TreeNode } from './TreeNode'

import { observer } from 'mobx-react-lite'

import { TreeIcon1UI } from './RenderTreeIcon1'

export const RenderItemTitleUI = observer(function RenderItemTitleUI_(p: { node: TreeNode }) {
    const node = p.node
    const item = node.data
    let icon = node.isOpen //
        ? item.iconExpanded ?? item.icon
        : item.icon ?? item.iconExpanded
    if (typeof icon === 'string') {
        icon = <img src={icon} style={{ width: '1.3rem', height: '1.3rem' }} />
    }

    return (
        <div tw='flex flex-grow items-center gap-0.5 overflow-ellipsis whitespace-nowrap'>
            {icon}
            <div
                tw={[
                    //
                    '_TreeItemTitle',
                    'cursor-pointer',
                    'relative flex-grow overflow-hidden overflow-ellipsis',
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
