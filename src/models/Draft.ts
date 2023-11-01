import type { LiveInstance } from '../db/LiveInstance'
import type { GraphID, GraphL } from './Graph'
import type { StepL } from './Step'

import { autorun, reaction, runInAction, toJS } from 'mobx'
import { CardFile } from 'src/library/CardFile'
import { CardPath } from 'src/library/CardPath'
import { type Widget } from 'src/controls/Widget'
import { FormBuilder } from 'src/controls/FormBuilder'
import { __FAIL, __OK, type Result } from 'src/utils/Either'
import { LiveRef } from '../db/LiveRef'
import { Status } from 'src/back/Status'

export type FormPath = (string | number)[]

export type DraftID = Branded<string, { DraftID: true }>
export const asDraftID = (s: string): DraftID => s as any

export type DraftT = {
    id: DraftID /** form that lead to creating this Draft */
    createdAt: number
    updatedAt: number

    // presetntation
    title: string

    // action
    actionPath: CardPath
    actionParams: any

    // starting graph
    graphID: GraphID
}

/** a thin wrapper around a single Draft somewhere in a .ts file */
export interface DraftL extends LiveInstance<DraftT, DraftL> {}
export class DraftL {
    graph = new LiveRef<this, GraphL>(this, 'graphID', 'graphs')

    // 🔴 HACKY
    shouldAutoStart = false
    private autoStartTimer: NodeJS.Timeout | null = null
    setAutostart(val: boolean) {
        this.shouldAutoStart = val
        if (this.shouldAutoStart) {
            if (this.autoStartTimer) clearInterval(this.autoStartTimer)
            this.autoStartTimer = setInterval(() => this.start(), 2000)
        } else {
            // Stop the timer when shouldAutoStart is false
            if (this.autoStartTimer) {
                clearInterval(this.autoStartTimer)
                this.autoStartTimer = null
            }
        }
    }

    start = (): StepL => {
        // 1. ensure req valid (TODO: validate)
        const req = this.form.value
        if (req == null) throw new Error('invalid req')

        // 2. ensure graph valid
        const graph = this.graph.item
        if (graph == null) throw new Error('invalid graph')

        // 3. bumpt the builder cache count
        // so widgets like seed can properly update
        const builder = req.builder
        builder._cache.count++

        // 4. create step
        const step = this.db.steps.create({
            name: this.data.title,
            //
            actionPath: this.data.actionPath,
            formResult: req.result,
            formSerial: req.serial,
            //
            parentGraphID: graph.id,
            outputGraphID: graph.clone().id,
            //
            status: Status.New,
        })
        step.start()
        return step
    }

    form: Result<Widget> = __FAIL('not loaded yet')

    get actionFile(): CardFile | undefined { return this.st.library.cardsByPath.get(this.data.actionPath) } // prettier-ignore
    get action() { return this.actionFile?.action } // prettier-ignore

    onHydrate = () => {
        let subState = { unsync: () => {} }
        console.log(`🦊 on hydrate`)
        // reload action when it changes
        // 🔴 dangerous

        reaction(
            () => this.action,
            (action) => {
                console.log(`🟢 -------- DRAFT LOADING ACTION --------- 🟢 `)
                if (action == null) return
                try {
                    const formBuilder = new FormBuilder(this.st.schema)
                    const uiFn = action.ui
                    const req: Widget =
                        uiFn == null //
                            ? formBuilder.group({ topLevel: true, items: () => ({}) }, this.data.actionParams)
                            : formBuilder.group({ topLevel: true, items: () => uiFn(formBuilder) }, this.data.actionParams)
                    this.form = __OK(req)
                    console.log(`🦊 form setup`)
                    // subState.unsync()
                } catch (e) {
                    console.error(e)
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
            const count = formValue.builder._cache.count // manual mobx invalidation
            const _ = JSON.stringify(formValue.serial)
            runInAction(() => {
                console.log(`🦊 updating the form`)
                this.update({ actionParams: formValue.serial })
            })
        })
    }
}
