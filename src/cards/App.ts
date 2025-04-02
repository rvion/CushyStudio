import type { CSchema } from '../controls/CSchema.cushy'
import type { RenderProps } from '../csuite-cushy/presenters/RenderProps'
import type { RenderRule, RenderRule_asList } from '../csuite-cushy/presenters/RenderRule'
import type { Field } from '../csuite/model/Field'
import type { SchemaDict } from '../csuite/model/SchemaDict'
import type { MediaImageL } from '../models/MediaImage'
import type { UnifiedCanvas } from '../panels/PanelCanvas/states/UnifiedCanvas'
import type { Runtime } from '../runtime/Runtime'
import type { AppMetadata } from './AppManifest'
import type { CSSProperties, ReactNode } from 'react'

// export const action = <const F extends WidgetDict>(name: string, t: Omit<Action<F>, 'name'>): Action<F> => ({ name, ...t })
/* 🛋️ */ export type GlobalFunctionToDefineAnApp = <const FIELD extends Field>(t: App<FIELD>) => AppRef<FIELD>
/* 🛋️ */ export type GlobalFunctionToDefineAView = <const P extends { [key: string]: any }>(
   t: CustomView<P>,
) => CustomViewRef<P>
/* 🛋️ */ export type GlobalGetCurrentRun = () => Runtime

/* shared */ export type GlobalGetBuilderFn = () => Z.Builder

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

export type $ExtractFormValueType<FIELDS extends SchemaDict> = { [k in keyof FIELDS]: FIELDS[k]['{value}'] }

export type CustomView<T = any> = {
   preview: (t: T) => ReactNode
   render: (t: T) => ReactNode
}

export type DraftExecutionContext = {
   image?: Maybe<MediaImageL>
   mask?: Maybe<MediaImageL>
   canvas?: Maybe<UnifiedCanvas>
}

export type AppUI<FIELD extends Field = Field> = (
   field: FIELD,
   set: {
      <F extends Field>(...props: RenderRule_asList<F>): void
      <F extends Field>(prop: RenderProps<FIELD>): void
   },
) => void

export type App<FIELD extends Field> = {
   /** app interface (GUI) */
   ui: (form: Z.Builder) => CSchema<FIELD>

   /**
    * Use that option to change the look of the form by using the set function
    *You can also use the `set` function both
    *   - to acumulate child ruules rules easilly
    *   - or to set the top-level UIProps
    */
   // prettier-ignore
   layout?: AppUI<FIELD>

   /** so you cana have fancy buttons to switch between a few things */
   presets?: Record<string, (doc: NoInfer<FIELD>) => void>

   /** app execution logic */
   run: (
      //
      runtime: Runtime<NoInfer<FIELD>>,
      value: NoInfer<FIELD>['{value}'],
      context: DraftExecutionContext,
      field: NoInfer<FIELD>,
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
