import type { IWidget } from '../IWidget'

import { menu, type Menu } from '../../operators/Menu'
import { SimpleMenuAction } from '../../operators/menuSystem/SimpleMenuAction'
import { SimpleMenuModal } from '../../operators/menuSystem/SimpleMenuModal'
import { Tree } from '../../panels/libraryUI/tree/xxx/Tree'
import { TreeUI } from '../../panels/libraryUI/tree/xxx/TreeUI'
import { TreeView } from '../../panels/libraryUI/tree/xxx/TreeView'

export const menu_widgetActions: Menu<IWidget> = menu({
    title: 'widget actions',
    entries: (widget: IWidget) => {
        // UNDO ACTION
        const undo = new SimpleMenuAction({
            label: 'Undo',
            icon: 'mdiUndoVariant',
            disabled: () => !widget.hasChanges,
            onPick: () => widget.reset(),
        })

        // CREATE PRESET ACTION
        const createPreset = new SimpleMenuModal({
            label: 'Create Preset',
            submit: () => {
                console.log(`[🤠] values`)
            },
            UI: () => {
                const tree = new Tree([widget.asTreeElement('root')])
                const treeView = new TreeView(tree, { selectable: true })
                return <TreeUI title='Select values to include in preset' treeView={treeView}></TreeUI>
            },
        })

        const presets = widget.config.presets
        if (presets == null) return [undo, createPreset]
        const entries = presets
        if (entries.length === 0) return [undo, createPreset]
        return [
            undo,
            createPreset,
            // CUSTOM ACTIONS
            ...entries.map(
                (entry) =>
                    new SimpleMenuAction({
                        label: entry.label,
                        icon: entry.icon,
                        onPick: () => entry.apply(widget),
                    }),
            ),
        ]
        // return [
        //     new SimpleMenuEntry('foo', () => console.log('foo')),
        //     new SimpleMenuEntry('bar', () => console.log('foo')),
        //     //
        //     // cmd_copyImage.bind(image),
        //     // menu_copyImageAs.bind(image),
        // ]
    },
})
