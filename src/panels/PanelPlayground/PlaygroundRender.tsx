import type { RenderProps } from '../../csuite-cushy/presenters/RenderProps'
import type { RenderRule, RenderRule_asList } from '../../csuite-cushy/presenters/RenderRule'
import type { Field } from '../../csuite/model/Field'
import type { NO_PROPS } from '../../csuite/types/NO_PROPS'
import type React from 'react'

import { observer } from 'mobx-react-lite'

import { ColoredMarginUI } from '../../csuite-cushy/catalog/Decorations/ColoredMarginUI'
import { usePanel } from '../../router/usePanel'

export const PlaygroundRenderUI = observer(function PlaygroundRender(p: NO_PROPS) {
   const external = usePanel().usePersistentModel('test', (b) =>
      b.fields({
         title: b.string(),
         b: b.int(),
      }),
   )
   const x = usePanel().usePersistentModel('foobar', (b) =>
      b.fields({
         aaa: b.choice({
            foo: b.fields({ x: b.string(), y: b.string() }),
            bar: b.fields({ x: b.string(), y: b.string() }),
         }),
         external: b.linkedFromExternalField(external),
         bbb: b.fields({
            x: b.string(),
            y: b.int(),
            z: b.percent(),
         }),
         sub1: b.fields({ x: b.string(), y: b.int(), z: b.percent() }),
         sub2: b.fields({ x: b.string(), y: b.int(), z: b.percent() }),
      }),
   )
   function rule<T extends Field>(rule: RenderRule<T>): RenderRule<T> { return rule } // prettier-ignore
   // function r<T extends Field>(...rule: RenderRule_asList<T>): RenderRule<T> { return rule } // prettier-ignore
   return (
      <div>
         <x.UI
            rules={[
               rule<Z.FList<Z.Record<{ name: Z.String }> | Z.Record<{ title: Z.String }>>>([
                  '@list:has(.@group.{{name|title}@string})',
                  { Header: (f) => <>{f.field}</> },
               ]),
               // rule<Z.FMaybe<Z.String>>(['@optional.=(this.size > 3)@str^^^^<', {}]),
               [x.Aaa._.foo!, { Decoration: (f) => <UY.wrappers.ColoredPadding {...f} bgcolor='red' /> }],
               // [x.Aaa._.foo!, { Decoration: ['ColoredPadding', { bgcolor: 'red' }] }],
               // ['.@group', { Body: UY.group.inline }],
               ['{description|title}@str', { Header: UY.string.textarea }],
               // [x.Sub1, { Shell: null }],
               // [[x.Sub1, x.Sub2], { Shell: null }],
               // ['{sub1|sub2}', { Shell: null }],
               [
                  '@number',
                  { OnLeft: <div tw='text-center'>👉</div>, OnRight: <div tw='text-center'>👈</div> },
               ],
               // [
               //    '@number',
               //    { OnTop: <div tw='text-center'>👇</div>, OnBottom: <div tw='text-center'>👆</div> },
               // ],
               // ['$', { Head: false }],
               // [x.Aaa, { Header: UY.choices.Buttons }],
               // rule([x.Sub1.Y, { config: { max: 30 } }]),
               // [x.Sub2.X, { Header: UY.string.textarea }],
               // ['@choices.@group', { Head: false }],
            ]}
         />
         <div className='flex gap-1 mt-1'>
            <x.Sub1.UI //
               rules={[rule([x.Sub1.Y, { config: { max: 30, min: 0 } }])]}
               classNameForShell='grow'
            />
            <x.Sub2.UI classNameForShell='grow' Decoration={ColoredMarginUI} />
         </div>
         <x.Sub2.UI classNameForShell='grow' Decoration={(f) => <ColoredMarginUI {...f} bgcolor='blue' />} />
         {/* <x.Sub1.UI classNameForShell='grow' Decoration={(f) => <ColoredMarginUI {...f} bgcolor='gray' />} /> */}
         {/* todo: support final syntax below */}
         {/* <x.Sub2.UI classNameForShell='grow' Decoration={{ Pinkmargin: { bgColor: 'red' } }} /> */}
      </div>
   )
})

// [
//    '$.bbb.y',
//    {
//       Shell: (f) => (
//          <div tw='bg-blue-900 m-2 animate-bounce'>
//             <f.field.UI />
//             {/* <f.field.UI Decoration='bounce' />
//             <f.field.UI Decoration={bounce: {timer:30}} />
//             <f.field.UI Decoration={['bounce', {timer:30}]} /> */}
//          </div>
//       ),
//    },
// ],
