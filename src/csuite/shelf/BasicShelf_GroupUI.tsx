import type { Tint } from '../kolor/Tint'
import type { ReactNode } from 'react'

import { observer } from 'mobx-react-lite'

import { useCSuite } from '../ctx/useCSuite'
import { Frame } from '../frame/Frame'

export const BasicShelf_GroupUI: React.FC<{ align?: boolean; children?: ReactNode } & Tint> = observer(
   function BasicShelf_Group({ align, children, ...tint }) {
      const theme = cushy.theme.value

      return (
         <Frame
            col
            base={tint}
            border={theme.inputBorder}
            roundness={theme.inputRoundness}
            dropShadow={theme.inputShadow}
            align={align ?? true}
         >
            {children}
         </Frame>
      )
   },
)
