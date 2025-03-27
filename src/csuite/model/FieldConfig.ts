import type { Box } from '../box/Box'
import type { IconName } from '../icons/IconName'
import type { TintExt } from '../kolor/Tint'
import type { CovariantFn } from '../variance/BivariantHack'
import type { CovariantFC } from '../variance/CovariantFC'
import type { Field } from './Field'
import type { FieldOptions } from './FieldOptions'
import type { FieldTag } from './FieldTag'
import type { Klass } from './KlassToUse'
import type { FieldReaction } from './pubsub/FieldReaction'
import type { Publication } from './pubsub/Producer'
import type { Problem_Ext } from './Validation'

export type FieldConfigFor<FIELD extends Field> = FieldConfig_CommonProperties<FIELD> & FIELD['…ownConfig']

export interface FieldConfig_CommonProperties<out FIELD extends Field> {
   readonly uiui?: RENDERER.UIConf<FIELD>
   /**
    * @since 2024-05-20
    * @stability beta
    * Icon name from the icon library.
    *   - "mdi..." for Material design icons - 7000+ icons https://pictogrammers.com/library/mdi/)
    *   - "cdi..." for Cushy design icons - 1+ custom icon by the cushy team
    *   - "ldi..." for Locomotive design icons
    */
   icon?: IconName | CovariantFn<[field?: FIELD], Maybe<IconName>>
   // ❌ warning: 2024-06-14 rvion: using this expression with an union here will
   // ❌ CHOKE typescript typechecking performances.
   // ❌ | icon?: IconName | CovariantFn<FIELD, IconName> // IconName

   /**
    * @since 2024-05-19
    * @stability beta
    * Appearance box props
    */
   box?: Box

   // --------------------------------
   /**
    * override the default header renderer
    * (passing `null` to restore the default renderer)
    */
   header?: null | CovariantFC<{ field: FIELD; readonly?: boolean }>

   /**
    * override the default body renderer
    * (passing `null` to restore the default renderer)
    */
   body?: null | CovariantFC<{ field: FIELD }>

   /**
    * override the default cell renderer
    * (passing `null` to restore the default renderer)
    */
   cell?: null | CovariantFC<{ field: FIELD }>

   /**
    * override the default string renderer
    * (passing `null` to restore the default renderer)
    * 🔴 2024-11-15 domi: was named `toString`, but it was conflicting with unrelated object's `toString` method
    */
   toString_?: null | CovariantFn<[field: FIELD], string>

   // --------------------------------

   /**
    * This function will be executed before every widget instanciation.
    * if the version is not the samed as store in the serial
    *
    * Note: serial param is unknown on purpose: it hasn't been sanitized yet, we need to be extra careful
    * @since 2024-05-14
    * @stability beta
    */
   beforeInit?(serial: unknown /* FIELD['…serial'] */): FIELD['…serial']
   version?: string

   /**
    * @since 2024-05-14
    * @stability beta
    * This function will be executed either on every widget instanciation.
    */
   onInit?(field: FIELD): void
   tags?: FieldTag[]

   /** will be called when value changed */
   onValueChange?(field: FIELD): void

   /** will be called when serial changed */
   onSerialChange?(self: FIELD): void

   /**
    * will be called before disposing the tree
    * @since 2024-07-11
    * @status NOT IMPLEMENTED
    * @experimental
    */
   onDispose?(field: FIELD): void

   /** allow to set custom actions on your widgets */
   presets?: WidgetMenuAction<FIELD>[]

   /** custom type checking;
    * valid:
    *  - true,
    *  - [],
    * invalid:
    *  - false,
    *  - ["errMsg", ...]
    *  - "errMsg"
    * */
   check?(val: FIELD): Problem_Ext

   /**
    * The label to display.
    * If none provided, the parent key is going to be converted as label.
    * - use false to disable
    * - use "" for an emtpy string label
    */
   label?: string | false

   /** The layout direction, H for 'horizontal' or V for 'vertical' */
   layout?: 'H' | 'V'

   /** if provided, will dispaly a tooltip when hovering over the label */
   tooltip?: string

   /**
    * Will be injected around the widget;
    * Allow you to customize look and feel a bit without having
    * to use custom widgets
    * */
   className?: string

   /**
    * [DEBUG FEATURE] show the ID right after the label
    * may be usefull when debugging dynamic widgets referencing themselves.
    */
   showID?: boolean

   /**
    * override the default `collapsed` status
    * only taken into account when widget is collapsible
    */
   startCollapsed?: boolean

   /**
    * @deprecated
    * if false, the widget will always be expanded */
   collapsed?: false

   /** if provided, override the default logic to decide if the widget need to be bordered */
   border?: TintExt

   /** if provided, override the default logic to decide if the widget need to be bordered */
   justifyLabel?: boolean

   /** if provided, widget will be hidden */
   hidden?: boolean

   /** unused internally, here so you can add whatever you want inside */
   custom?: unknown
   opts?: FIELD['…opts']

   // EXTENSION SYSMEM ------------------------------------------------------
   // csuite models have 3 main ways to be extends:
   //    1. custom sub-class via `classToUse`
   //    2. custom sub-class or something else via `builderToUse`

   /**
    * @internal
    * you probably DON'T want to specify this manually.
    * you can use the <schema>.useClass(...) method instead
    *
    * @since 2024-08-14
    * @stability beta
    */
   classToUse?: Klass<FIELD>

   // PUB-SUB SYSMEM ------------------------------------------------------

   /**
    * @internal
    * you probably DON'T want to specify this manually.
    * you can use the <schema>.publishToChannel(...) method instead
    *                          ^^^^^^^^^^^^^^^^
    * @since 2024-05-01
    * @stability beta
    */
   publications?: Publication<any, FIELD>[]

   /**
    * @internal
    * you probably DON'T want to specify this manually.
    * you can use the <schema>.addReaction(...) method instead
    *                          ^^^^^^^^^^^^^^^^
    */
   reactions?: FieldReaction<FIELD>[]

   /**
    * 2024-08-08 domi: not really used / thought through
    * mostly placeholders
    */
   required?: boolean
   readonly?: boolean

   instanciationOption?: FieldOptions
}

export interface WidgetMenuAction<FIELD extends Field> {
   /** https://pictogrammers.com/library/mdi/ */
   label: string
   icon?: IconName
   apply(field: FIELD): void
}
