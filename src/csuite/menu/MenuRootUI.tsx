import type { MenuInstance } from './MenuInstance'

import * as React from 'react'

import { Button } from '../button/Button'
import { RevealUI } from '../reveal/RevealUI'

export const MenuRootUI = obs(function MenuRootUI_(p: { menu: MenuInstance }) {
   return (
      <RevealUI /* className='dropdown' */ placement='bottomStart' content={() => <p.menu.UI />}>
         <Button borderless subtle>
            {/* <span tw='hidden lg:inline-block'>{p.startIcon}</span> */}
            {p.menu.menu.title}
         </Button>
      </RevealUI>
   )
})
