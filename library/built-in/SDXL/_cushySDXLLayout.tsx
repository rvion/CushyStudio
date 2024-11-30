import type { DisplaySlotFn } from '../../../src/csuite-cushy/presenters/RenderTypes'
import type { $CushySDXLUI } from './_cushySDXLSchema'

import { observer } from 'mobx-react-lite'

import { ShellOptionalEnabledUI } from '../../../src/csuite/fields/optional/WidgetOptional'

export function _cushySDXLLayout(): Maybe<DisplaySlotFn<$CushySDXLUI['$Field']>> {
   return (ui) => {
      const xxx = ui.field.Latent.bField
      // ui.apply({
      //     layout: () => [
      //         //
      //         <div>{`${xxx.logicalParent?.path} | ${xxx.logicalParent?.type}`}</div>,
      //         <div>{`${xxx.logicalParent?.logicalParent?.path} | ${xxx.logicalParent?.logicalParent?.type}`}</div>,
      //         <div>{`${xxx.type}`}</div>,
      //         '*',
      //     ],
      //     // layout: () => [
      //     //     <Card hue={knownOKLCHHues.success}>
      //     //         <ui.field.Positive.UI />
      //     //         <ui.field.PositiveExtra.UI />
      //     //         {ui.field.Extra.fields.promtPlus && <ui.field.Extra.fields.promtPlus.UI />}
      //     //         {ui.field.Extra.fields.regionalPrompt && <ui.field.Extra.fields.regionalPrompt.UI />}
      //     //     </Card>,
      //     //     <Card hue={knownOKLCHHues.info}>
      //     //         <ui.field.Model.UI />
      //     //     </Card>,
      //     //     '*',
      //     // ],
      // })

      const model = ui.field.Model
      const latent = ui.field.Latent
      ui.ui(ui.field.Positive.Prompts, {
         Head: false,
         Header: false,
         Body: observer((p) => (
            <ui.catalog.list.BlenderLike<typeof p.field> //
               field={p.field}
               renderItem={(item) => (
                  <ui.catalog.Misc.Frame tw='flex items-center' hover key={item.id}>
                     <span tw={['line-clamp-1 flex-grow px-1', !item.active && 'opacity-50']}>
                        {item.child.text}
                     </span>
                     <div tw='flex-none'>
                        <ui.catalog.Misc.Checkbox
                           square // TODO(bird_d/ui): Buttons like this, where there's only an icon, should just automatically apply square if there's no text/children.
                           toggleGroup='prompt'
                           value={item.active}
                           onValueChange={(v) => item.setActive(v)}
                        />
                     </div>
                  </ui.catalog.Misc.Frame>
               )}
            />
         )),
      })
      ui.ui('', (ui2) => {
         if (ui2.field.parent?.parent === ui.field.Positive.Prompts) ui2.ui({ Head: false })
         if (ui2.field.parent === ui.field.Positive.Prompts) ui2.ui({ Shell: ShellOptionalEnabledUI })
      })
      ui.ui(latent.bField, { Shell: ui.catalog.Shell.Left })
      ui.ui('', (ui2) => {
         // ui2.for()
         // const isTopLevelGroup = ui2.field.depth === 1 && true //
         if (
            ui2.field.path.startsWith(latent.path + '.') &&
            ui2.field.type !== 'shared' &&
            ui2.field.type !== 'optional'
         )
            ui2.ui({ Shell: ui.catalog.Shell.Right })

         if (ui2.field.path.startsWith(model.path + '.')) ui2.ui({ Shell: ui.catalog.Shell.Right })

         let should = ui2.field.path.startsWith(ui.field.Sampler.path + '.')
         should = ui2.field.depth >= 2
         if (should) {
            if (ui2.field.isOfType('group', 'list', 'choices')) ui2.ui({ Title: ui.catalog.Title.h4 })
            if (!ui2.field.isOfType('optional', 'link', 'list', 'shared'))
               ui2.ui({ Shell: ui.catalog.Shell.Right })
         }
      })
   }
}
