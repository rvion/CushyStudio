import type { LiveInstance } from '../db/LiveInstance'
import type { GraphID, GraphL } from './Graph'
import type { StepL } from './Step'
import type { ToolID, ToolL } from './Tool'

import { FormBuilder, type Requestable } from 'src/controls/InfoRequest'
import { type Result, __FAIL, __OK } from 'src/utils/Either'
import { LiveRef } from '../db/LiveRef'
import { autorun, reaction, runInAction, toJS } from 'mobx'

export type FormPath = (string | number)[]

export type DraftID = Branded<string, 'DraftID'>
export const asDraftID = (s: string): DraftID => s as any

export type DraftT = {
    id: DraftID /** form that lead to creating this Draft */
    createdAt: number
    updatedAt: number
    title: string
    toolID: ToolID /** tool params */
    params?: Maybe<any> /** parent */
    graphID: GraphID
}

/** a thin wrapper around a single Draft somewhere in a .ts file */
export interface DraftL extends LiveInstance<DraftT, DraftL> {}
export class DraftL {
    graph = new LiveRef<this, GraphL>(this, 'graphID', 'graphs')
    tool = new LiveRef<this, ToolL>(this, 'toolID', 'tools')

    // 🔴 HACKY
    private shouldAutoStart = false
    private autoStartTimer: NodeJS.Timeout | null = null
    setAutostart(val: boolean) {
        this.shouldAutoStart = val
        if (this.shouldAutoStart) {
            // If there is already a timer running, clear it first
            if (this.autoStartTimer) {
                clearInterval(this.autoStartTimer)
            }

            // Start a new timer
            this.autoStartTimer = setInterval(() => {
                // Call your start method here
                this.start()
            }, 2000)
        } else {
            // Stop the timer when shouldAutoStart is false
            if (this.autoStartTimer) {
                clearInterval(this.autoStartTimer)
                this.autoStartTimer = null
            }
        }
    }

    start = (): StepL => {
        // console.log('🟢', JSON.stringify(this.data))
        const req = this.form.value
        if (req == null) throw new Error('invalid req')
        const step = this.graph.item.createStep({
            toolID: this.data.toolID,
            actionResult: req.result,
            actionState: req.state,
        })
        step.start()
        return step
    }

    focus = () => this.graph.item.update({ focusedDraftID: this.id })
    getPathInfo = (path: FormPath): string => this.id + '/' + path.join('/')

    form: Result<Requestable> = __FAIL('not loaded yet')
    onHydrate = () => {
        let subState = {
            unsync: () => {},
        }
        console.log(`🦊 on hydrate`)
        // reload action when it changes
        // 🔴 dangerous
        reaction(
            () => this.tool.item.updatedAt,
            () => {
                console.log(`🟢 -------- DRAFT LOADING ACTION --------- 🟢 `)
                const action = this.tool.item.retrieveAction()
                if (!action.success) {
                    this.form = __FAIL('action failed')
                    return
                }
                const uiFn = action.value.ui
                if (uiFn == null) {
                    this.form = __FAIL('no UI function')
                    return
                }

                try {
                    const formBuilder = new FormBuilder(this.st.schema)
                    const req: Requestable = formBuilder.group({ items: uiFn(formBuilder) }, this.data.params)
                    this.form = __OK(req)
                    console.log(`🦊 form setup`)
                    // subState.unsync()
                } catch (e) {
                    this.form = __FAIL('ui function crashed', e)
                    return
                }
            },
            { fireImmediately: true },
        )

        // 🔴 dangerous
        autorun(() => {
            const formValue = this.form.value
            if (formValue == null) return null
            const _ = JSON.stringify(formValue.serial)
            runInAction(() => {
                console.log(`🦊 updating the form`)
                this.update({ params: formValue.serial })
            })
        })
    }
}
