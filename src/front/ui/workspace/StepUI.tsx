import { observer } from 'mobx-react-lite'
import { Button } from 'rsuite'
import { ActionPickerUI } from '../flow/ActionPickerUI'
import { ActionUI } from '../widgets/ActionUI'
import { StepL } from 'src/models/Step'

export const StepUI = observer(function StepUI_(p: { step: StepL }) {
    const step = p.step
    return (
        <div className='row'>
            <ActionPickerUI step={step} />
            <div>
                from (id={step.graph.id.slice(0, 3)}--{step.graph.item.size})
                <ul>
                    {step.graph.item.summary1.map((i, ix) => (
                        <li key={ix}>{i}</li>
                    ))}
                </ul>
            </div>
            <ActionUI key={step.id} step={step} />
            <div>
                <Button onClick={() => step.submit()}>OK</Button>
                <div>
                    to (id={step.runtime?.graph.id.slice(0, 3)}--{step.runtime?.graph.size}){' '}
                </div>
            </div>
            {/* <div>{step.runtime}</div> */}
        </div>
    )
})
