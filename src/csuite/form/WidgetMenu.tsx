import type { Menu, MenuEntry } from '../../csuite/menu/Menu'
import type { BaseField } from '../model/BaseField'

import { observer } from 'mobx-react-lite'

import { Button } from '../../csuite/button/Button'
import { MenuDividerUI_ } from '../../csuite/dropdown/MenuDividerUI'
import { menuWithProps } from '../../csuite/menu/Menu'
import { SimpleMenuAction } from '../../csuite/menu/SimpleMenuAction'
import { SimpleMenuModal } from '../../csuite/menu/SimpleMenuModal'
import { RevealUI } from '../../csuite/reveal/RevealUI'
import { Tree } from '../../csuite/tree/Tree'
import { TreeUI } from '../../csuite/tree/TreeUI'
import { TreeView } from '../../csuite/tree/TreeView'
import { toastInfo } from '../../csuite/utils/toasts'

export const WidgetMenuUI = observer(function WidgetMenuUI_(p: { className?: string; widget: BaseField }) {
    return (
        <RevealUI className={p.className} content={() => <menu_widgetActions.UI props={p.widget} />}>
            <Button //
                tooltip='Open field menu'
                borderless
                subtle
                icon='mdiDotsVertical'
                look='ghost'
                square
                size='input'
            />
        </RevealUI>
    )
})

export const menu_widgetActions: Menu<BaseField> = menuWithProps({
    title: 'widget actions',
    entries: (field: BaseField) => {
        const out: MenuEntry[] = []
        // RESET
        out.push(
            new SimpleMenuAction({
                label: 'Reset',
                icon: 'mdiUndoVariant',
                disabled: () => !field.hasChanges,
                onPick: () => field.reset(),
            }),
        )
        out.push(MenuDividerUI_)

        // COLLAPSE ALL CHILDREN
        out.push(
            new SimpleMenuAction({
                label: 'Collapse All',
                icon: 'mdiCollapseAll',
                onPick: () => field.collapseAllChildren(),
            }),
        )

        // EXPAND ALL CHILDREN
        out.push(
            new SimpleMenuAction({
                label: 'Expand All',
                icon: 'mdiExpandAll',
                disabled: field.hasNoChild,
                onPick: () => field.expandAllChildren(),
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
                UI: (w) => <CreatePresetUI widget={field} />,
            }),
        )
        // out.push(
        //     new SimpleMenuAction({
        //         label: 'Create Preset (V2)',
        //         onPick: () => cushy.layout.addCustomV2(CreatePresetUI, { widget /* 🔴 */ }),
        //     }),
        // )
        const presets = field.config.presets ?? []
        if (presets.length > 0) {
            out.push(MenuDividerUI_)
            for (const entry of presets) {
                out.push(
                    new SimpleMenuAction({
                        label: entry.label,
                        icon: entry.icon,
                        onPick: () => entry.apply(field),
                    }),
                )
            }
        }

        out.push(MenuDividerUI_)
        out.push(
            new SimpleMenuAction({
                label: `copy path (${field.path})`,
                icon: 'mdiContentCopy',
                onPick: () => {
                    toastInfo(field.path)
                    return navigator.clipboard.writeText(field.path)
                },
            }),
        )

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

export const CreatePresetUI = observer(function CreatePresetUI_(p: { widget: BaseField }) {
    const tree = new Tree([p.widget.asTreeElement('root')])
    const treeView = new TreeView(tree, { selectable: true })
    return (
        <TreeUI //
            title='Select values to include in preset'
            treeView={treeView}
        />
    )
})
