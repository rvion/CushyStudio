import type { Menu, MenuEntry } from '../../operators/Menu'
import type { IWidget } from '../IWidget'

import { observer } from 'mobx-react-lite'

import { menu } from '../../operators/Menu'
import { SimpleMenuAction } from '../../operators/menuSystem/SimpleMenuAction'
import { SimpleMenuModal } from '../../operators/menuSystem/SimpleMenuModal'
import { Tree } from '../../panels/libraryUI/tree/xxx/Tree'
import { TreeUI } from '../../panels/libraryUI/tree/xxx/TreeUI'
import { TreeView } from '../../panels/libraryUI/tree/xxx/TreeView'
import { Button } from '../../rsuite/button/Button'
import { MenuDividerUI_ } from '../../rsuite/dropdown/MenuDividerUI'
import { RevealUI } from '../../rsuite/reveal/RevealUI'

export const WidgetMenuUI = observer(function WidgetMenuUI_(p: { className?: string; widget: IWidget }) {
    return (
        <RevealUI className={p.className} content={() => <menu_widgetActions.UI props={p.widget} />}>
            <Button icon='mdiDotsVertical' look='ghost' square size='input' />
        </RevealUI>
    )
})

export const menu_widgetActions: Menu<IWidget> = menu({
    title: 'widget actions',
    entries: (widget: IWidget) => {
        const out: MenuEntry[] = []
        // RESET
        out.push(
            new SimpleMenuAction({
                label: 'Reset',
                icon: 'mdiUndoVariant',
                disabled: () => !widget.hasChanges,
                onPick: () => widget.reset(),
            }),
        )
        out.push(MenuDividerUI_)
        // FOLD ALL CHILDREN
        out.push(
            new SimpleMenuAction({
                label: 'Expand All',
                icon: 'mdiExpandAll',
                disabled: widget.hasNoChild,
                onPick: () => widget.expandAllChildren(),
            }),
        )
        // COLLAPSE ALL CHILDREN
        out.push(
            new SimpleMenuAction({
                label: 'Collapse All',
                icon: 'mdiCollapseAll',
                onPick: () => widget.collapseAllChildren(),
            }),
        )

        out.push(MenuDividerUI_)
        // CREATE PRESET ACTION
        out.push(
            new SimpleMenuModal({
                label: 'Create Preset',
                submit: () => {
                    console.log(`[🤠] values`)
                },
                UI: () => {
                    const tree = new Tree([widget.asTreeElement('root')])
                    const treeView = new TreeView(tree, { selectable: true })
                    return (
                        <TreeUI //
                            title='Select values to include in preset'
                            treeView={treeView}
                        />
                    )
                },
            }),
        )
        out.push(MenuDividerUI_)
        const presets = widget.config.presets ?? []
        for (const entry of presets) {
            out.push(
                new SimpleMenuAction({
                    label: entry.label,
                    icon: entry.icon,
                    onPick: () => entry.apply(widget),
                }),
            )
        }

        return out
        // CUSTOM ACTIONS
        // return [
        //     new SimpleMenuEntry('foo', () => console.log('foo')),
        //     new SimpleMenuEntry('bar', () => console.log('foo')),
        //     //
        //     // cmd_copyImage.bind(image),
        //     // menu_copyImageAs.bind(image),
        // ]
    },
})
