import type { DisplayRule } from '../../../src/csuite-cushy/presenters/Renderer'
import type { $CushySDXLUI } from './_cushySDXLSchema'

export function _cushySDXLLayout(): Maybe<DisplayRule<$CushySDXLUI['$Field']>> {
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
      ui.for(latent.bField, { Shell: ui.catalog.Shell.Left })
      // ui.for(ui.field.PositiveExtra, { Title: null })
      // ui.for(ui.field.Model.Extra.fields.pag, {
      //     Shell: ui.catalog.Shell.Left,
      //     Title: ui.catalog.Title.h3,
      //     Decoration: ui.catalog.Decorations.Card,
      // })
      ui.forAllFields((ui2) => {
         // ui2.apply()
         const isTopLevelGroup = ui2.field.depth === 1 && true //

         // (ui2.field.type === 'group' || ui2.field.type === 'list' || ui2.field.type === 'choices')
         if (ui2.field.parent?.parent === ui.field.Positive.Prompts) {
            ui2.apply({
               Icon: false,
               Shell: ui.catalog.Shell.List1,
            })
         }
         if (isTopLevelGroup) {
            ui2.apply({
               // Decoration: ui2.catalog.Decorations.Card,
               // Decoration: (p) => <ui.catalog.Decorations.Card hue={hashStringToNumber(ui2.field.path)} {...p} />,
               Title: ui2.catalog.Title.h3,
            })
         }
         if (ui2.field.path.startsWith(latent.path + '.') && ui2.field.type !== 'shared')
            ui2.apply({ Shell: ui.catalog.Shell.Right })

         if (ui2.field.path.startsWith(model.path + '.')) ui2.apply({ Shell: ui.catalog.Shell.Right })

         let should = ui2.field.path.startsWith(ui.field.Sampler.path + '.')
         should = ui2.field.depth >= 2
         if (should) {
            if (ui2.field.isOfType('group', 'list', 'choices')) ui2.apply({ Title: ui.catalog.Title.h4 })
            if (!ui2.field.isOfType('optional', 'link', 'list', 'shared'))
               ui2.apply({ Shell: ui.catalog.Shell.Right })
         }
      })
   }
}
