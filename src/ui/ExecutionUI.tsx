import { Button, Card, CardFooter, CardHeader, Input, Label } from '@fluentui/react-components'
import * as I from '@fluentui/react-icons'
import { observer, useLocalObservable } from 'mobx-react-lite'
import { ReactNode } from 'react'
import { exhaust } from '../core/ComfyUtils'
import { ScriptStep_askBoolean, ScriptStep_askString } from '../core/ScriptStep_ask'
import { ScriptStep_Init } from '../core/ScriptStep_Init'
import { ScriptStep_Output } from '../core/ScriptStep_Output'
import { ScriptStep_prompt } from '../core/ScriptStep_prompt'
import { NodeListUI } from './NodeListUI'
import { useSt } from './stContext'

export const ExecutionUI = observer(function ExecutionUI_(p: {}) {
    const st = useSt()
    const project = st.project
    const run = project.currentRun
    if (run == null) return <>no execution yet</>

    return (
        <div className='col gap'>
            {/* <h1>Run {}</h1> */}
            {run.steps.map((step, ix) => {
                if (step instanceof ScriptStep_Init) return <div key={ix}>Init</div>
                if (step instanceof ScriptStep_Output) return <div key={ix}>Output</div>
                if (step instanceof ScriptStep_prompt)
                    return (
                        <Card key={ix}>
                            <CardHeader description={'Prompt'}></CardHeader>
                            <NodeListUI graph={step._graph} />
                        </Card>
                    )
                if (step instanceof ScriptStep_askBoolean) return <Execution_askBooleanUI key={ix} step={step} />
                if (step instanceof ScriptStep_askString) return <Execution_askStringUI key={ix} step={step} />

                return exhaust(step)
            })}
        </div>
    )
})

export const Execution_askBooleanUI = observer(function Execution_askUI_(p: { step: ScriptStep_askBoolean }) {
    return (
        <Card>
            <CardHeader description={p.step.msg}></CardHeader>
            <CardFooter>
                <Button onClick={() => p.step.answer(true)} appearance='primary' icon={<I.CalendarMonthRegular />}>
                    Yes
                </Button>
                <Button onClick={() => p.step.answer(false)} appearance='primary' icon={<I.CalendarMonthRegular />}>
                    No
                </Button>
            </CardFooter>
        </Card>
    )
})

export const Execution_askStringUI = observer(function Execution_askUI_(p: { step: ScriptStep_askString }) {
    const uiSt = useLocalObservable(() => ({ value: '' }))
    return (
        <Card>
            <CardHeader description={p.step.msg}></CardHeader>
            <Input value={uiSt.value} onChange={(ev) => (uiSt.value = ev.target.value)} />
            <CardFooter>
                <Button onClick={() => p.step.answer(uiSt.value)} appearance='primary' icon={<I.CalendarMonthRegular />}>
                    OK
                </Button>
            </CardFooter>
        </Card>
    )
})

export const ExecutionWrapperUI = observer(function ExecutionWrapperUI_(p: { children: ReactNode }) {
    return <Card>{p.children}</Card>
})
