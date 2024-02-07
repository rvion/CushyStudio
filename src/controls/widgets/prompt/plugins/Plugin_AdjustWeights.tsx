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
            {uist.ast.findAll('WeightedExpression').map((weighted) => (
                <div tw='flex items-center'>
                    <div tw='w-40 line-clamp-1 whitespace-nowrap'>{weighted.contentText}</div>
                    <InputNumberUI
                        onValueChange={(v) => (weighted.weight = v)}
                        mode='float'
                        value={weighted.weight}
                        min={0}
                        max={2}
                    />
                </div>
            ))}
        </div>
    )
})
