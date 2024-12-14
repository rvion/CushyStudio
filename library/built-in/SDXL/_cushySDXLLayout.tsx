import type { DisplayRuleCtx, DisplaySlotFn } from '../../../src/csuite-cushy/presenters/RenderTypes'
import type { Field_list } from '../../../src/csuite/fields/list/FieldList'
import type { IconName } from '../../../src/csuite/icons/icons'
import type { $CushySDXLUI } from './_cushySDXLSchema'

import { observer } from 'mobx-react-lite'

import { Button } from '../../../src/csuite/button/Button'
import { ShellOptionalEnabledUI } from '../../../src/csuite/fields/optional/WidgetOptional'
import { Frame } from '../../../src/csuite/frame/Frame'
import { IkonOf } from '../../../src/csuite/icons/iconHelpers'
import { InputNumberUI } from '../../../src/csuite/input-number/InputNumberUI'
import { ResizableFrame } from '../../../src/csuite/resizableFrame/resizableFrameUI'
import { PromptEditorUI } from '../../../src/prompt/__TEMP__'

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
      ui.set<Field_list<X.XOptional<X.XPrompt>>>('@list.@optional.@prompt^^', {
         Header: false,
         Body: observer((p) => {
            const positive = ui.field.value.positive
            const activePrompt = positive.prompts[positive.activeIndex]
            return (
               <>
                  <UY.list.BlenderLike<typeof p.field> //
                     activeIndex={positive.activeIndex}
                     field={p.field}
                     renderItem={(item, index) => {
                        const conditioningIcon: IconName =
                           index == 0 ? 'mdiArrowDown' : 'mdiFormatListGroupPlus'
                        return (
                           <UY.Misc.Frame
                              tw='flex items-center'
                              hover
                              key={item.id}
                              onMouseDown={() => (positive.activeIndex = index)}
                           >
                              <span tw={['line-clamp-1 w-full flex-grow px-1', !item.active && 'opacity-50']}>
                                 {item.child.text}
                              </span>
                              <div tw='flex-none'>
                                 <IkonOf name={conditioningIcon} />
                              </div>
                              <div tw='w-2' />
                              <div tw='flex-none'>
                                 {/* <InputNumberUI
                              // TODO(bird_d/ui/logic): Implement showing strength based on the conditioning type, should only appear on blend/add/etc. concate doesn't need it for example.
                              mode='float'
                              hideSlider
                              onValueChange={() => {}}
                              value={ree}
                           /> */}
                                 <UY.Misc.Checkbox
                                    square // TODO(bird_d/ui): Buttons like this, where there's only an icon, should just automatically apply square if there's no text/children.
                                    toggleGroup='prompt'
                                    value={item.active}
                                    onValueChange={(v) => item.setActive(v)}
                                 />
                              </div>
                           </UY.Misc.Frame>
                        )
                     }}
                  />
                  <UY.Misc.Button
                     hover
                     tw='w-full !content-start !items-center !justify-start !border-none !bg-transparent py-[15px] pl-3.5 text-center'
                     icon={positive.showEditor ? 'mdiChevronDown' : 'mdiChevronRight'}
                     onMouseDown={(e) => {
                        if (e.button != 0) {
                           return
                        }
                        positive.showEditor = !positive.showEditor
                     }}
                  >
                     Editor
                  </UY.Misc.Button>

                  {positive.showEditor && (
                     <UY.Misc.Frame tw='p-2' base={cushy.theme.value.inputContrast}>
                        <ResizableFrame tw='!bg-transparent'>
                           {activePrompt ? <PromptEditorUI promptID={activePrompt.id} /> : <>No prompt</>}
                        </ResizableFrame>
                     </UY.Misc.Frame>
                  )}
               </>
            )
         }),
      })
      // already handled by its parent
      ui.set(ui.field.Positive.Prompts, { collapsible: false, Head: false, Header: false })

      ui.set('', (ui2) => {
         if (ui2.field.parent?.parent === ui.field.Positive.Prompts) ui2.set({ Head: false })
         if (ui2.field.parent === ui.field.Positive.Prompts) ui2.set({ Shell: ShellOptionalEnabledUI })
      })
      ui.set(latent.bField, { Shell: UY.Shell.Left })
      // ui.set(latent, { Shell: UY.Shell.Left })
      ui.set('', (ui2) => {
         // ui2.for()
         // const isTopLevelGroup = ui2.field.depth === 1 && true //
         if (
            ui2.field.path.startsWith(latent.bField.path + '.') &&
            ui2.field.type !== 'shared' &&
            ui2.field.type !== 'optional'
         )
            ui2.set({ Shell: UY.Shell.Right })

         if (ui2.field.path.startsWith(model.path + '.')) ui2.set({ Shell: UY.Shell.Right })

         let should = ui2.field.path.startsWith(ui.field.Sampler.path + '.')
         should = ui2.field.depth >= 2
         if (should) {
            if (ui2.field.isOfType('group', 'list', 'choices')) ui2.set({ Title: UY.Title.h4 })
            if (!ui2.field.isOfType('optional', 'link', 'list', 'shared')) ui2.set({ Shell: UY.Shell.Right })
         }
      })
   }
}
