import type { BoxUIProps } from '../box/BoxUIProps'

import { Frame } from '../frame/Frame'

export const FrameTitle = obs(function BoxTitleUI_({ children, ...rest }: BoxUIProps<HTMLDivElement>) {
   return (
      <Frame {...rest} text={{ contrast: 1, chromaBlend: 100, hueShift: 0 }}>
         {children}
      </Frame>
   )
})
