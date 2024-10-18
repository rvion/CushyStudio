import type { ReactNode } from 'react'

import { observer } from 'mobx-react-lite'

import { Frame } from '../frame/Frame'

export const MenuDivider = observer(function Divider_(p: { children?: ReactNode }) {
    return (
        <div className='!h-widget relative grid text-sm'>
            <div tw='absolute z-0 h-1 [border-top:1px_solid_#aaaaaa88] w-full [top:50%]'></div>
            <Frame border tw='relative z-1 h-widget justify-self-center'>
                {p.children ?? <></>}
            </Frame>
        </div>
    )
})
