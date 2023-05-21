import * as I from '@rsuite/icons'
import { observer } from 'mobx-react-lite'
import { Button, IconButton } from 'rsuite'
import { useSt } from '../../FrontStateCtx'
import { FormUI } from '../widgets/FormUI'
import { useProject } from '../../ProjectCtx'
import { nanoid } from 'nanoid'
import { StepL, asStepID } from '../../../models/Step'
import { FormState } from '../FormState'

export const ActionPickerUI = observer(function ActionPickerUI_(p: { step: StepL }) {
    const st = useSt()
    const pj = useProject()
    const step = p.step
    if (step.project !== pj) return <>🔴 wrong project</>

    const action = step.action
    return (
        <div className='flex'>
            <div className='flex flex-col items-start'>
                {/* ({uiSt.currentActionID}) */}
                {st.db.actions.map((a) => {
                    return (
                        <Button
                            startIcon={<I.PlayOutline />}
                            key={a.id}
                            size='sm'
                            appearance={step.action?.id === a.id ? 'primary' : 'ghost'}
                            color={step.action?.id === a.id ? 'green' : undefined}
                            onClick={() => {
                                step.update({ actionID: a.id })
                                // if (XX.currentActionRef?.id != actionRef.id) {
                                //     XX.focusAction(actionRef)
                                //     return
                                // }
                            }}
                        >
                            <div>
                                {a.data.name}
                                {/* ({actionRef.id}) */}
                            </div>
                        </Button>
                    )
                })}
            </div>
            {action && (
                <FormUI
                    title={step.action.data.name}
                    formDef={step.action.data.form ?? {}}
                    submit={() => {
                        st.db.steps.create({
                            id: asStepID(nanoid()),
                            projectID: step.data.projectID,
                            actionID: action.id,
                        })
                    }}
                    // 🔴
                    formState={new FormState(st)}
                    // formState={step.data.formState}
                />
            )}
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
