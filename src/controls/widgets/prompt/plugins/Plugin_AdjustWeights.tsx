import type { WidgetPromptUISt } from '../WidgetPromptUISt'

import { observer } from 'mobx-react-lite'
import { InputNumberUI } from 'src/rsuite/InputNumberUI'

export const Plugin_AdjustWeightsUI = observer(function Plugin_AdjustWeightsUI_(p: {
    //
    uist: WidgetPromptUISt
}) {
    const uist = p.uist
    return (
        <div>
            {uist.ast.findAll('WeightedExpression').map((w) => (
                <div tw='flex items-center'>
                    <div tw='w-40 line-clamp-1 whitespace-nowrap'>{w.text.slice(1, -5)}</div>
                    <InputNumberUI onValueChange={(v) => (w.weight = v)} mode='float' value={w.weight} min={0} max={2} />
                </div>
            ))}
        </div>
    )
})
