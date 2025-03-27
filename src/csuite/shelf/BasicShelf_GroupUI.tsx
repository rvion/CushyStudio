import type { Tint } from '../kolor/Tint'
import type { ReactNode } from 'react'

import { Frame } from '../frame/Frame'

export const BasicShelf_GroupUI: React.FC<{ align?: boolean; children?: ReactNode } & Tint> = obs(
   function BasicShelf_Group({ align, children, ...tint }) {
      const theme = cushy.preferences.theme.zValue

      return (
         <Frame
            col
            base={tint}
            border={theme.global.border}
            roundness={theme.global.roundness}
            dropShadow={theme.global.shadow}
            align={align ?? true}
         >
            {children}
         </Frame>
      )
   },
)
