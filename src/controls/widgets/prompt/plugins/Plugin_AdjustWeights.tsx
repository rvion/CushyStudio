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
                <div tw='flex gap-2 items-center'>
                    <InputNumberUI
                        tw='w-48 flex-none'
                        onValueChange={(v) => (weighted.weight = v)}
                        mode='float'
                        value={weighted.weight}
                        softMin={0}
                        softMax={2}
                    />
                    <div tw='line-clamp-1 whitespace-nowrap'>{weighted.contentText}</div>
                </div>
            ))}
        </div>
    )
})
