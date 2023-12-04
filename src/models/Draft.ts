import type { LiveInstance } from '../db/LiveInstance'
import type { StepL } from './Step'

import { autorun, reaction, runInAction } from 'mobx'
import { Status } from 'src/back/Status'
import { LibraryFile } from 'src/cards/CardFile'
import { FormBuilder } from 'src/controls/FormBuilder'
import { Widget_group, type Widget } from 'src/controls/Widget'
import { SQLITE_true } from 'src/db/SQLITE_boolean'
import { DraftT } from 'src/db/TYPES.gen'
import { __FAIL, __OK, type Result } from 'src/types/Either'

export type FormPath = (string | number)[]

/** a thin wrapper around a single Draft somewhere in a .ts file */
export interface DraftL extends LiveInstance<DraftT, DraftL> {}
export class DraftL {
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
        // ----------------------------------------
        // 🔴 2023-11-30 rvion:: TEMPORPARY HACKS
        this.st.focusedStepID = null
        this.st.focusedStepOutput = null
        // ----------------------------------------

        // 1. ensure req valid (TODO: validate)
        const req: Maybe<Widget_group<any>> = this.gui.value
        if (req == null) throw new Error('invalid req')

        // 2. ensure graph valid
        const startGraph = this.st.getProject().rootGraph.item
        if (startGraph == null) throw new Error('invalid graph')

        // 3. bumpt the builder cache count
        // so widgets like seed can properly update
        const builder = req.builder
        builder._cache.count++

        const graph = startGraph.clone()
        // 4. create step
        const step = this.db.steps.create({
            name: this.data.title,
            //
            appPath: this.data.appPath,
            formResult: req.result,
            formSerial: req.serial,
            //
            // parentGraphID: graph.id,
            outputGraphID: graph.id,
            isExpanded: SQLITE_true,
            //
            status: Status.New,
        })
        graph.update({ stepID: step.id }) // 🔶🔴
        step.start({ formInstance: req })
        return step
    }

    gui: Result<Widget_group<any>> = __FAIL('not loaded yet')

    get app(): LibraryFile | undefined {
        return this.st.library.cardsByPath.get(this.data.appPath)
    }

    get action() {
        return this.app?.appCompiled
    }

    onHydrate = () => {
        // console.log(`[🦊] form: hydrating`)
    }

    isInitializing = false
    isInitialized = false
    AWAKE = () => {
        if (this.isInitialized) return
        this.isInitializing = true
        const _1 = reaction(
            () => this.action,
            (action) => {
                console.log(`[🦊] form: awakening app ${this.data.appPath}`)
                if (action == null) return
                try {
                    const formBuilder = new FormBuilder(this.st.schema)
                    const uiFn = action.ui
                    const req: Widget_group<any> =
                        uiFn == null //
                            ? formBuilder._HYDRATE('group', { topLevel: true, items: () => ({}) }, this.data.appParams)
                            : formBuilder._HYDRATE('group', { topLevel: true, items: () => uiFn(formBuilder) }, this.data.appParams) // prettier-ignore
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
                this.update({ appParams: formValue.serial })
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
