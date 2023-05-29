import * as I from '@rsuite/icons'
import { observer } from 'mobx-react-lite'
import { Button } from 'rsuite'
import { StepL } from '../../../models/Step'
import { useSt } from '../../FrontStateCtx'
import { useProject } from '../../ProjectCtx'
import { StepUI } from '../widgets/FormUI'

export const ActionPickerUI = observer(function ActionPickerUI_(p: { step: StepL }) {
    const st = useSt()
    const pj = useProject()
    const step = p.step
    if (step.project.item !== pj) return <>🔴 wrong project</>

    const action = step.action
    return (
        <div className='flex'>
            <div className='flex flex-col items-start border p-2'>
                Actions:
                {/* ({uiSt.currentActionID}) */}
                {st.db.actions.map((a) => {
                    return (
                        <Button
                            startIcon={<I.PlayOutline />}
                            key={a.id}
                            size='sm'
                            appearance={step.action.item?.id === a.id ? 'primary' : 'ghost'}
                            color={step.action.item?.id === a.id ? 'green' : undefined}
                            onClick={() => step.update({ actionID: a.id })}
                        >
                            <div>{a.data.name}</div>
                        </Button>
                    )
                })}
            </div>
            {/* {action && <FormUI step={step} />} */}
        </div>
        // <div>
        //     {/* ({st.ActionOptionForSelectInput.length} actions) */}
        //     {/* <SelectPicker
        //         value={uiSt.currentAction.id}
        //         labelKey='name'
        //         valueKey='id'
        //         // onChange={(v) => (uiSt.currentAction =)}
        //         data={st.ActionOptionForSelectInput}
        //         style={{ width: 224 }}
        //     /> */}
        //     {/* <IconButton
        //         //
        //         appearance='primary'
        //         color='green'
        //         disabled={step.currentActionRef == null}
        //         icon={<I.PlayOutline />}
        //         onClick={() => {
        //             if (step.currentActionRef == null) return
        //             // st.sendMessageToExtension({
        //             //     type: 'run-action',
        //             //     flowID: flow.id,
        //             //     actionID: uiSt.currentAction.id,
        //             //     data: {}, // 🔴
        //             // })
        //         }}
        //     /> */}
        // </div>
    )
})
