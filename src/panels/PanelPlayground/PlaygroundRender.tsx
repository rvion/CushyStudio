import type { RenderProps, StandardProps } from '../../csuite-cushy/presenters/RenderProps'
import type { RenderRule, RenderRule_asList } from '../../csuite-cushy/presenters/RenderRule'
import type { Field } from '../../csuite/model/Field'
import type { NO_PROPS } from '../../csuite/types/NO_PROPS'
import type React from 'react'

import { observer } from 'mobx-react-lite'

import { usePanel } from '../../router/usePanel'

export const PlaygroundRenderUI = observer(function PlaygroundRender(p: NO_PROPS) {
   const x = usePanel().usePersistentModel('foobar', (b) =>
      b.fields({
         aaa: b.choice({
            foo: b.fields({ x: b.string(), y: b.string() }),
            bar: b.fields({ x: b.string(), y: b.string() }),
         }),
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
   function r<T extends Field>(...rule: RenderRule_asList<T>): RenderRule<T> { return rule } // prettier-ignore
   return (
      <div>
         <x.UI
            rules={[
               ['.{sub1|sub2}', { Shell: null }],
               ['@number', { OnLeft: <>👉</>, OnRight: <>👈</> }],
               ['$', { Head: false }],
               [x.Aaa, { Header: UY.choices.Buttons }],
               rule([x.Sub1.Y, { config: { max: 30 } }]),
               [x.Sub2.X, { Header: UY.string.textarea }],
               ['@choices.@group', { Head: false }],
            ]}
         />
         <div className='flex gap-1 mt-1'>
            <x.Sub1.UI //
               rules={[rule([x.Sub1.Y, { config: { max: 30, min: 0 } }])]}
               classNameForShell='grow'
            />
            <x.Sub2.UI classNameForShell='grow' Decoration={Pinkmargin} />
         </div>
         <x.Sub2.UI classNameForShell='grow' Decoration={(f) => <Pinkmargin {...f} bgcolor='blue' />} />
         {/* todo: support final syntax below */}
         {/* <x.Sub2.UI classNameForShell='grow' Decoration={{ Pinkmargin: { bgColor: 'red' } }} /> */}
      </div>
   )
})

export const Pinkmargin = observer(function card3dspinningUI_({
   children,
   bgcolor,
   ...rest
}: {
   children?: React.ReactNode
   bgcolor?: string
} & StandardProps['Decoration']) {
   return (
      <div style={{ backgroundColor: bgcolor }} tw='bg-pink-800 p-4 rounded-lg shadow-lg' {...rest}>
         <div style={{ boxShadow: '0px 0px 20px 0px black' }}>{children}</div>
      </div>
   )
})
