import type { DraftExecutionContext } from '../cards/App'
import type { LibraryFile } from '../cards/LibraryFile'
import type { Widget_group } from '../csuite/fields/group/WidgetGroup'
import type { Entity } from '../csuite/model/Entity'
import type { LiveInstance } from '../db/LiveInstance'
import type { TABLES } from '../db/TYPES.gen'
import type { CushyAppL } from './CushyApp'
import type { MediaImageL } from './MediaImage'
import type { StepL } from './Step'

import { reaction } from 'mobx'

// import { fileURLToPath } from 'url'
import { Status } from '../back/Status'
import { type Builder, cushyRepo } from '../controls/Builder'
import { SQLITE_false, SQLITE_true } from '../csuite/types/SQLITE_boolean'
import { toastError } from '../csuite/utils/toasts'
import { LiveRef } from '../db/LiveRef'

export type FormPath = (string | number)[]

/** a thin wrapper around a single Draft somewhere in a .ts file */
export interface DraftL extends LiveInstance<TABLES['draft']> {}
export class DraftL {
    // 🔴 HACKY
    shouldAutoStart = false

    /** collapse all top-level form entryes */
    collapseTopLevelFormEntries = () => this.form?.root?.collapseAllChildren()

    /** expand all top-level form entries */
    expandTopLevelFormEntries = () => this.form?.root?.expandAllChildren()

    // TODO: rename
    // get illustrationFilePathAbs(): AbsolutePath | null {
    //     if (this.data.illustration == null) return null
    //     return fileURLToPath(this.data.illustration) as AbsolutePath
    // }

    appRef = new LiveRef<this, CushyAppL>(this, 'appID', 'cushy_app')

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
    private autoStartMaxTimer: NodeJS.Timeout | null = null

    setAutostart(val: boolean) {
        this.shouldAutoStart = val
        if (val) this.start({})
    }

    lastStarted: Maybe<StepL> = null

    isDirty = false

    checkIfShouldRestart = (): void => {
        // console.log(`[⏰] checkIfShouldRestart called`)
        if (!this.shouldAutoStart) return // If autostart is not enabled, exit
        if (this.lastStarted?.finished.value == null) return // If the last step is still running, exit

        // Set the max timer
        if (this.autoStartMaxTimer != null) {
            clearTimeout(this.autoStartMaxTimer)
        }
        this.autoStartMaxTimer = setTimeout(() => {
            // console.log(`[⏰] autostartMaxTimer callback`)
            if (this.lastStarted?.finished.value == null) {
                // console.log(`[⏰] ready to start, but step still running`)
                return
            }
            this.autoStartMaxTimer = null
            this.start({})
        }, this.st.project.data.autostartMaxDelay)

        // Set the regular timer if the form is dirty
        if (this.isDirty) {
            if (this.autoStartTimer != null) {
                clearTimeout(this.autoStartTimer)
            }
            this.autoStartTimer = setTimeout(() => {
                // console.log(`[⏰] autostartTimer callback`)
                if (this.lastStarted?.finished.value == null) {
                    // console.log(`[⏰] ready to start, but step still running`)
                    return
                }
                this.autoStartTimer = null
                this.start({})
            }, this.st.project.data.autostartDelay)
        } else {
            // If the form is not dirty, clear the regular timer
            if (this.autoStartTimer != null) {
                clearTimeout(this.autoStartTimer)
                this.autoStartTimer = null
            }
        }
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
        context?: DraftExecutionContext
        httpPayload?: any
        focusOutput?: boolean
    }): StepL => {
        if (this.form == null) {
            toastError('form not loaded yet')
            throw new Error('❌ form not loaded yet')
        }
        this.isDirty = false
        this.form.domain._cache.count++
        this.AWAKE()

        // update
        this.update({ lastRunAt: Date.now() })
        this.app.update({ lastRunAt: Date.now() })

        if (p.focusOutput ?? true) {
            // 💬 2024-01-21 should this be here ?
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

        const graph = startGraph.clone()
        // 4. create step
        const step = this.db.step.create({
            name: this.data.title,
            appID: this.data.appID,
            draftID: this.data.id,
            formSerial: widget.serial,
            outputGraphID: graph.id,
            isExpanded: SQLITE_true,
            status: Status.New,
        })
        graph.update({ stepID: step.id }) // 🔶🔴

        // start step without waiting
        void step.start({
            formInstance: widget,
            context: p.context ?? {},
        })
        this.lastStarted = step
        void step.finished.then(() => {
            this.checkIfShouldRestart()
        })
        return step
    }

    get form() {
        this.AWAKE()
        return this._form
    }
    _form: Maybe<Entity<any, Builder>> = null

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
                // 💬 2024-03-13 hopefully this is not needed anymore now that
                // | we're no longer using reactions
                // if (this.form) this.form.cleanup?.()

                this._form = cushyRepo.fields(action.ui, {
                    name: this.name,
                    initialSerial: () => this.data.formSerial,
                    onSerialChange: (form) => {
                        this.update({ formSerial: form.serial })
                        console.log(`[👙] UPDATING draft(${this.id}) SERIAL`)
                        this.isDirty = true
                        this.checkIfShouldRestart()
                    },
                })
                // form.init()
            },
            { fireImmediately: true },
        )

        this.isInitialized = true
        return () => {
            _1()
            // _2()
            this.isInitialized = false
            // this.form?.cleanup?.() // 🔶
            this._form = null //  __FAIL('not loaded yet')
        }
    }
}
