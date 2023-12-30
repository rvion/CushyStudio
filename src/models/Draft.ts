import type { LiveInstance } from '../db/LiveInstance'
import type { StepL } from './Step'

import { autorun, reaction, runInAction } from 'mobx'
import { Status } from 'src/back/Status'
import { LibraryFile } from 'src/cards/LibraryFile'
import { FormBuilder } from 'src/controls/FormBuilder'
import { Widget_group } from 'src/controls/Widget'
import { LiveRef } from 'src/db/LiveRef'
import { SQLITE_true } from 'src/db/SQLITE_boolean'
import { DraftT } from 'src/db/TYPES.gen'
import { __FAIL, __OK, type Result } from 'src/types/Either'
import { CushyAppL } from './CushyApp'

export type FormPath = (string | number)[]

/** a thin wrapper around a single Draft somewhere in a .ts file */
export interface DraftL extends LiveInstance<DraftT, DraftL> {}
export class DraftL {
    // 🔴 HACKY
    shouldAutoStart = false

    appRef = new LiveRef<this, CushyAppL>(this, 'appID', () => this.db.cushy_apps)

    get app(): CushyAppL {
        return this.appRef.item
    }

    get executable() {
        return this.app.executable
    }

    get name() {
        return this.data.title ?? this.id
    }

    private autoStartTimer: NodeJS.Timeout | null = null

    setAutostart(val: boolean) {
        this.shouldAutoStart = val
        if (val) this.start()
    }

    lastStarted: Maybe<StepL> = null
    isDirty = false

    // mailboxes as signal slot for other to mention stuff
    checkIfShouldRestart = (): void => {
        if (!this.shouldAutoStart) return // console.log(`[⏰] no autostart`)
        if (this.lastStarted?.finished.value == null) return // console.log(`[⏰] already running`)
        if (!this.isDirty) return // console.log(`[⏰] not dirty`)
        if (this.autoStartTimer != null) {
            // console.log(`[⏰] already scheduled; clearing prev schedule`)
            clearTimeout(this.autoStartTimer)
            // return console.log(`[⏰] already scheduled`)
        }
        this.autoStartTimer = setTimeout(() => {
            if (this.lastStarted?.finished.value == null) return console.log(`[⏰] ready to start, but step still running`)
            this.autoStartTimer = null
            this.start()
        }, this.st.project.data.autostartDelay)
        //
    }
    start = (formValueOverride?: Maybe<any>): StepL => {
        this.isDirty = false
        // ----------------------------------------
        // 🔴 2023-11-30 rvion:: TEMPORPARY HACKS
        this.st.focusedStepID = null
        this.st.focusedStepOutput = null
        // ----------------------------------------

        // 1. ensure req valid (TODO: validate)
        const req = formValueOverride
            ? // case of sub-drafts created/started from within a draft
              ({
                  builder: { _cache: { count: 0 } },
                  result: formValueOverride,
                  serial: {},
              } as any as Widget_group<any>)
            : this.gui.value

        if (req == null) throw new Error('invalid req')

        // 2. ensure graph valid
        const startGraph = this.st.project.rootGraph.item
        if (startGraph == null) throw new Error('invalid graph')

        // 3. bumpt the builder cache count
        // so widgets like seed can properly update

        // 2023-12-21 was used for seeds, but send a wrong message to mimick a form upadte everytime a run start
        // it is in direct contradiction with the new autorun mechanism
        // ⏸️ const builder = req.builder
        // ⏸️ builder._cache.count++ 🔴

        const graph = startGraph.clone()
        // 4. create step
        const step = this.db.steps.create({
            name: this.data.title,
            //
            appID: this.data.appID,
            draftID: this.data.id,
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
        this.lastStarted = step
        void step.finished.then(() => {
            this.checkIfShouldRestart()
        })
        return step
    }

    gui: Result<Widget_group<any>> = __FAIL('not loaded yet')

    get file(): LibraryFile {
        return this.st.library.getFile(this.appRef.item.relPath)
    }

    onHydrate = () => {
        // console.log(`[🦊] form: hydrating`)
    }

    isInitializing = false
    isInitialized = false
    AWAKE = () => {
        if (this.isInitializing) return
        if (this.isInitialized) return
        this.isInitializing = true
        const _1 = reaction(
            () => this.executable,
            (action) => {
                console.log(`[🦊] form: awakening app ${this.data.appID}`)
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
                this.isDirty = true
                this.checkIfShouldRestart()
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
