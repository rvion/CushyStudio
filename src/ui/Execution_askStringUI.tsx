import * as I from '@rsuite/icons'
import { observer, useLocalObservable } from 'mobx-react-lite'
import { Fragment } from 'react'
import { IconButton, Input } from 'rsuite'
import { ScriptStep_askString } from '../controls/ScriptStep_ask'

export const Execution_askStringUI = observer(function Execution_askUI_(p: { step: ScriptStep_askString }) {
    const uiSt = useLocalObservable(() => ({ value: p.step.def ?? '' }))
    return (
        <Fragment>
            <div>{p.step.msg}</div>
            <Input disabled={p.step.locked} value={uiSt.value} onChange={(ev) => (uiSt.value = ev)} />
            {p.step.locked ? null : (
                // <CardFooter>{p.step.value}</CardFooter>
                <div>
                    <div className='grow' />
                    <IconButton onClick={() => p.step.answer(uiSt.value)} appearance='primary' icon={<I.Calendar />}>
                        OK
                    </IconButton>
                </div>
            )}
        </Fragment>
    )
})
