import * as I from '@rsuite/icons'
import { observer } from 'mobx-react-lite'
import { Fragment } from 'react'
import { IconButton } from 'rsuite'
import { ScriptStep_askBoolean } from '../controls/ScriptStep_ask'

export const Execution_askBooleanUI = observer(function Execution_askUI_(p: { step: ScriptStep_askBoolean }) {
    return (
        <Fragment>
            <div>{p.step.msg}</div>
            {p.step.locked ? (
                <div>{p.step.value ? 'YES' : 'NO'}</div>
            ) : (
                <div>
                    <div className='grow' />
                    <IconButton onClick={() => p.step.answer(true)} appearance='primary' icon={<I.Calendar />}>
                        Yes
                    </IconButton>
                    <IconButton onClick={() => p.step.answer(false)} appearance='primary' icon={<I.Calendar />}>
                        No
                    </IconButton>
                </div>
            )}
        </Fragment>
    )
})
