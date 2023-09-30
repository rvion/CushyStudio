import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { TreeView } from '@lexical/react/LexicalTreeView'

export const TreeViewPlugin = () => {
    const [editor] = useLexicalComposerContext()
    return (
        <div className='text-xs bg-gray-700'>
            <TreeView
                treeTypeButtonClassName='debug-treetype-button'
                viewClassName='tree-view-output'
                timeTravelPanelClassName='debug-timetravel-panel'
                timeTravelButtonClassName='debug-timetravel-button'
                timeTravelPanelSliderClassName='debug-timetravel-panel-slider'
                timeTravelPanelButtonClassName='debug-timetravel-panel-button'
                editor={editor}
            />
        </div>
    )
}
