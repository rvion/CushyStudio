import type { AppUI } from '../../../src/cards/App'
import type { $CushyWeaverUI } from './_WeaverSchema'

import { StackLatentUI } from './_prefabs/latent/WeaverLatentUI'
import { type $WeaverPromptList } from './_prefabs/prompting/WeaverPrompting'
import { StackPromptingUI } from './_prefabs/prompting/WeaverPromptingUI'

export const _cushyWeaverLayout: AppUI<$CushyWeaverUI['{field}']> = (_, set) => {
   set({
      Shell: (p) => {
         const d = p.field
         return (
            <div tw='flex flex-1 flex-grow flex-col gap-1 overflow-auto'>
               <uy.misc.Frame row line align>
                  <uy.misc.Button
                     icon={IKONS.mdiPlus}
                     expand
                     base={{ contrast: 0.1 }}
                     onClick={(ev) => {
                        const con = p.field.stack
                           .addItem({
                              value: {
                                 name: `Prompting ${
                                    d.stack.items.filter((f) => f.zValue.data?.prompting).length
                                 }`,
                                 data: {},
                              },
                           })
                           ?.data.child.enableBranch('prompting')
                        if (!con) {
                           return
                        }
                        const prompt = con.prompts.firstOrNull
                        if (prompt == null) return

                        prompt.prompt.text = 'masterpiece'
                     }}
                     row
                  >
                     Prompting
                  </uy.misc.Button>
                  <uy.misc.Button
                     icon={IKONS.mdiPlus}
                     expand
                     base={{ contrast: 0.1 }}
                     onClick={(ev) => {
                        const latent = p.field.stack
                           .addItem({
                              value: {
                                 name: `Latent ${
                                    d.stack.items.filter((f) => {
                                       return f.zValue.data?.prompting
                                    }).length
                                 }`,
                                 data: {},
                              },
                           })
                           ?.data.child.enableBranch('latent')
                        if (!latent) {
                           return
                        }
                     }}
                     row
                  >
                     Latent
                  </uy.misc.Button>
               </uy.misc.Frame>
               <div tw='flex flex-col gap-1'>
                  {d.stack.items.map((field, index) => {
                     return field.data.child.matchExhaustive({
                        prompting: (value: $WeaverPromptList['{field}']) => {
                           return (
                              <StackPromptingUI
                                 //
                                 stackField={d.stack}
                                 field={value}
                                 stackIndex={index}
                                 datafield={field}
                              />
                           )
                        },
                        latent: (value) => {
                           return (
                              <StackLatentUI
                                 dataField={field}
                                 stackField={d.stack}
                                 field={value}
                                 stackIndex={index}
                              />
                           )
                        },
                     })
                  })}
               </div>
            </div>
         )
      },
   })
}
