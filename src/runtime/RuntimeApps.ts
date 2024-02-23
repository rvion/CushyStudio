import type { CushyAppL } from 'src/models/CushyApp'

import { makeAutoObservable } from 'mobx'

import { Runtime, RuntimeExecutionResult } from './Runtime'
import { $ExtractFormValueType, AppRef, SchemaDict } from 'src/cards/App'
import { SQLITE_false } from 'src/db/SQLITE_boolean'

/** namespace for all Apps-related utils */
export class RuntimeApps {
    constructor(private rt: Runtime) {
        makeAutoObservable(this)
    }

    execute = <const FIELDS extends SchemaDict>(p: {
        //
        app: AppRef<FIELDS>
        formValue: $ExtractFormValueType<FIELDS>
        draftID?: string
    }): Promise<RuntimeExecutionResult> => {
        return this.executeByID_UNSAFE({
            appID: p.app.id,
            formValue: p.formValue,
            draftID: p.draftID,
        })
    }

    /** avoid using this if possible */
    executeByID_UNSAFE = async (p: {
        //
        appID: string
        formValue: any
        /**
         * - if missing
         *        | create a draft
         *        | (with a constant ID, so your draft tree is not poluted)
         *
         * - if given
         *    - if draft exists
         *        | will re-use the draft
         *        | update the form value
         *        | schedule the draft for execution
         *    - if draft don't exists
         *        | create the draft
         *        | update the form value
         *        | schedule the draft for execution
         */
        draftID?: string
    }): Promise<RuntimeExecutionResult> => {
        const app: CushyAppL = this.rt.Cushy.db.cushy_apps.getOrThrow(p.appID)
        const draft = this.rt.Cushy.db.drafts.getOrCreate(
            //
            p.draftID ?? `${p.appID}-<sub-draft>`,
            () => ({
                appID: app.id,
                // appParams is actually `serial`, not `value`
                // @ts-expect-error 🔴
                formSerial: {}, // 🔴 we can't go from `value` to `serial`
                title: '<sub-draft>',
            }),
        )
        try {
            const step = draft.start(p.formValue)
            const result = await step.finished
            return result
        } catch (e) {
            console.error(e)
            throw e
        }
    }
    //
}
