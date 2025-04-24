import type { RuntimeErrorL } from '../models/RuntimeError'
import type { StepL } from '../models/Step'

import { LegacySurfaceUI } from '../csuite/inputs/LegacySurfaceUI'
import { JsonViewUI } from '../csuite/json/JsonViewUI'

// TODO(bird_d/type_safety): This makes assumptions, might show undefined?
export const OutputRuntimeErrorPreviewUI = obs(function OutputRuntimeErrorPreviewUI_(p: {
   step?: Maybe<StepL>
   output: RuntimeErrorL
}) {
   return (
      <uy.misc.Frame
         tw='h-full w-full'
         text={{ contrast: 0.3, hue: 20, chromaBlend: 7.5 }}
         icon={IKONS.mdiAlert}
         iconSize='80%'
         square
      />
   )
})

export const OutputRuntimeErrorUI = obs(function OutputRuntimeErrorUI_(p: {
   step?: Maybe<StepL>
   output: RuntimeErrorL
}) {
   const output = p.output
   const msg = output.data

   const details =
      msg.infos['customFields'] != undefined ? JSON.parse(msg.infos['customFields']['details']) : null

   let err

   if (details) {
      const comfyError = details['error']
      const nodeErrors = details['node_errors']

      err = (
         <uy.misc.Frame>
            {comfyError && (
               <uy.layout.Box tw='p-2 gap-1' base={{ contrast: -0.05, hue: 0 }}>
                  {comfyError['message']}
                  <uy.menu.Divider />
                  {nodeErrors &&
                     Object.keys(nodeErrors).map((item) => {
                        // return <>{nodeErrors[item]}</>
                        const info = nodeErrors[item]
                        const infoErrors = info['errors']
                        return (
                           <uy.layout.Box base={{ contrast: 0.1 }} tw='p-2' border={false}>
                              <div tw='opacity-75'>
                                 [{item}] - {info['class_type']}
                              </div>
                              {infoErrors &&
                                 infoErrors.map(
                                    (e: { type?: string; message?: string; details?: string }) => {
                                       return (
                                          <div>
                                             {e['details']}: {e['message']}
                                          </div>
                                       )
                                    },
                                 )}
                              {/* {<JsonViewUI value={JSON.parse(JSON.stringify(nodeErrors[item]))} />} */}
                           </uy.layout.Box>
                        )
                     })}
               </uy.layout.Box>
            )}

            {/* <JsonViewUI value={details} /> */}
         </uy.misc.Frame>
      )
   }

   return (
      <uy.layout.Col tw='h-full gap-2 p-2'>
         <div>{msg.message}</div>
         {err ? err : <>Error could not be displayed</>}
         <div>
            <div>Error JSON</div>
            <JsonViewUI value={JSON.parse(JSON.stringify(msg.infos))} />
         </div>
      </uy.layout.Col>
   )
})
