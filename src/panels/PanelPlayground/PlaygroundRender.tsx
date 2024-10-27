import type { DisplayRuleCtx } from '../../csuite-cushy/presenters/Renderer'
import type { NO_PROPS } from '../../csuite/types/NO_PROPS'

import { observer } from 'mobx-react-lite'

import { ui_regionalPrompting_v1 } from '../../../library/built-in/_prefabs/prefab_regionalPrompting_v1'
import { WidgetListExt_LineUI } from '../../csuite/fields/board/WidgetListExt_LineUI'
import { WidgetListExtUI__Regional } from '../../csuite/fields/board/WidgetListExtUI'
// import { WidgetListExtUI__Regional } from '../../csuite/fields/board/WidgetListExtUI'
// import { ui_regionalPrompting_v1 } from '../../../library/built-in/_prefabs/prefab_regionalPrompting_v1'
import { isFieldChoice, isFieldGroup, isFieldNumber } from '../../csuite/fields/WidgetUI.DI'
import { usePanel } from '../../router/usePanel'

export const PlaygroundRenderUI = observer(function PlaygroundRender(p: NO_PROPS) {
   const x = usePanel().usePersistentModel('foobar', (b) =>
      b.fields({
         // xxxx: b.prompt({ default: 'hello world' }),
         ax: ui_regionalPrompting_v1(b),
         aaa: b.choice({
            foo: b.fields({ x: b.string(), y: b.string() }),
            bar: b.fields({ x: b.string(), y: b.string() }),
         }),
         a0: b.prompt(),
         x: b.string(),
         y: b.int(),
         z: b.percent(),
         sub1: b.fields({ x: b.string(), y: b.int(), z: b.percent() }),
         sub2: b.fields({ x: b.string(), y: b.int(), z: b.percent() }),
      }),
   )
   return (
      <div>
         <x.Ax.UI //
            Header={WidgetListExt_LineUI}
            Body={WidgetListExtUI__Regional}
         />
         <x.UI
            // Shell=''
            // layout={({ fields: f }) => [f.x, f.x, f.x, f.x, '*']}
            rule={(ui) => {
               // ui.for(ui.field.Aaa, { Shell: ui.catalog.Shell.Card })
               ui.for(ui.field.Z, { Header: 'hello guys' })
               ui.for(ui.field.Y, { Title: null })
               ui.for(ui.field.Sub1.Z, { Header: 'hope you guys good' })
               ui.for(ui.field.Sub1, { layout: (f) => [f.X, f.Y, f.Y, '*'], Header: 'hope you guys good' })
               ui.forAllFields((ui: DisplayRuleCtx) => {
                  if (isFieldGroup(ui.field) && isFieldChoice(ui.field.parent)) return { Head: false }
               })
               ui.forAllFields(({ field, for: apply, catalog }) => {
                  // apply(field, {
                  //     Shell: catalog.ShellMobile,
                  //     Indent: (f) => f.depth + '>>',
                  // })
                  if (isFieldNumber(field)) return { Header: <>🟢{<catalog.number.def field={field} />}</> }
               })
               // return { Body: 'hello' }
            }}
         />
      </div>
   )
})
