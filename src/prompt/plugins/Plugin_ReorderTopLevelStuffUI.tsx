import { observer } from 'mobx-react-lite'
import SortableList, { SortableItem } from 'react-easy-sort'

import { Frame } from '../../csuite/frame/Frame'
import { WidgetPromptUISt } from '../WidgetPromptUISt'

export const Plugin_ReorderTopLevelStuffUI = observer(function Plugin_ReorderTopLevelStuffUI_(p: { uist: WidgetPromptUISt }) {
    const uist = p.uist
    const allNodes = uist.ast.allTopLevelNodesExceptSeparators
    return (
        <SortableList
            draggedItemClassName='dragged'
            className='flex flex-wrap gap-1'
            onSortEnd={(oldIndex, newIndex) => {
                let wholeText = uist.editorView?.state.doc.toString()!
                //
                console.log(`[🧐] oldIndex, newIndex`, oldIndex, newIndex)
                // const items = uist.ast.findAll('Identifier')
                const items = allNodes // uist.ast.allTopLevelNodes()
                const insertBeforeNode = items[newIndex]!
                const oldItem = items[oldIndex]!

                const indexA =
                    allNodes.findIndex((i) => i.from === oldItem.from) + //
                    (newIndex > oldIndex ? -1 : 1)
                const nodeA = allNodes[indexA]
                const isLatest = nodeA == null
                const shouldCopyUpTo = nodeA?.from || wholeText.length
                //
                console.log(`[🧐] oldIndex, newIndex`, oldIndex, newIndex)
                const removeFrom = oldItem.from
                const removeTo = shouldCopyUpTo // oldItem.to + 1
                const insertAt = insertBeforeNode.from
                //

                // let txt = oldItem.text
                let txt = wholeText.slice(removeFrom, removeTo)

                console.log(`[🧐] `, { removeFrom, removeTo, insertAt })
                uist.editorView?.dispatch({
                    changes: [
                        { from: removeFrom, to: removeTo, insert: '' },
                        { from: insertAt, to: insertAt, insert: txt + (isLatest ? ', ' : '') },
                    ],
                })
            }}
        >
            {allNodes.map((i) => (
                <SortableItem key={i.from}>
                    <div tw='flex'>
                        <Frame border base tw='px-1'>
                            {i.text}
                        </Frame>
                    </div>
                </SortableItem>
            ))}
        </SortableList>
    )
})
