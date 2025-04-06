import type { IconName } from '../../../../../src/csuite/icons/IconName'
import type { $WeaverPromptList } from './WeaverPrompting'

import { StackCardUI, type StackData } from '../prefab_Stack'

export const StackPromptingUI = obs(function StackPromptingUI_(p: {
   field: $WeaverPromptList['{field}']
   datafield: StackData['{field}']
   stackField: Z.List<StackData>['{field}']
   stackIndex: number
}) {
   const activePrompt = p.field.prompts.items[p.field.activeIndex.zValue]
   const index = p.stackIndex
   const prompts = p.field
   const theme = cushy.preferences.theme.zValue

   const [isDropZoneHovered, dropRef] = uy.dnd.useDropZone({
      config: { shallow: true },
      Image: {
         onDrop: (item, monitor) => {
            const workflow = item.workflow
            if (!workflow) {
               return
            }

            const textArray: { name: string; text: string }[] = []
            workflow.nodes.forEach((node, index) => {
               if (node.inputs) {
                  Array.from(node.$schema.inputs).forEach((item) => {
                     if (item.typeName == 'STRING') {
                        textArray.push({
                           name: item.slotName,
                           text: node.inputs[item.nameInComfy],
                        })
                     }
                  })
               }
            })

            if (textArray.length > 0) {
               cushy.activityManager.start({
                  stopOnBackdropClick: true,
                  UI: (p) => (
                     <uy.misc.PopUp title='Add prompt from Image'>
                        {textArray.map((item) => {
                           return (
                              <uy.misc.Frame
                                 tw='max-w-[500px] !border-none line-clamp-1 p-1 px-2'
                                 hover
                                 onClick={() => {
                                    const prompt = prompts.prompts.addItem()
                                    if (!prompt) {
                                       console.warn('Unable to add prompt')
                                       return
                                    }
                                    prompt.prompt.text = item.text

                                    p.stop()
                                 }}
                                 //TODO(bird_d/ui/tooltip): Uncomment when tooltips are fixed
                                 // tooltip={
                                 //    <div tw='!w-[500px]'>
                                 //       <p>{item.name}</p>
                                 //       ------------------
                                 //       <p tw='whitespace-break-spaces'>{item.text}</p>
                                 //    </div>
                                 // }
                              >
                                 <p tw='flex flex-row gap-1'>
                                    <p tw='line-clamp-3 w-full'>{item.text}</p>
                                    <p tw='opacity-50'>{item.name}</p>
                                 </p>
                              </uy.misc.Frame>
                           )
                        })}
                     </uy.misc.PopUp>
                  ),
               })
            }
         },
         onHover: (item, monitor) => {
            cushy.dndHandler.setContent({
               icon: IKONS.mdiImage,
               label: 'Insert Prompt from image',
               suffixIcon: IKONS.mdiPencilPlus,
            })
         },
      },
   })

   return (
      <StackCardUI
         isDnDHovered={isDropZoneHovered}
         key={index}
         field={p.datafield}
         stackField={p.stackField}
         stackIndex={index}
         icon={p.field.zIcon ?? undefined}
      >
         <div ref={dropRef} tw='py-1'>
            <uy.list.BlenderLike<typeof prompts.prompts> //
               activeIndex={prompts.activeIndex._}
               field={prompts.prompts}
               renderItem={(item, index) => {
                  const conditioningIcon: IconName =
                     index == 0 ? IKONS.mdiArrowDown : IKONS.mdiFormatListGroupPlus
                  const hasPrompt = item.prompt.text != ''
                  const active = prompts.zValue.activeIndex == index
                  const positive = item.zValue.positive
                  return (
                     <uy.misc.Frame
                        roundness={theme.global.roundness}
                        tw={['flex items-center overflow-clip', !hasPrompt && 'opacity-50']}
                        hover
                        key={item.zUid}
                        onMouseDown={() => (prompts.activeIndex._ = index)}
                        base={positive ? {} : { chroma: 0.1, hue: 0 }}
                        border={positive ? {} : active ? { contrast: 0.1, chromaBlend: 10, hue: 0 } : {}}
                        style={{
                           borderStyle: positive ? 'solid' : 'dashed',
                        }}
                     >
                        <uy.inputs.BoolUI
                           tw='!border-none !bg-transparent'
                           square
                           display={'button'}
                           toggleGroup='h8024gt024gh24gbu024gb0'
                           // TODO(bird_d/ui/theme/fix): contrast here needs to be take from text, but the run_tint stuff can't be used in apps
                           //    text={{ contrast: 0.5, hue: 90 }}
                           icon={positive ? IKONS.mdiPlus : IKONS.mdiMinus}
                           value={positive}
                           onValueChange={() => {
                              item.positive._ = !positive
                           }}
                           onMouseDown={(ev) => {
                              ev.stopPropagation()
                              ev.preventDefault()
                           }}
                        />
                        <span
                           tw={[
                              'line-clamp-1 w-full flex-grow px-1',
                              !item.enabled._ && hasPrompt && 'opacity-50',
                           ]}
                        >
                           {item.name._ == '' ? (hasPrompt ? item.prompt.text : 'Empty Prompt') : item.name._}
                        </span>
                        <div tw='flex-none'>
                           <uy.icons.Of name={conditioningIcon} />
                        </div>
                        <div tw='w-2' />
                        <div tw='flex-none'>
                           {hasPrompt ? (
                              <uy.misc.Checkbox
                                 square
                                 // disabled={!hasPrompt}
                                 toggleGroup='prompt'
                                 value={item.enabled._}
                                 onValueChange={(v) => (item.enabled._ = v)}
                                 tooltip={'Whether or not the prompt effects the generation'}
                              />
                           ) : (
                              <uy.misc.Frame
                                 // base={{ hue: 0, chromaBlend: 10 }}
                                 text={{ contrast: 0.5, hue: 90, chromaBlend: 10 }}
                                 icon={IKONS.mdiAlert}
                                 size='input'
                                 square
                                 tooltip='This entry will have no effect because the prompt is empty'
                              />
                           )}
                        </div>
                     </uy.misc.Frame>
                  )
               }}
            />
         </div>

         <uy.misc.Button
            hover
            tw='w-full !content-start !items-center !justify-start !border-none !bg-transparent py-[15px] pl-3.5 text-center'
            icon={p.field.showEditor._ ? IKONS.mdiChevronDown : IKONS.mdiChevronRight}
            onMouseDown={(e) => {
               if (e.button != 0) return
               p.field.showEditor.toggle()
            }}
         >
            Editor
         </uy.misc.Button>

         {p.field.showEditor.zValue && (
            <uy.misc.Frame tw='gap-2 ' col>
               {activePrompt ? (
                  <>
                     <uy.string.input field={activePrompt.name} />

                     <uy.inputs.BoolUI
                        toggleGroup='y802w34ty80we4th80er0erh8008'
                        value={activePrompt.zValue.enabled}
                        onValueChange={(v) => (activePrompt.zValue.enabled = v)}
                        widgetLabel='Prompt Enabled'
                        text='Prompt Enabled'
                        // Tooltip needs to be gathered from the field
                        tooltip='Whether or not the prompt effects the generation'
                        // display='button'
                        expand
                     />
                     <uy.misc.ResizableFrame tw='!bg-transparent'>
                        <uy.group.DefaultBody tw='flex-1' field={activePrompt} />
                     </uy.misc.ResizableFrame>
                  </>
               ) : (
                  <>No prompt</>
               )}
            </uy.misc.Frame>
         )}
      </StackCardUI>
   )
})
