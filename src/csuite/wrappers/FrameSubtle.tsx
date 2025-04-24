import type { BoxUIProps } from '../box/BoxUIProps'

import { Frame } from '../frame/Frame'

export const FrameSubtle = obs(function BoxSubtle_({ children, ...rest }: BoxUIProps<HTMLDivElement>) {
   return (
      <Frame {...rest} text={{ contrast: 0.3, chromaBlend: 1, hueShift: 0 }}>
         {children}
      </Frame>
   )
})
