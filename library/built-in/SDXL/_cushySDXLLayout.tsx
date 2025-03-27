import type { App } from '../../../src/cards/App'
import type { Field_group } from '../../../src/csuite/fields/group/FieldGroup'
import type { Field_list } from '../../../src/csuite/fields/list/FieldList'
import type { IconName } from '../../../src/csuite/icons/IconName'
import type { CushySDXLSchema } from './_cushySDXLSchema'

export const _cushySDXLLayout: App<CushySDXLSchema>['layout'] = (field, set) => {
   set('$.customSave.subfolder', { OnLeft: <>👉</> })

   // const ui = { field, set }
   // const xxx = field.Latent
   // const model = field.Model
   // const latent = field.Latent

   // set(field, {
   //    Body: (layout) => {
   //       return (
   //          <div tw='bg-red-500 flex flex-row '>
   //             <field.fields.positive.UI />
   //             <field.fields.negative.UI />
   //          </div>
   //       )
   //    },
   // })
   // set<Field_list<Z.Group<{ enabled: Z.Bool; name: Z.String; prompt: Z.Prompt }>>>('@list..@prompt^^', {
   //    Header: false,
   //    Body: observer((p) => {
   //       const promptGroup = p.field.parent?.value as Field_group<any>['value'] // 🔴 convert that to pub/sub
   //       // 💬 2025-03-16 rvion: we can't allow to have those `any` anymore !
   //       const activePrompt = p.field.items[promptGroup.activeIndex]
   //       return (
   //          <>
   //             <uy.list.BlenderLike<typeof p.field> //
   //                activeIndex={promptGroup.activeIndex}
   //                field={p.field}
   //                renderItem={(item, index) => {
   //                   const conditioningIcon: IconName =
   //                      index == 0 ? IKONS.mdiArrowDown : IKONS.mdiFormatListGroupPlus
   //                   return (
   //                      <uy.misc.Frame
   //                         tw='flex items-center'
   //                         hover
   //                         key={item._uid}
   //                         onMouseDown={() => (promptGroup.activeIndex = index)}
   //                      >
   //                         <span
   //                            tw={[
   //                               'line-clamp-1 w-full flex-grow px-1',
   //                               !item.fields.enabled.value && 'opacity-50',
   //                            ]}
   //                         >
   //                            {item.fields.name.value == ''
   //                               ? item.fields.prompt.text
   //                               : item.fields.name.value}
   //                         </span>
   //                         <div tw='flex-none'>
   //                            <uy.IkonOf name={conditioningIcon} />
   //                         </div>
   //                         <div tw='w-2' />
   //                         <div tw='flex-none'>
   //                            {/* <InputNumberUI
   //                            // TODO(bird_d/ui/logic): Implement showing strength based on the conditioning type, should only appear on blend/add/etc. concate doesn't need it for example.
   //                            mode='float'
   //                            hideSlider
   //                            onValueChange={() => {}}
   //                            value={ree}
   //                         /> */}
   //                            <uy.misc.Checkbox
   //                               square // TODO(bird_d/ui): Buttons like this, where there's only an icon, should just automatically apply square if there's no text/children.
   //                               toggleGroup='prompt'
   //                               value={item.fields.enabled.value}
   //                               onValueChange={(v) => (item.fields.enabled.value = v)}
   //                               tooltip='Whether or not the prompt effects the generation'
   //                            />
   //                         </div>
   //                      </uy.misc.Frame>
   //                   )
   //                }}
   //             />
   //             <uy.misc.Button
   //                hover
   //                tw='w-full !content-start !items-center !justify-start !border-none !bg-transparent py-[15px] pl-3.5 text-center'
   //                icon={promptGroup.showEditor ? IKONS.mdiChevronDown : IKONS.mdiChevronRight}
   //                onMouseDown={(e) => {
   //                   if (e.button != 0) {
   //                      return
   //                   }
   //                   promptGroup.showEditor = !promptGroup.showEditor
   //                }}
   //             >
   //                Editor
   //             </uy.misc.Button>

   //             {promptGroup.showEditor && (
   //                <uy.misc.Frame tw='gap-2 ' col>
   //                   {activePrompt ? (
   //                      <>
   //                         <uy.string.input field={activePrompt.fields.name} />
   //                         <uy.inputs.InputBoolUI
   //                            toggleGroup='y802w34ty80we4th80er0erh8008'
   //                            value={activePrompt.fields.enabled.value}
   //                            onValueChange={(v) => (activePrompt.fields.enabled.value = v)}
   //                            widgetLabel='Prompt Enabled'
   //                            text='Prompt Enabled'
   //                            // Tooltip needs to be gathered from the field
   //                            tooltip='Whether or not the prompt effects the generation'
   //                            // display='button'
   //                            expand
   //                         />
   //                         <uy.misc.ResizableFrame tw='!bg-transparent'>
   //                            <uy.group.Default tw='flex-1' field={activePrompt} />
   //                         </uy.misc.ResizableFrame>
   //                      </>
   //                   ) : (
   //                      <>No prompt</>
   //                   )}
   //                </uy.misc.Frame>
   //             )}
   //          </>
   //       )
   //    }),
   // })
   // // already handled by its parent
   // set(field.positive.prompts, { collapsible: false, Head: false, Header: false })
   // set(field.negative.prompts, { collapsible: false, Head: false, Header: false })

   // set('', (ui2) => {
   //    if (ui2.field.parent?.parent === field.positive.prompts) return { Head: false }
   //    if (ui2.field.parent?.parent === field.negative.prompts) return { Head: false }
   //    // No longer needed as not using optional, opting for the enabled field. It didn't even work anyways.
   //    // if (ui2.field.parent === field.Positive.Prompts) ui2.set({ Shell: ShellOptionalEnabledUI })
   // })

   // // set(latent.bField, { Shell: uy.shell.Right })
   // // set(field.Latent..bField.fields.emptyLatent && latent.bField.fields.emptyLatent.fields.batchSize, {
   // //    Head: false,
   // //    Header: false,
   // // })
   // // set(latent, { Shell: uy.shell.Left })
   // set('', (ui2) => {
   //    // ui2.for()
   //    // const isTopLevelGroup = ui2.field.depth === 1 && true //
   //    if (
   //       ui2.field.path.startsWith(latent.path + '.') &&
   //       ui2.field.type !== 'shared' &&
   //       ui2.field.type !== 'optional'
   //    ) {
   //       return { Shell: uy.shell.Right }
   //    }

   //    if (ui2.field.path.startsWith(model.path + '.')) return { Shell: uy.shell.Right }

   //    let should = ui2.field.path.startsWith(field.Sampler.path + '.')
   //    should = ui2.field.depth >= 2
   //    if (should) {
   //       if (ui2.field.isOfType('group', 'list', 'choices')) return { Title: uy.Title.h4 }
   //       if (!ui2.field.isOfType('optional', 'list', 'shared')) return { Shell: uy.shell.Right }
   //    }
   // })
}
