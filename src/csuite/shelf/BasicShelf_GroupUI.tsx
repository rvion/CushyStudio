import type { Tint } from '../kolor/Tint'
import type { ReactNode } from 'react'

import { observer } from 'mobx-react-lite'

import { useCSuite } from '../ctx/useCSuite'
import { Frame } from '../frame/Frame'

export const BasicShelf_GroupUI: React.FC<{ align?: boolean; children?: ReactNode } & Tint> = observer(
   function BasicShelf_Group({ align, children, ...tint }) {
      const csuite = useCSuite()
      const dropShadow = cushy.theme.value.inputShadow

      return (
         <Frame
            col
            base={tint}
            border
            roundness={csuite.inputRoundness}
            dropShadow={dropShadow}
            tw={[
               // bird_d: Maybe should be aligned by default?
               align && '[&>*]:h-input flex !gap-0 overflow-clip [&>*]:!rounded-none [&>*]:!border-0',
               '[&>*]:!border-none',
            ]}
         >
            {children}
         </Frame>
      )
   },
)
