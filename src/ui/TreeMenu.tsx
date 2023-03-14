import { observer } from 'mobx-react-lite'
import TreeView, { ITreeViewOnSelectProps } from 'react-accessible-treeview'
import { INodeExt, ITreeNode, ITreeNodeType, TreeNodeIconUI } from '../core/tree'
import { FileIcon, FolderIcon } from './IconsUI'
import { useSt } from './stContext'

export const MenuTreeUI = observer(function MenuTreeUI_(p: {}) {
    const client = useSt()
    const data = client.treeData
    const expandedByDefault = data
        .filter((t) => {
            if (t.type === 'script') return false
            if (t.type === 'graph') return false
            return true
        })
        .map((d) => d.id)

    return (
        <div>
            <div className='directory'>
                <TreeView
                    data={data}
                    expandedIds={expandedByDefault}
                    onSelect={(props: ITreeViewOnSelectProps) => {
                        const node = props.element as INodeExt
                        console.log(node, props.isSelected ? '🟢' : '🔴')
                        if (node.onClick) node.onClick()
                    }}
                    // onSelect={(node: INodeExt) => {
                    // }))
                    aria-label='directory tree'
                    nodeRenderer={({ element, isBranch, isExpanded, getNodeProps, level, ...p }) => {
                        const elem: INodeExt = element as any as INodeExt
                        const type: ITreeNodeType = elem.type
                        return (
                            <div {...getNodeProps()} style={{ paddingLeft: 20 * (level - 1), display: 'flex' }}>
                                <TreeNodeIconUI node={type} />
                                <span style={{ paddingLeft: '1rem' }}>{element.name}</span>
                                {isBranch ? ( //
                                    <FolderIcon isOpen={isExpanded} />
                                ) : (
                                    <FileIcon filename={element.name} />
                                )}
                                <div className='grow'></div>
                                {elem.action}
                            </div>
                        )
                    }}
                />
            </div>
        </div>
    )
})
