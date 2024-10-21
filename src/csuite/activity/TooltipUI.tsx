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
        <div style={pos} tw='absolute left-0 top-0 whitespace-pre rounded [z-index:99999]'>
            <Frame
                // (bird_d): (THEME-TODO) Theming here should be separated from the input stuff since tooltips aren't really inputs, but okay for now. Opacity is annoying because it blends with the stuff behind it, making tooltips harder to read. If you don't want them to block the stuff under it, simply move off the thing displaying the tooltip. This is also why you don't want them to be shown instantly the majority of the time, since that will annoyingly block everything.
                base={csuite.base}
                roundness={csuite.inputRoundness}
                border={csuite.inputBorder}
                shadow
                dropShadow={{ y: 3, blur: 3, opacity: 0.33 }}
                tw='p-2'
            >
                <div>{txt}</div>
            </Frame>
        </div>
    )
})
