import { observer } from 'mobx-react-lite'
import SortableList, { SortableItem } from 'react-easy-sort'

import { WidgetPromptUISt } from '../WidgetPromptUISt'
import { PluginWrapperUI } from './_PluginWrapperUI'

export const Plugin_ReorderTopLevelStuffUI = observer(function Plugin_ReorderTopLevelStuffUI_(p: { uist: WidgetPromptUISt }) {
    const uist = p.uist
    return (
        <div>
            <SortableList
                draggedItemClassName='dragged'
                className='flex gap-1'
                onSortEnd={(oldIndex, newIndex) => {
                    console.log(`[👙] oldIndex, newIndex`, oldIndex, newIndex)
                    const items = uist.ast.findAll('Identifier')
                    const insertBeforeNode = items[newIndex]
                    let txt = items[oldIndex].text
                    console.log(`[👙] oldIndex, newIndex`, oldIndex, newIndex)
                    const removeFrom = items[oldIndex].from
                    const removeTo = items[oldIndex].to
                    const insertAt = insertBeforeNode.from
                    console.log(`[👙] `, { removeFrom, removeTo, insertAt })
                    uist.editorView?.dispatch({
                        changes: [
                            { from: removeFrom, to: removeTo, insert: '' },
                            { from: insertAt, to: insertAt, insert: txt },
                        ],
                    })
                }}
            >
                {uist.ast.findAll('Identifier').map((i) => (
                    <SortableItem key={i.from}>
                        <div tw='flex'>
                            <div tw='btn btn-sm btn-outline'>{i.text}</div>
                        </div>
                    </SortableItem>
                ))}
            </SortableList>
        </div>
    )
})
