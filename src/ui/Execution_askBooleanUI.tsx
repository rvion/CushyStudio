import { Button, CardFooter, CardHeader } from '@fluentui/react-components'
import * as I from '@fluentui/react-icons'
import { observer } from 'mobx-react-lite'
import { Fragment } from 'react'
import { ScriptStep_askBoolean } from '../core/ScriptStep_ask'

export const Execution_askBooleanUI = observer(function Execution_askUI_(p: { step: ScriptStep_askBoolean }) {
    return (
        <Fragment>
            <CardHeader description={p.step.msg}></CardHeader>
            {p.step.locked ? (
                <CardFooter>{p.step.value ? 'YES' : 'NO'}</CardFooter>
            ) : (
                <CardFooter>
                    <div className='grow' />
                    <Button onClick={() => p.step.answer(true)} appearance='primary' icon={<I.CalendarMonthRegular />}>
                        Yes
                    </Button>
                    <Button onClick={() => p.step.answer(false)} appearance='primary' icon={<I.CalendarMonthRegular />}>
                        No
                    </Button>
                </CardFooter>
            )}
        </Fragment>
    )
})
