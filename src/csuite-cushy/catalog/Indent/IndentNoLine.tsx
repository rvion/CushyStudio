import type { WidgetIndentProps } from './WidgetIndentUI'

import { observer } from 'mobx-react-lite'

import { Frame } from '../../../csuite/frame/Frame'

export const WidgetIndentNoLinesUI = observer(function WidgetIndentNoLinesUI_({
   // own props
   depth,

   // modified
   style,

   // rest
   ...rest
}: WidgetIndentProps) {
   // no indent line for depth < 1
   if (depth <= 1) return null

   // TODO: better values here
   return (
      <Frame
         tw='UI-WidgetIndent'
         style={{
            display: 'flex',
            alignSelf: 'stretch',
            flexShrink: 0,
            ...style,
         }}
         {...rest}
      >
         {new Array(depth - 1).fill(0).map((_, i) => (
            <div
               key={i}
               className='UI-WidgetIndent'
               style={{
                  // borderRight: '1px solid oklch(from var(--KLR) calc(l + 0.1 * var(--DIR)) c h)', // 🚂 we disabled this border
                  width: `${0.7}rem`,
                  flexShrink: 0,
                  alignSelf: 'stretch',
                  // marginRight: '.2rem',
               }}
            />
         ))}
      </Frame>
   )
})
