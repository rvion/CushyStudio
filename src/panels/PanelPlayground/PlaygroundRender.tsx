import type { RenderRule } from '../../csuite-cushy/presenters/RenderRule'
import type { Field } from '../../csuite/model/Field'
import type { NO_PROPS } from '../../csuite/types/NO_PROPS'

import { usePanel } from '../../router/usePanel'

export const PlaygroundRenderUI = obs(function PlaygroundRender(p: NO_PROPS) {
   const external = usePanel().usePersistentModel('test', (b) =>
      b.fields({
         title: b.string(),
         b: b.int(),
      }),
   )
   const x = usePanel().usePersistentModel('foobar', (b) =>
      b.fields({
         aaa: b.choices({
            foo: b.fields({ x: b.string(), y: b.string() }),
            bar: b.fields({ x: b.string(), y: b.string() }),
            baz: b.string(),
         }),
         external: b.linkedFromExternalField(external),
         bbb: b.fields({
            title: b.string(),
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
               ['@number', { OnLeft: '👉', OnRight: '👈' }],
               ['{title|name}@str', { Decoration: uy.wrappers.ColoredPadding.with({ bgcolor: 'red' }) }],
               ['@list:has(.@group.{title|name}@str)', {}],
               ['{sub1|sub2}', { Shell: false }],
            ]}
         />
         <div className='flex flex-wrap gap-1 mt-1'>
            <x.sub1.UI //
               rules={[rule([x.sub1.y, { config: { max: 30, min: 0 } }])]}
               classNameForShell='grow'
            />
            <x.sub2.UI
               classNameForShell='grow'
               Decoration={uy.wrappers.ColoredPadding.with({ bgcolor: '#126e2d4d' })}
            />
         </div>
      </div>
   )
})

// [x.Aaa!, { Header: uy.choices.TabBar }],
// [x.Aaa._.foo!, { Decoration: uy.wrappers.ColoredPadding.with({ bgcolor: '#ba2c2c4d' }) }],
// [
//    x.Aaa._.bar!,
//    { Decoration: (f) => <uy.wrappers.ColoredPadding {...f} bgcolor='#2c4dba4d' /> },
// ],
// rule<Z.FList<Z.Record<{ name: Z.String }> | Z.Record<{ title: Z.String }>>>([
//    '@list:has(.@group.{{name|title}@string})',
//    { Header: (f) => <>{f.field}</> },
// ]),
// rule<Z.FMaybe<Z.String>>(['@optional.=(this.size > 3)@str^^^^<', {}]),
// [x.Aaa._.foo!, { Decoration: (f) => <uy.wrappers.ColoredPadding {...f} bgcolor='red' /> }],
// [x.Aaa._.foo!, { Decoration: { ColoredPadding: { bgcolor: 'red' } } }],
// [x.Aaa._.foo!, { Decoration: uy.wrappers.ColoredPadding.with({ bgcolor: 'red' }) }],
// rule([x.Aaa._.baz!, { OnRight: uy.group.DefaultBody }]),
// rule<Z.FString>(['@str', { OnTop: uy.number.input }]),
// [x.Aaa._.foo!, { Decoration: <uy.wrappers.ColoredPadding /> }],
// ['.@group', { Body: uy.group.inline }],
// ['{description|title}@str', { Header: uy.string.textarea }],
// rule<Z.FString>(['{description|title}@str', { Header: uy.string.textarea }]),
// rule<Z.FString>(['@str', { Header: 'markdown' }]),
// rule<Z.FString>(['@str', { OnTop: uy.string.markdown }]),
// [x.Sub1, { Shell: null }],
// [[x.Sub1, x.Sub2], { Shell: null }],
// ['{sub1|sub2}', { Shell: null }],
// [
//    '@number',
//    { OnTop: <div tw='text-center'>👇</div>, OnBottom: <div tw='text-center'>👆</div> },
// ],
// ['$', { Head: false }],
// [x.Aaa, { Header: uy.choices.Buttons }],
// rule([x.Sub1.Y, { config: { max: 30 } }]),
// [x.Sub2.X, { Header: uy.string.textarea }],
// ['@choices.@group', { Head: false }],
