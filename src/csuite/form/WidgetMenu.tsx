import type { Menu } from '../../csuite/menu/Menu'
import type { MenuEntry } from '../menu/MenuEntry'
import type { Field } from '../model/Field'

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
import { potatoClone } from '../utils/potatoClone'

export const WidgetMenuUI = observer(function WidgetMenuUI_(p: { className?: string; widget: Field }) {
    return (
        <RevealUI className={p.className} content={() => <menu_fieldActions.UI props={p.widget} />}>
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

export const menu_fieldActions: Menu<Field> = menuWithProps({
    title: 'widget actions',
    entries: (field: Field) => {
        const out: MenuEntry[] = []
        // RESET
        out.push(
            new SimpleMenuAction({
                label: 'Reset',
                icon: 'mdiUndoVariant',
                disabled: (): boolean => !field.hasChanges,
                onPick: (): void => void field.reset(),
            }),
        )
        out.push(MenuDividerUI_)
        out.push(
            new SimpleMenuAction({
                label: 'Save Snapshot',
                icon: 'mdiArrowLeftBox',
                onPick: (): void => {
                    const snap = field.saveSnapshot()
                    console.log(JSON.stringify(potatoClone(snap), null, 4))
                },
            }),
        )

        out.push(
            new SimpleMenuAction({
                label: 'Restore Snapshot',
                icon: 'mdiArrowRightBox',
                disabled: (): boolean => !field.hasSnapshot,
                onPick: (): void => void field.revertToSnapshot(),
            }),
        )
        out.push(MenuDividerUI_)

        // COLLAPSE ALL CHILDREN
        out.push(
            new SimpleMenuAction({
                label: 'Collapse All',
                icon: 'mdiCollapseAll',
                onPick: (): void => field.collapseAllChildren(),
            }),
        )

        // EXPAND ALL CHILDREN
        out.push(
            new SimpleMenuAction({
                label: 'Expand All',
                icon: 'mdiExpandAll',
                disabled: field.hasNoChild,
                onPick: (): void => field.expandAllChildren(),
            }),
        )

        out.push(MenuDividerUI_)
        // CREATE PRESET ACTION
        out.push(
            new SimpleMenuModal({
                label: 'Create Preset',
                icon: 'mdiPlus',
                submit: (): void => {
                    console.log(`[🤠] values`)
                },
                UI: (w): JSX.Element => <CreatePresetUI field={field} />,
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
            // out.push(MenuDividerUI_)
            for (const entry of presets) {
                out.push(
                    new SimpleMenuAction({
                        label: entry.label,
                        icon: entry.icon,
                        onPick: (): void => entry.apply(field),
                    }),
                )
            }
        }

        out.push(MenuDividerUI_)
        out.push(
            new SimpleMenuAction({
                label: `copy path (${field.path})`,
                icon: 'mdiContentCopy',
                onPick: (): Promise<void> => {
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
