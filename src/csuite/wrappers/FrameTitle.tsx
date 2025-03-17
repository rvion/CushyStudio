import type { BoxUIProps } from '../box/BoxUIProps'

import { observer } from 'mobx-react-lite'

import { Frame } from '../frame/Frame'

export const FrameTitle = observer(function BoxTitleUI_({ children, ...rest }: BoxUIProps<HTMLDivElement>) {
   return (
      <Frame {...rest} text={{ contrast: 1, chromaBlend: 100, hueShift: 0 }}>
         {children}
      </Frame>
   )
})
