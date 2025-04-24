import type { MenuEntry } from '../menu/MenuEntry'
import type { Field } from '../model/Field'
import type { Provenance } from '../provenance/Provenance'

import { getVisualPath } from '../../csuite-cushy/presenters/RenderCtx'
import { MenuDividerUI_ } from '../dropdown/MenuDivider2'
import { defineMenuTemplate, MenuTemplate } from '../menu/MenuTemplate'
import { SimpleMenuAction } from '../menu/SimpleMenuAction'
import { SimpleMenuModal } from '../menu/SimpleMenuModal'
import { potatoClone } from '../utils/potatoClone'
import { toastInfo } from '../utils/toasts'
import { CreatePresetUI } from './CreatePresetUI'

export type FieldActionMenuProps = {
   field: Field
   provenance?: Maybe<Provenance>
}

export const fieldActionMenu: MenuTemplate<FieldActionMenuProps> = defineMenuTemplate({
   title: 'widget actions',
   entries: ({ field, provenance }) => {
      const out: MenuEntry[] = []
      // CREATE PRESET ACTION
      const presets = field.zConfig.presets ?? []
      out.push(
         new MenuTemplate({
            icon: IKONS.mdiLanguageXaml,
            title: `Presets ${presets.length}`,
            disabled: presets.length === 0,
            entries: (): MenuEntry[] =>
               presets.map(
                  (entry) =>
                     new SimpleMenuAction({
                        label: entry.label,
                        icon: entry.icon,
                        onClick: (): void => entry.apply(field),
                     }),
               ),
         }).bind({}),
      )
      out.push(
         new SimpleMenuModal({
            label: 'Create Preset',
            icon: IKONS.mdiPlus,
            submit: (): void => {
               console.log(`[🤠] values`)
            },
            UI: (w): React.JSX.Element => <CreatePresetUI field={field} />,
         }),
      )
      out.push(
         new SimpleMenuAction({
            label: 'Open in VSCode',
            icon: IKONS.mdiMicrosoftVisualStudioCode,
            disabled: (): boolean => provenance == null,
            onClick: (): Promise<void> | void => {
               console.log(`[🤠] `, provenance)
               return provenance?.open?.()
            },
         }),
      )
      // RESET
      out.push(
         new SimpleMenuAction({
            label: 'Reset',
            icon: IKONS.mdiUndoVariant,
            disabled: (): boolean => !field.zHasChanges,
            onClick: (): void => void field.zReset(),
         }),
      )
      out.push(MenuDividerUI_)
      out.push(
         new SimpleMenuAction({
            label: 'Save Snapshot',
            icon: IKONS.mdiArrowLeftBox,
            onClick: (): void => {
               const snap = field.zSaveSnapshot()
               console.log(JSON.stringify(potatoClone(snap), null, 4))
            },
         }),
      )

      out.push(
         new SimpleMenuAction({
            label: 'Restore Snapshot',
            icon: IKONS.mdiArrowRightBox,
            disabled: (): boolean => !field.zHasSnapshot,
            onClick: (): void => void field.zRevertToSnapshot(),
         }),
      )
      out.push(MenuDividerUI_)

      // COLLAPSE ALL CHILDREN
      out.push(
         new SimpleMenuAction({
            label: 'Collapse All',
            icon: IKONS.mdiCollapseAll,
            onClick: (): void => field.zCollapseAllChildren(),
         }),
      )

      // EXPAND ALL CHILDREN
      out.push(
         new SimpleMenuAction({
            label: 'Expand All',
            icon: IKONS.mdiExpandAll,
            disabled: field.zHasNoChild,
            onClick: (): void => field.zExpandAllChildren(),
         }),
      )

      out.push(MenuDividerUI_)

      // out.push(
      //     new SimpleMenuAction({
      //         label: 'Create Preset (V2)',
      //         onPick: () => cushy.layout.addCustomV2(CreatePresetUI, { widget /* 🔴 */ }),
      //     }),
      // )
      // if (presets.length > 0) {
      // // out.push(MenuDividerUI_)
      // for (const entry of presets) {
      //     out.push(
      //         new SimpleMenuAction({
      //             label: entry.label,
      //             icon: entry.icon,
      //             onClick: (): void => entry.apply(field),
      //         }),
      //     )
      // }
      // }
      out.push(MenuDividerUI_)
      out.push(
         new SimpleMenuAction({
            label: `copy pathNice (${field.zPathNice})`,
            icon: IKONS.mdiContentCopy,
            onClick: (): Promise<void> => {
               toastInfo(field.zPathNice)
               return navigator.clipboard.writeText(field.zPathNice)
            },
         }),
      )
      out.push(
         new SimpleMenuAction({
            label: `copy path (${field.zPath})`,
            icon: IKONS.mdiContentCopy,
            onClick: (): Promise<void> => {
               toastInfo(field.zPath)
               return navigator.clipboard.writeText(field.zPath)
            },
         }),
      )
      out.push(
         new SimpleMenuAction({
            label: `copy pathExt (${field.zPathExt})`,
            icon: IKONS.mdiContentCopy,
            onClick: (): Promise<void> => {
               toastInfo(field.zPathExt)
               return navigator.clipboard.writeText(field.zPathExt)
            },
         }),
      )

      out.push(
         new SimpleMenuAction({
            label: `copy VISUAL pathExt (${getVisualPath(/* field */)})`,
            icon: IKONS.mdiContentCopy,
            onClick: (): Promise<void> => {
               const visualPath = getVisualPath(/* field */)
               toastInfo(visualPath)
               return navigator.clipboard.writeText(visualPath)
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
