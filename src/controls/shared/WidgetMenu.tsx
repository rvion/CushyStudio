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
        // const createPreset = new SimpleMenuEntry('Create Preset', () => {
        //     console.log('Create Preset')
        //     activityManger.push({
        //         uid: 'createPreset',
        //         onStart: () => console.log('createPreset start'),
        //         onStop: () => console.log('createPreset stop'),
        //         UI: () => (
        //             <div>
        //                 <TreeUI
        //                     treeView={new TreeView(new Tree(cushy, [widget.asTreeElement('root')]), { selectable: true })}
        //                 ></TreeUI>
        //             </div>
        //         ),
        //     })
        // })
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
        if (presets == null) return [createPreset]
        const entries = presets
        if (entries.length === 0) return [createPreset]
        return [
            //
            createPreset,
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
