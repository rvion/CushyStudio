import { observer } from 'mobx-react-lite'
import { ProjectTreeUI } from './ProjectTreeUI'

import * as I from '@rsuite/icons'
import { Tree } from 'rsuite'
import { ItemDataType } from 'rsuite/esm/@types/common'
import { useWorkspace } from '../ui/WorkspaceContext'
// const [getNodes, fetchNodes] = mockAsyncData()
// const data = getNodes(10)

export const MenuUI = observer(function IdeInfosUI_() {
    const wsp = useWorkspace()
    return (
        <div className='col gap h100'>
            <ProjectTreeUI />
            <Tree
                virtualized
                data={wsp.rootFolder.files}
                showIndentLine
                draggable
                getChildren={wsp.rootFolder.fetchNodes}
                // renderTreeIcon={(node) => {
                //     if (node.children) return <FolderFill />
                //     return <I.Page />
                // }}
                height={1000}
                listProps={{ itemSize: () => 30 }}
                defaultExpandItemValues={['node_modules', 'node_modules-rsuite']}
                renderTreeNode={(node) => {
                    return (
                        <>
                            {renderIcon(node)} {node.label}
                        </>
                    )
                }}
            />
            <div className='grow'></div>
        </div>
    )
})

const renderIcon = (node: ItemDataType<string | number>) => {
    if (node.children) return <I.FolderFill />
    if (node.path.endsWith('.js')) return <I.Code color='yellow' />
    if (node.path.endsWith('.json')) return <I.Setting color='yellow' />
    if (node.path.endsWith('.ts')) return <I.Tree color='rgb(92, 171, 255)' />
    return <I.Page />
}
