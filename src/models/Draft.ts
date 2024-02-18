import type { LibraryFile } from 'src/cards/LibraryFile'
import type { LiveInstance } from '../db/LiveInstance'
import type { CushyAppL } from './CushyApp'
import type { MediaImageL } from './MediaImage'
import type { StepL } from './Step'

import { reaction } from 'mobx'
import { Status } from 'src/back/Status'
import { Form } from 'src/controls/Form'
import { Widget_group } from 'src/controls/widgets/group/WidgetGroup'
import { LiveRef } from 'src/db/LiveRef'
import { SQLITE_false, SQLITE_true } from 'src/db/SQLITE_boolean'
import { DraftT } from 'src/db/TYPES.gen'
import { toastError } from 'src/utils/misc/toasts'

export type FormPath = (string | number)[]

/** a thin wrapper around a single Draft somewhere in a .ts file */
export interface DraftL extends LiveInstance<DraftT, DraftL> {}
export class DraftL {
    // 🔴 HACKY
    shouldAutoStart = false

    /** collapse all top-level form entryes */
    collapseTopLevelFormEntries = () => this.form?.root?.collapseAllEntries()

    /** expand all top-level form entries */
    expandTopLevelFormEntries = () => this.form?.root?.expandAllEntries()

    appRef = new LiveRef<this, CushyAppL>(this, 'appID', () => this.db.cushy_apps)

    openOrFocusTab = () => {
        this.st.layout.FOCUS_OR_CREATE('Draft', { draftID: this.id }, 'LEFT_PANE_TABSET')
        // this.st.tree2View.revealAndFocusAtPath(['all-drafts', this.id])
    }

    private _duplicateTitle = (input: string): string => {
        const regex = /(\d+)$/ // Regular expression to match a number at the end of the string
        const match = input.match(regex) // Check if the string ends with a number
        if (match) {
            // If there is a number, increment it
            const number = parseInt(match[0], 10)
            return input.replace(regex, (number + 1).toString())
        } else {
            // If there is no number, append '-1'
            return input + '-1'
        }
    }
    duplicateAndFocus() {
        const newDraft = this.clone({
            title: this._duplicateTitle(this.name),
        })
        newDraft.openOrFocusTab()
        newDraft.revealInFileExplorer()
    }

    revealInFileExplorer = () => {
        const app = this.app
        const relPath = app.relPath
        if (relPath == null) return
        const treePath = relPath.split('/')
        treePath.shift()
        treePath.push(app.id)
        if (this.virtualFolder) treePath.push(...this.virtualFolder.split('/'))
        treePath.push(this.id)
        this.st.tree2View.revealAndFocusAtPath(treePath)
    }

    /** if name is 'portrait/SMILING' => 'portrait' */
    get virtualFolder(): string {
        const pieces = this.name.split('/')
        pieces.pop()
        return pieces.join('/')
    }

    get app(): CushyAppL {
        return this.appRef.item
    }

    get executable() {
        return this.app.executable_orExtract
    }

    get name() {
        return this.data.title ?? this.id
    }

    get isFavorite(): boolean {
        return this.data.isFavorite === SQLITE_true
    }

    setFavorite = (fav: boolean) => {
        this.update({ isFavorite: fav ? SQLITE_true : SQLITE_false })
    }

    private autoStartTimer: NodeJS.Timeout | null = null

    setAutostart(val: boolean) {
        this.shouldAutoStart = val
        if (val) this.start({})
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
            this.start({})
        }, this.st.project.data.autostartDelay)
        //
    }

    /**
     * start a draft
     * a.k.a. "running a draft"
     * a.k.a. "starting the app"
     * a.k.a. "executing the app"
     * */
    start = (p: {
        //
        formValueOverride?: Maybe<any>
        imageToStartFrom?: MediaImageL
        focusOutput?: boolean
    }): StepL => {
        if (this.form == null) {
            toastError('form not loaded yet')
            throw new Error('❌ form not loaded yet')
        }
        this.isDirty = false
        this.form.formBuilder._cache.count++
        this.AWAKE()

        if (p.focusOutput ?? true) {
            // 2024-01-21 should this be here ?
            this.st.layout.FOCUS_OR_CREATE('Output', {})
        }

        // ----------------------------------------
        // 🔴 2023-11-30 rvion:: TEMPORPARY HACKS
        this.st.focusedStepID = null
        this.st.focusedStepOutput = null
        // ----------------------------------------

        // 1. ensure req valid (TODO: validate)
        const widget = p.formValueOverride
            ? // case of sub-drafts created/started from within a draft
              ({
                  builder: { _cache: { count: 0 } },
                  result: p.formValueOverride,
                  serial: {},
              } as any as Widget_group<any>)
            : this.form.root

        if (widget == null) throw new Error('invalid req')

        // 2. ensure graph valid
        const startGraph = this.st.project.rootGraph.item
        if (startGraph == null) throw new Error('invalid graph')

        // 3. bumpt the builder cache count
        // so widgets like seed can properly update

        // 2023-12-21 was used for seeds, but send a wrong message to mimick a form upadte everytime a run start
        // it is in direct contradiction with the new autorun mechanism
        // ⏸️ const builder = req.builder
        // ⏸️ builder._cache.count++ 🔴

        // console.log(`[👙] 🔴`, JSON.stringify(widget.serial))
        // debugger
        const graph = startGraph.clone()
        // 4. create step
        const step = this.db.steps.create({
            name: this.data.title,
            appID: this.data.appID,
            draftID: this.data.id,
            formSerial: widget.serial,
            outputGraphID: graph.id,
            isExpanded: SQLITE_true,
            status: Status.New,
        })
        graph.update({ stepID: step.id }) // 🔶🔴
        step.start({
            formInstance: widget,
            imageToStartFrom: p.imageToStartFrom,
        })
        this.lastStarted = step
        void step.finished.then(() => {
            this.checkIfShouldRestart()
        })
        return step
    }

    form: Maybe<Form<any>> = null

    get file(): LibraryFile {
        return this.st.library.getFile(this.appRef.item.relPath)
    }

    isInitialized = false

    AWAKE = () => {
        // if (this.isInitializing) return
        if (this.isInitialized) return
        // this.isInitializing = true
        const _1 = reaction(
            () => this.executable,
            (action) => {
                console.log(`[🦊] form: awakening app ${this.data.appID}`)
                if (action == null) return
                this.form = new Form(action.ui, {
                    name: this.name,
                    initialValue: () => this.data.formSerial,
                    onChange: (root) => {
                        console.log(`[👙] UPDATING draft(${this.id}) SERIAL`)
                        this.update({ formSerial: root.serial })
                        console.log(`[👙]  => new:`, JSON.stringify(this.data.formSerial.values_.positive.val))
                        this.isDirty = true
                        this.checkIfShouldRestart()
                    },
                })
                // form.init()
            },
            { fireImmediately: true },
        )

        // 🔴 dangerous
        // const _2 = autorun(
        //     () => {
        //         const rootWidget = this.form.value
        //         if (rootWidget == null) return null
        //         // const count = formValue.form._cache.count // manual mobx invalidation
        //         const _ = rootWidget.serialHash
        //         runInAction(() => {
        //             console.log(`[🦊] form: updating`)
        //             this.update({ formSerial: rootWidget.serial })
        //             this.isDirty = true
        //             this.checkIfShouldRestart()
        //         })
        //     },
        //     { delay: 100 },
        // )

        this.isInitialized = true
        // this.isInitializing = false
        return () => {
            _1()
            // _2()
            this.isInitialized = false
            this.form?.cleanup?.()
            this.form = null //  __FAIL('not loaded yet')
        }
    }
}
