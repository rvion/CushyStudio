import type { IWidget } from '../IWidget'

import { activityManger } from '../../operators/Activity'
import { menu, type Menu } from '../../operators/Menu'
import { SimpleMenuEntry } from '../../operators/menuSystem/SimpleMenuEntry'
import { Tree } from '../../panels/libraryUI/tree/xxx/Tree'
import { TreeUI } from '../../panels/libraryUI/tree/xxx/TreeUI'
import { TreeView } from '../../panels/libraryUI/tree/xxx/TreeView'

export const menu_widgetActions: Menu<IWidget> = menu({
    title: 'widget actions',
    entries: (widget: IWidget) => {
        const createPreset = new SimpleMenuEntry('Create Preset', () => {
            console.log('Create Preset')
            activityManger.push({
                uid: 'createPreset',
                onStart: () => console.log('createPreset start'),
                onStop: () => console.log('createPreset stop'),
                UI: () => (
                    <div>
                        <TreeUI
                            treeView={new TreeView(new Tree(cushy, [widget.asTreeElement('root')]), { selectable: true })}
                        ></TreeUI>
                    </div>
                ),
            })
        })
        const presets = widget.config.presets
        if (presets == null) return [createPreset]
        const entries = Object.entries(presets)
        if (entries.length === 0) return [createPreset]
        return [
            //
            createPreset,
            ...entries.map(([key, value]) => new SimpleMenuEntry(key, () => value(widget))),
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
