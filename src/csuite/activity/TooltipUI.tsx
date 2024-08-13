import { observer } from 'mobx-react-lite'

import { computePlacement } from '../../csuite/reveal/RevealPlacement'
import { useCSuite } from '../ctx/useCSuite'
import { Frame } from '../frame/Frame'
import { tooltipStuff } from '../frame/tooltip'
import { useDelay } from './useDelay'

export const TooltipUI = observer(function TooltipUI_(p: {}) {
    const csuite = useCSuite()
    const conf = csuite.tooltipDelay

    const tooltip = tooltipStuff.deepest
    const isDelayed = useDelay(conf, [tooltip, conf])

    if (isDelayed && conf != null) return null
    if (tooltip == null) return null
    const domRect = tooltip.ref.getBoundingClientRect()
    const pos = computePlacement(tooltip.placement ?? 'bottom', domRect)
    const txt = tooltip.text

    return (
        <div style={pos} tw='absolute rounded top-0 left-0 [z-index:99999]'>
            <Frame base={80} border shadow tw='px-1 py-0.5 opacity-70'>
                <div>{txt}</div>
            </Frame>
        </div>
    )
})
