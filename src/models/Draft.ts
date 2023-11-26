import type { LiveInstance } from '../db/LiveInstance'
import type { GraphID, GraphL } from './Graph'
import type { StepL } from './Step'

import { autorun, reaction, runInAction, toJS } from 'mobx'
import { LibraryFile } from 'src/cards/CardFile'
import { AppPath } from 'src/cards/CardPath'
import { Widget_group, type Widget } from 'src/controls/Widget'
import { FormBuilder } from 'src/controls/FormBuilder'
import { __FAIL, __OK, type Result } from 'src/types/Either'
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
    actionPath: AppPath
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
        this.st.focusedStepID = null

        // 1. ensure req valid (TODO: validate)
        const req = this.gui.value
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

    gui: Result<Widget> = __FAIL('not loaded yet')

    get app(): LibraryFile | undefined {
        return this.st.library.cardsByPath.get(this.data.actionPath)
    }

    get action() {
        return this.app?.appCompiled
    }

    onHydrate = () => {
        console.log(`[🦊] form: hydrating`)
    }

    isInitializing = false
    isInitialized = false
    AWAKE = () => {
        if (this.isInitialized) return
        this.isInitializing = true
        const _1 = reaction(
            () => this.action,
            (action) => {
                console.log(`[🦊] form: awakening app ${this.data.actionPath}`)
                if (action == null) return
                try {
                    const formBuilder = new FormBuilder(this.st.schema)
                    const uiFn = action.ui
                    const req: Widget_group<any> =
                        uiFn == null //
                            ? formBuilder._HYDRATE('group', { topLevel: true, items: () => ({}) }, this.data.actionParams)
                            : formBuilder._HYDRATE('group', { topLevel: true, items: () => uiFn(formBuilder) }, this.data.actionParams) // prettier-ignore
                    /** 👇 HACK; see the comment near the ROOT property definition */
                    formBuilder._ROOT = req
                    this.gui = __OK(req)
                    console.log(`[🦊] form: setup`)
                    // subState.unsync()
                } catch (e) {
                    console.error(e)
                    this.gui = __FAIL('ui function crashed', e)
                    return
                }
            },
            { fireImmediately: true },
        )

        // 🔴 dangerous
        const _2 = autorun(() => {
            const formValue = this.gui.value
            if (formValue == null) return null
            const count = formValue.builder._cache.count // manual mobx invalidation
            const _ = JSON.stringify(formValue.serial)
            runInAction(() => {
                console.log(`[🦊] form: updating`)
                this.update({ actionParams: formValue.serial })
            })
        })

        this.isInitialized = true
        this.isInitializing = false
        return () => {
            _1()
            _2()
            this.isInitialized = false
            this.gui = __FAIL('not loaded yet')
        }
    }
}
