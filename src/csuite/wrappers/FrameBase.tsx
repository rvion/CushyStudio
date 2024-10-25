import type { BoxUIProps } from '../box/BoxUIProps'

import { observer } from 'mobx-react-lite'

import { Frame } from '../frame/Frame'

export const FrameBase = observer(function BoxTitleUI_({ children, ...rest }: BoxUIProps) {
   return (
      <Frame {...rest} base={{ contrast: 0.05 }}>
         {children}
      </Frame>
   )
})
