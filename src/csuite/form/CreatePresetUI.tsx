import type { Field } from '../model/Field'

import { observer } from 'mobx-react-lite'

import { Tree } from '../tree/Tree'
import { TreeUI } from '../tree/TreeUI'
import { TreeView } from '../tree/TreeView'

export const CreatePresetUI = observer(function CreatePresetUI_(p: { field: Field }) {
    const tree = new Tree([p.field.asTreeElement('root')])
    const treeView = new TreeView(tree, { selectable: true })
    return (
        <TreeUI //
            title='Select values to include in preset'
            treeView={treeView}
        />
    )
})
