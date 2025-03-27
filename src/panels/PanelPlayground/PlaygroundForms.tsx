import { simpleFactory } from '../../csuite'
import { ErrorBoundaryUI } from '../../csuite/errors/ErrorBoundaryUI'
import { Field_group } from '../../csuite/fields/group/FieldGroup'
import { Field_string } from '../../csuite/fields/string/FieldString'
import { Frame } from '../../csuite/frame/Frame'

/** Freely modify this as you like, then pick the "Scratch Pad" option in the top left. Do not commit changes made to this. */
export const PlaygroundForms = obs(function PlaygroundImportFromComfy_(p: {}) {
   const field = simpleFactory.use((b) => {
      const raw = b.fields({
         a: b.percent({ suffix: '% of banana' }),
         b: b.string({}).useClass(
            class extends Field_string {
               UIWithFancyBorder = (): React.JSX.Element => (
                  <Frame //
                     border={30}
                     tw='p-2'
                     children={this.UI({ Shell: uy.shell.HeaderOnly })}
                  />
               )
               UIWithSuperFancyBorder = (): React.JSX.Element => (
                  <Frame border={30} tw='p-8' children={<this.UI Shell={uy.shell.HeaderOnly} />} />
               )
               UIWithSuperFancyBorder2 = (p: { size: 'big' | 'small' }): React.JSX.Element => (
                  <Frame border={30} tw='p-8' children={<this.UI Shell={uy.shell.HeaderOnly} />} />
               )
            },
            null,
         ),
         d: b.fields({
            d1: b.string(),
            d2: b.string(),
         }),
      })
      return raw.useClass(
         class extends Field_group<(typeof raw)['ҨField']['ҨSubfields']> {
            v1 = (): React.JSX.Element => {
               const { a, b } = field.zFields
               return (
                  <ErrorBoundaryUI>
                     <h3>play with forms</h3>
                     <Frame border={20} tw='m-8'>
                        <Frame base={10}>
                           {field.zType}({field.zUid})
                        </Frame>
                        <Frame base={{ hueShift: 100 }}>
                           <div>
                              <b.UIWithFancyBorder />
                              <b.UIWithSuperFancyBorder />
                           </div>
                        </Frame>
                        <Frame base={{ hueShift: 200 }}>
                           {b.zType}({b.zUid})<div>{a.UI({ Shell: uy.shell.HeaderOnly })}</div>
                           <div>{b.UIWithFancyBorder()}</div>
                        </Frame>
                     </Frame>
                  </ErrorBoundaryUI>
               )
            }
         },
         null,
      )
   })
   return (
      <>
         {/*  */}
         {field.UI()}
         {field.v1()}
      </>
   )
})
