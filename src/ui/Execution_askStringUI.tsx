import { Button, CardFooter, CardHeader, Input } from '@fluentui/react-components'
import * as I from '@fluentui/react-icons'
import { observer, useLocalObservable } from 'mobx-react-lite'
import { Fragment } from 'react'
import { ScriptStep_askString } from '../core/ScriptStep_ask'

export const Execution_askStringUI = observer(function Execution_askUI_(p: { step: ScriptStep_askString }) {
    const uiSt = useLocalObservable(() => ({ value: p.step.def ?? '' }))
    return (
        <Fragment>
            <CardHeader description={p.step.msg}></CardHeader>
            <Input disabled={p.step.locked} value={uiSt.value} onChange={(ev) => (uiSt.value = ev.target.value)} />
            {p.step.locked ? null : (
                // <CardFooter>{p.step.value}</CardFooter>
                <CardFooter>
                    <div className='grow' />
                    <Button onClick={() => p.step.answer(uiSt.value)} appearance='primary' icon={<I.CalendarMonthRegular />}>
                        OK
                    </Button>
                </CardFooter>
            )}
        </Fragment>
    )
})
