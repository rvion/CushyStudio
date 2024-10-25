// import type { FC } from 'react'

import { observer } from 'mobx-react-lite'

import { Frame } from '../../csuite/frame/Frame'

export const PlaygroundSkinsUI = observer(function PlaygroundSkinsUI_(p: {}) {
   const xx = cushy.forms.useLocalstorage('SCm5xmdc', (ui) =>
      ui.fields({
         a: ui.string(),
         b: ui.string(),
         arr: ui
            .fields({
               x: ui.int(),
               y: ui.int(),
            })
            .list({ min: 3 }),
         x: ui.choice({
            a: ui.string(),
            b: ui.int(),
         }),
      }),
   )
   return (
      <Frame row expand tw='gap-2'>
         <Frame row expand tw='gap-2'>
            <Frame expand col tw='gap-2'>
               <Frame border base expand>
                  default (full)
                  {xx.UI()}
               </Frame>
            </Frame>
            <Frame border base expand>
               {xx.render({})}
               {/* {xx.render(({ fields: f }) => [`# hello\n\nI love the 'a' field`, f.a, f.a, f.a])} */}
               {/* {xx.render((f) => ['a', 'b', 'b', 'b'])} */}
            </Frame>
            <Frame border base expand>
               {/* {xx.render(['a', 'b', (f): Maybe<FC<any>> => f.Arr.at(1)?.renderFieldsSubset(['x', 'x'])])} */}
            </Frame>
         </Frame>
      </Frame>
   )
})
