import { observer } from 'mobx-react-lite'

import { UI } from '../../csuite/components/UI'
import { Frame, type FrameProps } from '../../csuite/frame/Frame'

// this showcase the magical wonder of csuite custom JSX
// it may takes a while to understand how truely magical this is,
// but pay attention to the html result.
export const PlaygroundJSX = observer(function PlaygroundGraphUI_(p: {}) {
   return (
      <UI.Panel tw='p-2' base='#191010'>
         <FooUI />
      </UI.Panel>
   )
})

// `Foo` wrap `Bar` and add contrast
export const FooUI = observer(function Foo(p: FrameProps) {
   return <BarUI base={10} tw='p-8' {...p} /> // Foo only render a Bar;
})

// `Bar` wrap `Baz` and add "coucou" content
export const BarUI = observer(function Bar(p: FrameProps) {
   return <BazUI {...p}>coucou</BazUI>
})

// Baz wraps a frame and add a border
export const BazUI = observer(function Baz(p: FrameProps) {
   return <Frame border {...p} />
})
