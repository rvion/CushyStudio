import { observer } from 'mobx-react-lite'

import { computePlacement } from '../../csuite/reveal/RevealPlacement'
import { themeConf } from '../../state/conf/themeConf'
import { tooltipStuff } from '../frame/tooltip'
import { useDelay } from './useDelay'

export const TooltipUI = observer(function TooltipUI_(p: {}) {
    const conf = themeConf.value.tooltipDelay

    const isDelayed = useDelay(conf, [tooltipStuff.tooltip, conf])
    const tooltip = tooltipStuff.tooltip

    if (isDelayed && conf != null) return null
    if (tooltip == null) return null
    const domRect = tooltip.ref.getBoundingClientRect()
    const pos = computePlacement('bottom', domRect)
    const txt = tooltip.text

    return (
        <div style={pos} tw='absolute rounded top-0 left-0 [z-index:99999]'>
            <div tw='bg-black mt-2 p-2'>
                {/* {isDelayed ? '🟢' : '❌'} */}
                <div>{txt}</div>
            </div>
            {/* {JSON.stringify(pos)} */}
        </div>
    )
})
