import type { Field } from '../model/Field'

import { Tree } from '../tree/Tree'
import { TreeUI } from '../tree/TreeUI'
import { TreeView } from '../tree/TreeView'

export const CreatePresetUI = obs(function CreatePresetUI_(p: { field: Field }) {
   const tree = new Tree([p.field.ϟasTreeElement('root')])
   const treeView = new TreeView(tree, { selectable: true })
   return (
      <TreeUI //
         title='Select values to include in preset'
         treeView={treeView}
      />
   )
})
