import { observer } from 'mobx-react-lite'

import { computePlacement } from '../../csuite/reveal/RevealPlacement'
import { themeConf } from '../../state/conf/themeConf'
import { Frame } from '../frame/Frame'
import { tooltipStuff } from '../frame/tooltip'
import { useDelay } from './useDelay'

export const TooltipUI = observer(function TooltipUI_(p: {}) {
    const conf = themeConf.value.tooltipDelay

    const isDelayed = useDelay(conf, [tooltipStuff.tooltip, conf])
    const tooltip = tooltipStuff.tooltip

    if (isDelayed && conf != null) return null
    if (tooltip == null) return null
    const domRect = tooltip.ref.getBoundingClientRect()
    const pos = computePlacement(tooltip.placement ?? 'bottom', domRect)
    const txt = tooltip.text

    return (
        <div style={pos} tw='absolute rounded top-0 left-0 [z-index:99999]'>
            <Frame base={30} border shadow tw='p-2'>
                {/* {isDelayed ? '🟢' : '❌'} */}
                <div>{txt}</div>
            </Frame>
            {/* {JSON.stringify(pos)} */}
        </div>
    )
})
