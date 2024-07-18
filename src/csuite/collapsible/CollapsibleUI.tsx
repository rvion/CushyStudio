import type { CollapsibleProps } from './CollapsibleProps'

import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'

import { Frame } from '../frame/Frame'
// import { AnimatedSizeUI } from '../smooth-size/AnimatedSizeUI'
import { CollapsibleState } from './CollapsibleState'

export const CollapsibleUI = observer(function CollapsibleUI_(p: CollapsibleProps) {
    const SELF = useMemo(() => new CollapsibleState(p), [])

    // 🔶 AnimatedSizeUI doesn't work with padding
    // (demo: <CollapsibleUI tw='pt-5' ... /> with encapsulating AnimatedSizeUI instead of div)
    return (
        <div tw={['flex flex-col cursor-pointer']} className={p.className} style={p.style}>
            <div tw='flex select-none' onClick={(ev) => SELF.toggle()}>
                {p.children ?? (
                    <Frame tw='flex' look='link' icon={SELF.isCollapsed ? 'mdiChevronRight' : 'mdiChevronDown'}>
                        {SELF.isCollapsed ? p.titleCollapsed ?? 'Voir plus' : p.titleExpanded ?? 'Voir moins'}
                    </Frame>
                )}
            </div>
            {SELF.isExpanded && p.content(SELF)}
        </div>
    )
})
