import type { AnyFieldSerial } from '../../csuite/model/EntitySerial'

import { observable } from 'mobx'

import { Button } from '../../csuite/button/Button'
import { usePanelTemporaryData } from '../../router/usePanelTemporaryData'
import { registerCustomPanel } from '../PanelCustom/CustomPanels'

export const PlaygroundCustomPanelsUI = obs(function PlaygroundCustomPanelsUI_(p: {}) {
   return (
      <div tw='flex gap-1'>
         <Button
            onClick={() => cushy.layout.addCustom(HANDLE, { name: '@rvion' + Math.random() })}
            icon={IKONS.mdiAbTesting}
         >
            Open custom Panel
         </Button>
         <Button onClick={() => cushy.layout.addCustom(HANDLE, { name: '@rvion' })} icon={IKONS.mdiAbTesting}>
            Open custom Panel
         </Button>
         <hr />
         <Button onClick={() => new Promise((yes) => setTimeout(yes, 2000))}>test</Button>
      </div>
   )
})

const HANDLE = registerCustomPanel(
   'myCustomPanel',
   obs((p: { name: string }) => {
      const store = usePanelTemporaryData((): { data: Maybe<AnyFieldSerial> } =>
         observable({
            data: null,
         }),
      )
      console.log(`[🤠] store.data`, store.data)
      const form = cushy.forms.use(
         (ui) =>
            ui.fields({
               foo: ui.string(),
               bar: ui.int().list(),
            }),
         {
            name: 'myCustomPanel',
            serial: () => store.data,
            onSerialChange: (form) => {
               store.data = form.serial
            },
         },
      )
      return (
         <div>
            🟢{p.name}
            {form.UI()}
         </div>
      )
   }),
)
