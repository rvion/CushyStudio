import type { SchemaDict } from '../csuite/model/IBlueprint'
import type { Model } from '../csuite/model/Model'
import type { MediaImageL } from '../models/MediaImage'
import type { UnifiedCanvas } from '../panels/Panel_Canvas/states/UnifiedCanvas'
import type { Runtime } from '../runtime/Runtime'
import type { AppMetadata } from './AppManifest'
import type { CSSProperties, ReactNode } from 'react'

// export const action = <const F extends WidgetDict>(name: string, t: Omit<Action<F>, 'name'>): Action<F> => ({ name, ...t })
/* 🛋️ */ export type GlobalFunctionToDefineAnApp = <const F extends SchemaDict>(t: App<F>) => AppRef<F>
/* 🛋️ */ export type GlobalFunctionToDefineAView = <const P extends { [key: string]: any }>(t: CustomView<P>) => CustomViewRef<P>
/* 🛋️ */ export type GlobalGetCurrentRun = () => Runtime

/* shared */ export type GlobalGetCurrentForm = () => X.FormBuilder

/* ⏰ */ export type ActionTagMethod = (arg0: string) => string
/* ⏰ */ export type ActionTagMethodList = Array<{ key: string; method: ActionTagMethod }>

export type ActionTags = (arg0: ActionTagMethodList) => void

export type AppRef<FIELDS> = {
    /** this is a virtual property; only here so app refs can carry the type-level form information. */
    $FIELDS: FIELDS
    /** app ID */
    id: CushyAppID
}

export type CustomViewRef<PARAMS> = {
    /** this is a virtual property; only here so view refs can carry the type-level view params. */
    $PARAMS: PARAMS
    /** app ID */
    id: CushyViewID
}

export type $ExtractFormValueType<FIELDS extends SchemaDict> = { [k in keyof FIELDS]: FIELDS[k]['$Value'] }

export type CustomView<T = any> = {
    preview: (t: T) => ReactNode
    render: (t: T) => ReactNode
}

export type DraftExecutionContext = {
    image?: Maybe<MediaImageL>
    mask?: Maybe<MediaImageL>
    canvas?: Maybe<UnifiedCanvas>
}

export type App<FIELDS extends SchemaDict> = {
    /** app interface (GUI) */
    ui: (form: X.FormBuilder) => FIELDS

    /** so you cana have fancy buttons to switch between a few things */
    presets?: Record<string, (form: Model<X.XGroup<NoInfer<FIELDS>>, X.FormBuilder>) => void>

    /** app execution logic */
    run: (
        //
        runtime: Runtime<NoInfer<FIELDS>>,
        formResult: { [k in keyof NoInfer<FIELDS>]: NoInfer<FIELDS>[k]['$Value'] },
        context: DraftExecutionContext,
    ) => void | Promise<void>

    /** if set to true, will register drafts to quick action in image context menu */
    canStartFromImage?: boolean

    /** the list of dependencies user can specify */
    metadata?: AppMetadata

    /** form container className */
    containerClassName?: string

    containerStyle?: CSSProperties

    // HELP ============================================================
    /** dependencies of your action */
    customNodeRequired?: string[]
    /** help text to show user when using their card */
    help?: string
}
