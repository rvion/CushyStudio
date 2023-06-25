import type { StepL } from 'src/models/Step'

import { observer } from 'mobx-react-lite'
import { Status, renderStatus2 } from '../../../back/Status'

export const StepTabBtnUI = observer(function StepTabBtnUI_(p: { step: StepL }) {
    const step = p.step
    const parentGraph = step.parentGraph.item
    const focusedBranch = parentGraph.focusedStep.item

    const isFocused = step.id === focusedBranch?.id
    const status = step.data.status
    return (
        <div
            key={step.id}
            className='p-1 step-container cursor-pointer'
            style={{
                fontWeight: isFocused ? 'bold' : undefined,
                borderTop:
                    status === Status.Failure //
                        ? '2px solid red'
                        : status === Status.Success //
                        ? '2px solid gray'
                        : '2px solid purple',
                backgroundColor: isFocused ? '#757575' : undefined,
            }}
            onClick={() => {
                parentGraph.update({ focusedStepID: step.id })
                // editableBranch?.update({
                //     toolID: step.tool.id,
                //     params: step.data.params,
                // })
            }}
        >
            <div>
                {/* {renderStatus2(step.data.status)}  */}
                {step.tool.item?.data.name}({step.outputGraph.item.childSteps.items.length})
            </div>
        </div>
    )
})

// export const StepUI = observer(function StepUI_(p: { step: StepL; depth: number }) {
//     const step = p.step
//     return (
//         <div>
//             <GraphUI graph={step.outputGraph.item} depth={p.depth} />
//         </div>
//     )
// })
