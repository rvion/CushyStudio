import type { BoxUIProps } from '../box/BoxUIProps'

import { Frame } from '../frame/Frame'

export const FrameBase = obs(function BoxTitleUI_({ children, base, ...rest }: BoxUIProps<HTMLDivElement>) {
   return (
      <Frame {...rest} base={base ?? { contrast: 0.05 }}>
         {children}
      </Frame>
   )
})
