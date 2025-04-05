import type { Field_bool } from '../../src/csuite/fields/bool/FieldBool'

import { action, computed } from 'mobx'

class MyField extends cushy.field.bool {
   '{ownConfig}': Field_bool['{ownConfig}'] & { defaultMagicNumber1: number }
   '{ownSerial}': Field_bool['{ownSerial}'] & { magicNumber1: number }

   @computed get magicNumber1() {
      return this.zSerial.magicNumber1 ?? this.zConfig.defaultMagicNumber1
   }
   set magicNumber1(value: number) {
      this.zPatchInTransaction((draft) => {
         draft.magicNumber1 = value
      })
   }

   @action doStuff() {
      this.zPatchInTransaction((draft) => {
         draft.value = !draft.value
         draft.magicNumber1 = Math.round(100 * Math.random())
      })
   }
}

app({
   metadata: {
      name: 'Cushy Diffusion',
      illustration: 'library/built-in/_illustrations/mc.jpg',
      description: 'Custom Field Example ',
   },
   ui: (b) =>
      b.fields({
         test: b.custom(MyField, { defaultMagicNumber1: 8, uiui: { Header: MyComponent } }),
      }),
   run: async (run, ui, imgCtx) => {},
})

const MyComponent = obs((p: { field: MyField }) => {
   const field = p.field
   return (
      <div>
         <div tw='loading loading-spinner'></div>
         <uy.inputs.InputNumberUI //
            mode='int'
            value={field.magicNumber1}
            onValueChange={(next) => (field.magicNumber1 = next)}
         />
         <div>{field.magicNumber1 > 50 ? <div>Hi</div> : <div>Hello</div>}</div>
         <pre>serial: {JSON.stringify(field.zSerial)}</pre>
      </div>
   )
})
