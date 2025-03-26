import type { StandardProps } from '../../presenters/RenderProps'
import type React from 'react'

import { observer2 } from '../../../csuite/mobx/observer2'

export const ColoredMarginUI = observer2(function ColoredMarginUI_({
   children,
   bgcolor,
   padding,
   ...rest
}: {
   padding?: string
   children?: React.ReactNode
   bgcolor?: string
} & StandardProps['wrappers']) {
   return (
      <div
         style={{
            backgroundColor: bgcolor ?? '#d8a0a6',
            padding: padding ?? '1rem',
         }}
         tw='rounded-lg shadow-lg'
         {...rest}
      >
         <div style={{ boxShadow: '0px 0px 20px 0px black' }}>{children}</div>
      </div>
   )
})
