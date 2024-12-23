import type { WidgetPromptUISt } from '../../WidgetPromptUISt'

import { observer } from 'mobx-react-lite'

import { LoraBoxUI } from './LoraBoxUI'

// TODO: Once it is possible to get the modifier key's states, holding shift when pressing the trash button should not trim whitespace/commas

export const Plugin_LoraControlsUI = observer(function Plugin_LoraControlsUI_(p: {
   //
   uist: WidgetPromptUISt
}) {
   const uist = p.uist
   if (uist.loras.length === 0) return null
   return (
      <>
         {/* {uist.loras.length === 0 && <div tw='italic text-gray-500'>No loras in prompt</div>} */}
         <div tw='flex flex-col gap-1 p-1'>
            {uist.loras.map((loraASTNode, ix) => {
               const weighted = loraASTNode.firstAncestor('WeightedExpression')
               const isOnlyLora = weighted?.contentText == loraASTNode?.text

               return (
                  <LoraBoxUI //
                     key={`${loraASTNode.name}-${ix}`}
                     uist={uist}
                     loraASTNode={loraASTNode}
                     weightedASTNode={isOnlyLora ? weighted : null}
                     onDelete={() => {
                        let from = loraASTNode.from
                        // Delete surrounding "()*val" if exists and only contains the lora, otherwise remove only lora
                        if (weighted && isOnlyLora) {
                           weighted.remove()
                           from = weighted.from
                        } else {
                           loraASTNode.remove()
                        }

                        // Clean-up trailing white-space/commas
                        const text = uist.text.slice(from)
                        uist.editorView?.dispatch({
                           changes: {
                              //
                              from,
                              to: from + text.length - text.replace(/^[,\s]+/, '').length,
                              insert: '',
                           },
                        })
                     }}
                  />
               )
            })}
         </div>
      </>
   )
})
