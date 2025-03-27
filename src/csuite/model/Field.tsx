import type { Field_list_ItemID, Field_list_serial } from '../fields/list/FieldList'
import type { Field_optional_serial } from '../fields/optional/FieldOptional'
import type { IconName } from '../icons/IconName'
import type { TintExt } from '../kolor/Tint'
import type { FieldAnomaly } from '../migration/Anomaly'
import type { ITreeElement } from '../tree/TreeEntry'
import type { AnyFieldSerial } from './EntitySerial'
import type { FieldConfigFor } from './FieldConfig'
import type {
   FieldConstructor,
   SchemaDictWithPaths,
   SerialMigrationFunction,
   UNVALIDATED,
} from './FieldConstructor'
import type { FieldId } from './FieldId'
import type { FieldSerialFor } from './FieldSerial'
import type { Channel, ChannelId } from './pubsub/Channel'
import type { Publication } from './pubsub/Producer'
import type { Repository } from './Repository'
import type { Transaction } from './Transaction'
import type { Problem, Problem_Ext } from './Validation'

import { produce, setAutoFreeze } from 'immer'
import _get from 'lodash/get'
import _set from 'lodash/set'
import _unset from 'lodash/unset'
import { computed, isObservable, observable, runInAction } from 'mobx'
import { nanoid } from 'nanoid'
import { type FC, type ReactNode, useMemo } from 'react'

import { csuiteConfig } from '../config/configureCsuite'
import { isHole } from '../fields/list/HOLE'
import {
   getFieldSharedClass,
   isFieldChoice,
   isFieldChoices,
   isFieldGroup,
   isFieldList,
   isFieldOptional,
   isProbablySerialList,
   isProbablySerialOptional,
   isProbablySomeFieldSerial,
   isProbablySomeFieldSerialOf,
} from '../fields/WidgetUI.DI'
import { hashJSONObjectToNumber } from '../hashUtils/hash'
import { type AnomalyMixin, AnomalyMixinDescriptors } from '../migration/Anomaly.mixin'
import { type SelectorMixin, SelectorMixinDescriptors } from '../selector/selector.mixin'
import { exhaust } from '../utils/exhaust'
import { getUIDForMemoryStructure } from '../utils/getUIDForMemoryStructure'
import { makeLabelFromPrimitiveValue } from '../utils/makeLabelFromFieldName'
import { FieldSym } from './$FieldSym'
import { autofixSerial_20240703 } from './autofix/autofixSerial_20240703'
import { autofixSerial_20240711 } from './autofix/autofixSerial_20240711'
import { CSchema, type WithConfigOptions } from './CSchema'
import { type CushyOnlyMixin, CushyOnlyMixinDescriptors } from './CushyOnly.mixin'
import { mkNewFieldId } from './FieldId'
import { type TraversalMixin, TraversalMixinDescriptors } from './FieldTraversal.mixin'
import {
   isPatchAdd,
   isPatchRemove,
   isPatchReplace,
   type Patch,
   type Patch_Common,
   type PatchAdd,
   type PatchRemove,
   type PatchReplace,
} from './Patch'
import { __ERROR, __OK, type Result } from './Result'
import { TreeEntry_Field } from './TreeEntry_Field'
import { normalizeProblem } from './Validation'
import { ValidationError } from './ValidationError'

/*
 * fact 1. mobx object can't be frozen;
 * fact 2. immer tries to freeze stuff
 * problem. yes.
 * solution: 👇
 */
setAutoFreeze(false)

/** make sure the user-provided function will properly react to any mobx changes */
export const useEnsureObserver = <T extends null | undefined | FC<any>>(fn: T): T => {
   return useMemo(() => ensureObserver(fn), [fn])
}

export type VALUE_MODE = 'fail' | 'zero' | 'unchecked' | 'set'

export const ensureObserver = <T extends null | undefined | FC<any>>(fn: T): T => {
   if (fn == null) return null as T
   const isObserver = '$$typeof' in fn && fn.$$typeof === Symbol.for('react.memo')
   const FmtUI = (isObserver ? fn : obs(fn)) as T
   return FmtUI
}

export type KeyedField = { key: string; field: Field }
export type FL_FieldPathExt = Tagged<string, 'FL_FieldPathExt'>
export type FL_FieldPath = Tagged<string, 'FL_FieldPath'>

export type FieldCtorProps<TYPES extends Field = any> = [
   repo: Repository,
   root: Field | null,
   parent: Field | null,
   schema: CSchema<TYPES>,
   initialMountKey: string,
   serial?: TYPES['Ҩserial'],
]

export type FieldCtorProps_ALT<TYPES extends Field = any> = [
   repo: Repository,
   root: Field | null,
   parent: Field | null,
   schema: CSchema<any>,
   initialMountKey: string,
   serial?: TYPES['Ҩserial'],
]

type PathObject = [string, Maybe<PathObject>]

/**
 * * private is too private
 * * symbols are too unpractical
 * * '$' is shown too early in the completion
 * * various utf8 characters used in the codebase as key
 *
 * metric to appreciate the char:
 *
 *    - is recognizable
 *    - does not look like a leter
 *    - is the same width as letter 'a' on most font (including default vscode one)
 *    - is placed at the end of the completion list
 *    - is not a common character (must not have been used in the codebase)
 *    - is written from left to right so selection works proely
 *
 * character tested:
 *
 *    - japanese chars > cool but too wide
 *    - syriac chars > many cool things that look like emojis but weird width
 *
 * good candidates:
 *
 * picked:
 *    - ⵜ (removed because too sad)
 *    - ϟ
 *
 * https://en.wikipedia.org/wiki/Theta
 * greek letters:
 *    - Ξ
 *    - π
 *    - Ω
 *    - ϟ 🟢
 *    - φ 🟢
 *
 *  https://en.wikipedia.org/wiki/O-hook
 * cyrilic letters
 *    - ж 🟢
 *    - Ҩ 🟢
 *    - ю
 */

export interface Field {
   Ҩtype: CATALOG.AllFieldTypes
   ҨownConfig: unknown
   ҨownSerial: unknown
   Ҩserial: FieldSerialFor<this>
   Ҩconfig: FieldConfigFor<this>
   Ҩvalue: unknown
   Ҩsetvalue: unknown
   Ҩunchecked: unknown
   Ҩchild: unknown
   Ҩopts: unknown
   ҨownPatch: Patch_Common<this['Ҩtype']>
   Ҩschema: CSchema<this>
}
export abstract class Field {
   // 2025-02-11 new addition

   /**
    * unique Field instance ID;
    * each node in the form tree has one;
    * NOT persisted in serial.
    * change every time the field is instantiated
    * @undecorated (can't change)
    */
   readonly ϟuid: FieldId

   /** widget serial is the full serialized representation of that widget  */
   @observable.ref accessor ϟserial: this['Ҩserial']

   /**
    * singleton repository for the project
    * allow access to global domain, as well as any other live field
    * and other shared resource
    * @undecorated (can't change)
    */
   readonly ϟrepo: Repository

   /**
    * root of the field tree this field belongs to
    * @undecorated (can't change)
    */
   readonly ϟroot: Field

   private _symField = Symbol.for('Field')

   /** parent field, (null when root) */
   @observable.ref accessor ϟparent: Field | null

   /** schema used to instanciate this widget */
   ϟschema: CSchema<this>

   get ϟopts2(): this['Ҩopts'] {
      return this.ϟconfig.opts!
   }

   constructor(
      /**
       * singleton repository for the project
       * allow access to global domain, as well as any other live field
       * and other shared resource
       */
      repo: Repository,
      /** root of the field tree this field belongs to */
      root: Field | null,
      /** parent field, (null when root) */
      parent: Field | null,
      /** schema used to instanciate this widget */
      schema: CSchema<any /* ❓ */>,
      initialMountKey: string,
      serial?: any /* ❓ */, // this['Ҩserial'],
   ) {
      this.ϟuid = mkNewFieldId()
      this.ϟrepo = repo
      this.ϟroot = root ?? this
      this.ϟparent = parent
      this.ϟschema = schema
      this.ϟserial = serial ?? this.ϟschema.defaultSerial
      this.ϟmountKey = initialMountKey
      this.ϟparent?.ϟacknowledgeNewChildSerial(initialMountKey, this.ϟserial)
   }

   /**
    * type of the field (e.g. 'str', 'color', 'group', 'optional', etc.)
    * Retrieved by looking in prototype for static `type` attribute.
    * @undecorated
    */
   get ϟtype(): this['Ҩtype'] {
      return (this.constructor as FieldConstructor<this>).type
   }

   /** @undecorated */
   private get ϟmigrateSerial_(): SerialMigrationFunction<this['Ҩserial']> {
      return (this.constructor as FieldConstructor<this>).migrateSerial
   }

   /**
    * widget value is the simple/easy-to-use representation of that widget
    * @undecorated
    */
   abstract ϟvalue: this['Ҩvalue']

   // 💬 2024-09-09 rvion:
   // | we can't actually use the following code to share get value() implementation
   // | because of mobx. Mobx force getters and setters to live on the same prototype.
   // |
   // | ```ts
   // | get value(): K['Ҩvalue'] {
   // |     return this.value_or_fail
   // | }
   // |
   // | set value(_newValue: K['Ҩvalue']) {
   // |     throw new Error(`❌ field_${this.type}.value = ... failed: setter not implemented`)
   // | }
   // | ```

   /**
    * crashes if the value is not set.
    * this method will NOT try to conjure any intented value.
    * @since 2024-09-03
    *
    * @see {@link ϟvalue_or_zero}
    * @see {@link ϟvalue_unchecked}
    */
   abstract ϟvalue_or_fail: this['Ҩvalue']

   /**
    * Should do its best to return a value,
    * conjuring some default value if necessary
    * but you may THROW if zero does not exists
    * 🔶 do not return null, unless the type allows you to
    * @since 2024-09-03
    *
    * @see {@link ϟvalue_or_fail}
    * @see {@link ϟvalue_unchecked}
    *
    **/
   abstract ϟvalue_or_zero: this['Ҩvalue']

   /**
     * this method
     *  - Always returns the advertized type (`Field['Ҩunchecked']`).
     *  - Never crashes
     *
     * @since 2024-09-03
     *
     * @see {@link ϟvalue_or_fail}
     * @see {@link ϟvalue_or_zero}

     */
   abstract ϟvalue_unchecked: this['Ҩunchecked']

   /**
    * Returns true if the given field has the same value as this field
    * (only possible if fields are of the same type)
    */
   abstract ϟisValueEqual(other: Field): boolean

   /**
    * you should NOT override this method.
    * you need to override the `generateOwnPatches`
    * @see ϟgenerateOwnPatches
    *
    * (TODO: since final is not a thing in TS; we may prevent this overridability; configurable: false, writable: false) => probbaly want to wait for decorators first)
    * @undecorated (pure producer)
    */
   public ϟgeneratePatches(referenceField: this): Patch_Common[] {
      const patches: Patch_Common[] = []
      if (this.ϟtype !== referenceField.ϟtype) {
         throw new Error(`Can't generate patches between fields of different types`)
         // what do we do here ? 🔴
         // case where it can happen:
         //   - hot reload ? different schema ? 🤔
         // return []
      }
      const ownPatches = this.ϟgenerateOwnPatches(referenceField)
      patches.push(...ownPatches)
      patches.push(...this.ϟgenerateChildrenPatches(referenceField))
      return patches
   }

   get ϟpatchedSerialPaths(): readonly string[] {
      return (this.constructor as FieldConstructor<this>).patchedSerialPaths
   }

   get ϟshorthash(): string {
      return getUIDForMemoryStructure(this.ϟserial)
   }
   /**
    * To be overwritten by subclasses to generate patches for the field itself
    * for special cases
    * @undecorated
    */
   protected ϟgenerateOwnPatches(referenceField: this): this['ҨownPatch'][] {
      if (this.ϟisValueEqual(referenceField)) return []

      return this.ϟpatchedSerialPaths.flatMap((serialPath): Patch<this['Ҩtype']>[] => {
         const thisValue = _get(this.ϟserial, serialPath)
         const referenceValue = _get(referenceField.ϟserial, serialPath)

         if (thisValue === referenceValue) return []

         if (thisValue === undefined) {
            return [
               {
                  op: 'remove',
                  fieldType: this.ϟtype,
                  fieldPath: this.ϟpath,
                  serialPath,
               } as PatchRemove<this['Ҩtype']>,
            ]
         }
         if (referenceValue === undefined) {
            return [
               {
                  op: 'add',
                  fieldType: this.ϟtype,
                  fieldPath: this.ϟpath,
                  serialPath,
                  value: thisValue,
               } as PatchAdd<this['Ҩtype'], unknown>,
            ]
         }

         return [
            {
               op: 'replace',
               fieldType: this.ϟtype,
               fieldPath: this.ϟpath,
               serialPath,
               value: thisValue,
            } as PatchReplace<this['Ҩtype'], unknown>,
         ]
      })
   }

   /**
    * generic implementation; must be overriden for every non-leaves
    * @undecorated (single action setter inside)
    */
   ϟset(x: this['Ҩsetvalue']): this {
      if (isProbablySomeFieldSerialOf(x, this.ϟtype)) this.ϟsetSerial(x as this['Ҩserial'])
      else if ((x as any) instanceof Field) this.ϟsetSerial((x as any).serial as this['Ҩserial'])
      else this.ϟsetValue(x)
      return this
   }

   /** @undecorated (pure getter function) */
   ϟgetSetValue(): this['Ҩsetvalue'] | undefined {
      // console.log(`[💀 getSetValue] `, this.path)
      return this.ϟvalue
   }

   /**
    * To be overwritten by subclasses to generate patches for children
    * @undecorated (pure getter)
    */
   protected ϟgenerateChildrenPatches(reference: this): Patch_Common[] {
      return this.ϟchildrenAll.flatMap((child) => {
         const referenceChild = reference.ϟgetChildByKey(child.ϟmountKey)

         if (referenceChild != null) {
            return child.ϟgeneratePatches(referenceChild as Field)
         }

         return []
      })
   }

   /** @undecorated (manual runInAction inside) */
   public ϟapplyPatches(patches: Patch_Common[]): void {
      const thisPatches = patches.filter(
         (patch) => patch.fieldPath === this.ϟpath && patch.fieldType === this.ϟtype,
      )
      runInAction(() => {
         this.ϟapplyOwnPatches(thisPatches)
         this.ϟapplyChildrenPatches(patches)
      })
   }

   /** @undecorated (manual runInAction inside) */
   protected ϟapplyOwnPatches(patches: this['ҨownPatch'][]): void {
      if (patches.length === 0) return
      runInAction(() => {
         const nextState = produce(this.ϟserial, (draft) => {
            patches.forEach((patch) => {
               if (isPatchReplace(patch) || isPatchAdd(patch)) {
                  _set(draft, patch.serialPath, patch.value)
               } else if (isPatchRemove(patch)) {
                  _unset(draft, patch.serialPath)
               } else {
                  throw new Error(`Unknown patch operation: ${patch.op}`)
               }
            })
         })
         this.ϟsetSerial(nextState)
      })
   }

   /** @undecorated (manual runInAction inside) */
   protected ϟapplyChildrenPatches(patches: Patch_Common[]): void {
      if (patches.length === 0) return

      runInAction(() => {
         this.ϟchildrenAll.forEach((child) => {
            const childPatches = patches.filter(
               (patch) => patch.fieldPath === child.ϟpath || patch.fieldPath.startsWith(`${child.ϟpath}.`),
            )
            if (childPatches.length > 0) {
               child.ϟapplyPatches(childPatches)
            }
         })
      })
   }

   /**
    * @since 2024-08-30
    * @stability beta
    * @undecorated (base function does nothing)
    */
   static migrateSerial(serial: Field['Ҩserial']): any {
      return serial
   }

   /**
    * @since 2025-02-13
    * should be overritten by every parent field.
    */
   static getChildren(config: any): SchemaDictWithPaths {
      return {}
   }

   /**
    * @since 2025-02-24
    * should be overritten by every parent field.
    */
   static getTravels(config: any): SchemaDictWithPaths {
      return this.getChildren(config)
   }

   /**
    * TODO later: make abstract to make sure we
    * have that on every single field + add field config option
    * to customize that. useful for tests.
    * @undecorated (base function does nothing)
    */
   ϟrandomize(): void {}

   // #region lifecycle

   /** field is already instanciated => probably used as a linked */
   ϟshared(): Z.Shared<this> {
      const FieldSharedClass = getFieldSharedClass()
      // 💬 2024-08-30 rvion:
      // | SimpleSchema usage is OK here, even if your project
      // | use a custom schema with extra methods; this is just some
      // | internal plumbing to allow to reuse fields from one tree
      // | in another tree as a linked/Shared field.
      // | 🟢            vvvvvvvvvvvv
      const schema = CSchema.new<any>(FieldSharedClass, { field: this })
      return schema
      // return schema.instanciate(repo, root, parent, serial)
   }

   /**
    * list of all functions to run at dispose time
    * allow for instance to register mobx disposers from reactions
    * and other similar stuff that may need to be cleaned up to
    * avoid memory leak.
    * @undecorated (will only be called at disposal time; no need to react on additions)
    */
   protected ϟdisposeFns: (() => void)[] = []

   /**
    * lifecycle method, is called
    *
    * @since 2024-07-05
    * @undecorated (this.repo.runInTransaction already wrapped in runInAction)
    */
   ϟdisposeTree(): void {
      this.ϟrunInTransaction((tct) => this.ϟ_disposeTree(tct))
   }

   /**
    * calls itself recursively
    * @undecorated (manual runInAction inside)
    */
   private ϟ_disposeTree(tct: Transaction): void {
      runInAction(() => {
         this.ϟ_disposeSelf(tct)

         // dispose all children
         for (const sub of this.ϟchildrenAll) {
            sub.ϟ_disposeTree(tct)
         }
      })
   }

   /** @undecorated (only called by _disposeTree above, which is wrapped in runInAction) */
   private ϟ_disposeSelf(tct: Transaction): void {
      // TODO:
      // - disable all publish
      // - disable all reactions
      // - mark as DELETED;  => makes most function throw an error if used

      // unregister from repo
      this.ϟrepo._unregisterField(this, tct)

      // dispose all reactions/other long-running stuff
      for (const disposeFn of this.ϟdisposeFns) {
         disposeFn()
      }
   }

   /**
    * will be set to true after the first initialization
    * TODO: also use that to wait for whole tree to be patched before applying effects
    * (may not need to be made observable; review this decision later)
    * */
   @observable accessor ϟready: boolean = false

   /**
    * if your field need to wait for the document to be ready;
    * this observable getter does that.
    *
    * @since 2024-09-04
    */
   get ϟisDocumentReady(): boolean {
      return this.ϟroot.ϟready
   }

   // #region Serial
   // The whole serial business goes this way
   //
   // `setSerial()`
   // | - start a transaction
   // | - calls `setOwnSerialWithValidationAndMigrationAndFixes()`
   // |   | - does validation, migration, autofixes
   // |   | - call `setOwnSerial()` (abstract method) <-- 🫵 you implement that
   // |   |    | - for leaf fields:
   // |   |    |   > you just swap the serial, and possibly apply default if need be
   // |   |    |
   // |   |    | - for parent fields:
   // |   |    |   > recursively swap serial pointers to new objects
   // |   |    |   > reconcilation happen
   //
   //    then serial is updated, you can now check probles

   /**
    * YOU PROBABLY DO NOT WANT TO OVERRIDE THIS
    * @undecorated (wrapped in runInTransaction, that is already an action)
    */
   ϟsetSerial(
      /** this serial may be from a previous schema; we need to be able to handle properly */
      serial: Maybe<this['Ҩserial']>,
   ): void {
      if (serial === this.ϟserial) return
      this.ϟrunInTransaction(() => {
         // this.copyCommonSerialFields(serial)
         this.ϟsetOwnSerialWithValidationAndMigrationAndFixes(serial)
      })
   }

   /**
    * NEVER CALL THIS FUNCTION YOURSELF
    *
    * This function can only be called by `setOwnSerialWithValidationAndMigration`
    * which itself can only be called by `init` and `setSerial`
    */
   protected abstract ϟsetOwnSerial(serial: this['Ҩserial']): void

   /**
     * contains the list of all serial problems that occured during the last setSerial
     * it only contains the **LAST** setSerial problems
     * => this list will be emptied everytime we call setSerial
     *
     * @see {@link ϟrecordSerialProblem}
     * @since 2024-09-11

     */
   ϟserialProblems: { msg: string; data: any }[] = []

   /**
    * Append a problem to the serialProblems list
    *
    * @see {@link ϟserialProblems}
    * @since 2024-09-11
    */
   ϟrecordSerialProblem = (msg: string, data: any): void => {
      this.ϟserialProblems.push({ msg, data })
   }

   /*

    // A. handle static migrateSerial function.
    // B. autofixes.
    // C. simple schema validation (check type only)
    // D. full serial validation.
    //    C.1. local validation, field by field
    //    C.2. global via generated zod-or-similar json schema

    */
   ϟsetOwnSerialWithValidationAndMigrationAndFixes(serialish: UNVALIDATED<Maybe<this['Ҩserial']>>): {
      problems: { msg: string; data: any }[]
   } {
      const wasNull = serialish == null
      let skipAutoFix: boolean = false
      let serial: object

      // #region 1.1. case `null` => use `defaultSerial`
      if (serialish == null) {
         this.ϟrecordSerialProblem(`serial is null, using defaultSerial`, serialish)
         serial = this.ϟschema.defaultSerial
         skipAutoFix = true
      }

      // #region 1.2. case not an object => use `defaultSerial`
      else if (typeof serialish !== 'object') {
         this.ϟrecordSerialProblem(`serial is not an object, using defaultSerial`, serialish)
         serial = this.ϟschema.defaultSerial
         skipAutoFix = true
      }

      // #region 1.3. empty object => use defaultSerial
      else if (Object.keys(serialish).length === 0) {
         this.ϟrecordSerialProblem(`serial is not an empty object, using defaultSerial`, serialish)
         serial = this.ϟschema.defaultSerial
         skipAutoFix = true
      }

      // #region 1.4. case object => use it
      else {
         serial = serialish
      }

      // #region 2. apply various generic auto-fixes
      if (!skipAutoFix) {
         // TODO: inline those methods in dedicated if blocs, and
         // TODO: make sure we're recording the problems with
         // TODO: appropriate serverity.
         // if (!isProbablySomeFieldSerial(serial!)) throw new Error(`invalid serial at '${this.path}'`)
         serial = autofixSerial_20240703(serial)
         serial = autofixSerial_20240711(serial)
      }

      // #region 3. run the static migrateSerial function from field
      // 🔶 this is probably wrong; and we probably need to get rid of it sooner than later.
      if (!wasNull) {
         const newSerial = this.ϟmigrateSerial_(serial)
         if (newSerial != null) serial = newSerial
      }

      // #region 4. Legacy (🔴!) run the heuristic migration function
      // 🔶 this is probably wrong; and we probably need to get rid of it sooner than later.
      // TODO: dispatch to various migrateSerial functions within fields themselves
      if (isProbablySomeFieldSerial(serial) && serial.$ !== this.ϟtype) {
         // ADDING LIST
         if (this.ϟtype === 'list') {
            const id = nanoid(6) as Field_list_ItemID
            const next: Field_list_serial<any> = {
               $: 'list',
               items_: [serial],
               keys: [id],
            }
            serial = next
         }

         // ADDING OPTIONAL
         else if (this.ϟtype === 'optional') {
            const next: Field_optional_serial<any> = {
               $: 'optional',
               y: serial,
            }
            serial = next
         }

         // REMOVING LIST
         else if (
            isProbablySerialList(serial) && //
            serial.items_ != null &&
            Array.isArray(serial.items_) &&
            serial.items_.length >= 1
         ) {
            const item0 = serial.items_[0]!
            if (isHole(item0)) throw new Error(`invalid serial at '${this.ϟpath}': hole found in list.`)
            serial = item0
         }

         // REMOVING OPTIONAL
         else if (
            isProbablySerialOptional(serial) && //
            serial.y != null
         ) {
            serial = serial.y
         }
      }

      // #region 5. Legacy (🔴!) migration system
      // 🔶 this is probably wrong; and we probably need to get rid of it sooner than later.
      if (this.ϟconfig.beforeInit != null) {
         const oldVersion = (serial as any)._version ?? 'default'
         const newVersion = this.ϟconfig.version ?? 'default'
         if (oldVersion !== newVersion) {
            serial = this.ϟconfig.beforeInit(serial)
            if (!isProbablySomeFieldSerial(serial)) throw new Error(`invalid serial`)
            serial._version = newVersion
         }
      }
      // #region 6. New migration system
      // TODO

      // #region 7. catch all phase
      if (!isProbablySomeFieldSerial(serial)) {
         console.error({ invalidSerial: serial })
         throw new Error(`invalid serial at '${this.ϟpath}'`)
      }
      if (isProbablySomeFieldSerial(serial) && serial.$ !== this.ϟtype) {
         console.log(`[🔶] INVALID SERIAL at ${this.ϟpath} (expected: ${this.ϟtype}, got: ${serial.$})`)
         console.log(`[🔶] INVALID SERIAL:`, JSON.stringify(serial))
         const anomaly: FieldAnomaly = {
            type: 'invalid-serial',
            date: Date.now(),
            path: this.ϟpath,
            pathExt: this.ϟpathExt,
            got: serialish as AnyFieldSerial,
         }
         if (this.ϟroot !== this) {
            this.ϟroot.ϟaddAnomaly(anomaly)
            serial = this.ϟschema.defaultSerial
         } else {
            serial = { ...this.ϟschema.defaultSerial /* ❌ */, anomalies: [anomaly] }
         }
      }

      // #region 8. final validation
      function ensureValid<T>(serial: any): T {
         return serial
         // TODO
      }
      const validSerial = ensureValid<this['Ҩserial']>(serial)

      // #region 9. set the now valid serial
      // 💬 2024-09-11 rvion: at this point, we should be able to guarantee that
      // | the serial is of the right type,
      // | the serial is well formed valid.
      // | no data has been discarded.
      // | all validation properly succeeed
      this.ϟsetOwnSerial(validSerial)
      return { problems: this.ϟserialProblems }
   }

   // private copyCommonSerialFields(s: Maybe<FieldSerial_CommonProperties>): void {
   //     if (s == null) return
   //     if (s._version != null) this.serial._version = s._version
   //     if (s.collapsed != null) this.serial.collapsed = s.collapsed
   //     if (s.custom != null) this.serial.custom = s.custom
   //     if (s.lastUpdatedAt != null) this.serial.lastUpdatedAt = s.lastUpdatedAt
   // }

   /** unified api to allow setting serial from value */
   ϟsetValue(val: this['Ҩvalue']): this {
      this.ϟvalue = val
      return this
   }

   ϟRECONCILE<SCHEMA extends CSchema>(p: {
      mountKey: string
      existingChild: Maybe<Field>
      correctChildSchema: SCHEMA
      /** the target child to clone/apply into child */
      targetChildSerial: Maybe<SCHEMA['Ҩserial']>
      /**
       * ONLY CALLED FOR NEW CHILD
       *
       * must attach/register both
       *  - child into parent where it belongs
       *  - child.serial into parent.serial where it belongs  */
      attach(child: SCHEMA['Ҩfield']): void
   }): void {
      let child = p.existingChild
      if (child != null && child.ϟschema === p.correctChildSchema) {
         child.ϟsetSerial(p.targetChildSerial)
      } else {
         if (child) child.ϟdisposeTree()
         child = p.correctChildSchema.instanciate(
            //
            this.ϟrepo,
            this.ϟroot,
            this,
            p.mountKey,
            p.targetChildSerial,
         )
         // attach child to current serial
         p.attach(child)
      }
   }

   // #region UI

   // #region UI HELPERS
   /** @deprecated with the new UI system */
   get ϟactualWidgetToDisplay(): Field {
      return this
   }

   get ϟindentChildren(): number {
      return 1
   }

   /** @deprecated ? with the new UI system */
   get ϟjustifyLabel(): boolean {
      if (this.ϟconfig.justifyLabel != null) return this.ϟconfig.justifyLabel
      return true
   }

   @computed get ϟdepth(): number {
      if (this.ϟparent == null) return 0
      return this.ϟparent.ϟdepth + this.ϟparent.ϟindentChildren
   }

   /** DO NOT OVERRIDE; used internally to properly schedule events */
   @computed get ϟtrueDepth(): number {
      if (this.ϟparent == null) return 0
      return this.ϟparent.ϟtrueDepth + 1
   }

   // #region ON/OFF

   /**
    * returns true if we can either `setOn` and `setOff` this field
    * @since 2024-09-03
    */
   @computed get ϟcanBeToggledWithinParent(): boolean {
      // if (isFieldOptional(this)) return true
      if (isFieldList(this.ϟparent)) return true
      if (isFieldOptional(this.ϟparent)) return true
      if (isFieldChoices(this.ϟparent)) return true
      if (isFieldChoice(this.ϟparent)) return false
      return false
   }

   /**
    * if parent can be toggled, sets the parent ON
    * throws otherwise
    * @since 2024-09-03
    * @undecorated (single child action)
    */
   ϟenableSelfWithinParent(): void {
      const parent = this.ϟparent
      if (isFieldOptional(parent)) return parent.setOn()
      if (isFieldChoices(parent)) return parent.enableBranch(this.ϟmountKey)
      if (isFieldChoice(parent)) return parent.enableBranch(this.ϟmountKey)
      throw new Error(
         `(${this.ϟtype}@'${this.ϟpath}').setOn: parent (${parent?.ϟtype}) is neither optional or choices`,
      )
   }

   /**
    * if parent can be toggled, sets the parent OFF
    * throws otherwise
    * @since 2024-09-03
    * @undecorated (single child action)
    */
   ϟdisableSelfWithinParent(): void {
      const parent = this.ϟparent
      if (isFieldOptional(parent)) return parent.setOff()
      if (isFieldList(parent)) return parent.removeItem(this)
      if (isFieldChoices(parent)) return parent.disableBranch(this.ϟmountKey)
      if (isFieldChoice(parent)) return parent.disableBranch(this.ϟmountKey)
      throw new Error(
         `(${this.ϟtype}@'${this.ϟpath}').setOff: parent (${parent?.ϟtype}) is neither optional or choices`,
      )
   }

   @computed get ϟisInsideDisabledBranch(): boolean {
      if (this.ϟparent == null) return false
      if (this.ϟparent.ϟisInsideDisabledBranch) return true
      if (isFieldOptional(this.ϟparent)) return this.ϟparent.ϟisDisabled
      if (isFieldChoices(this.ϟparent)) return this.ϟparent.isBranchDisabled(this.ϟmountKey)
      if (isFieldChoice(this.ϟparent)) return this.ϟparent.isBranchDisabled(this.ϟmountKey)
      return false
   }

   @computed get ϟisDisabledWithinParent(): boolean {
      return !this.ϟisEnabledWithinParent
   }

   @computed get ϟisEnabledWithinParent(): boolean {
      if (isFieldOptional(this.ϟparent)) return this.ϟparent.isActive
      if (isFieldChoices(this.ϟparent)) return this.ϟparent.isBranchEnabled(this.ϟmountKey)
      if (isFieldChoice(this.ϟparent)) return this.ϟparent.isBranchEnabled(this.ϟmountKey)
      return true
   }

   // #region Tree

   // abstract readonly id: string
   ϟasTreeElement(key: string): ITreeElement<{ widget: Field; key: string }> {
      return {
         key: (this as any).id,
         ctor: TreeEntry_Field as any,
         props: { key, widget: this as any },
      }
   }

   /**
    * shorthand access to schema.config
    * @undecorated (static, no need for mobx)
    */
   get ϟconfig(): this['Ҩconfig'] {
      return this.ϟschema.config
   }

   /** @undecorated (not an action; pure; defer to single computed) */
   ϟgetValue(mode: VALUE_MODE): this['Ҩvalue'] | this['Ҩunchecked'] {
      if (mode === 'fail') return this.ϟvalue_or_fail
      if (mode === 'zero') return this.ϟvalue_or_zero
      if (mode === 'unchecked') return this.ϟvalue_unchecked
      if (mode === 'set') return this.ϟgetSetValue()
      exhaust(mode)
   }

   /**
    * return true when widget has no child
    * return false when widget has one or more child
    * */
   get ϟhasNoChild(): boolean {
      return this.ϟchildrenAll.length === 0
   }

   /**
    * @since 2024-06-20
    * @status broken
    * return a short summary of changes from default
    */
   @computed get ϟdiffSummaryFromDefault(): string {
      return [
         this.ϟhasChanges //
            ? `${this.ϟpath}(${this.ϟvalue?.toString?.() ?? '.'})`
            : null,
         ...this.ϟchildrenAll.map((w) => w.ϟdiffSummaryFromDefault),
      ]
         .filter(Boolean)
         .join('\n')
   }

   /** path within the model */
   @computed get ϟpath(): FL_FieldPath {
      const p = this.ϟparent
      if (p == null) return '$'
      return p.ϟpath + '.' + this.ϟmountKey
   }

   @computed get ϟpathObject(): PathObject {
      return [this.ϟpath, this.ϟparent?.ϟpathObject]
   }

   /** path within the model */
   @computed get ϟpathExt(): FL_FieldPathExt {
      const p = this.ϟparent
      if (p == null) return `@${this.ϟtype}`
      return p.ϟpathExt + '.' + this.ϟmountKey + `@${this.ϟtype}`
   }

   ϟgetFieldAt(path: string): Maybe<Field> {
      const parts = path.split('.')
      // eslint-disable-next-line consistent-this
      let current: Maybe<Field> = this
      for (const part of parts) {
         if (part === '$') {
            current = this.ϟroot
            continue
         }
         current = current.ϟgetChildByKey(part) as Maybe<Field>
         if (current == null) return null
      }

      return current
   }

   ϟgetChildByKey(key: string): Maybe<this['Ҩchild']> {
      // TODO: more efficient overrides
      return this.ϟchildrenAll.find((f) => f.ϟmountKey === key)
   }

   @observable accessor ϟmountKey: string
   // get mountKey(): string {
   //     if (this.parent == null) return '$'
   //     if (this.parent.type === 'optional') return 'child' // hack for line below who is wrong
   //     return this.parent.subFieldsWithKeys.find(({ field }) => field === this)?.key ?? '<error>'
   // }

   /** collapse all children that can be collapsed */
   ϟcollapseAllChildren(): void {
      this.ϟrunInTransaction(() => {
         for (const _item of this.ϟchildrenAll) {
            // this allow to make sure we fold though optionals and similar constructs
            const item = _item.ϟactualWidgetToDisplay
            if (item.ϟserial.collapsed) continue
            const isCollapsible = item.ϟisCollapsible
            if (isCollapsible) item.ϟsetCollapsed(true)
         }
      })
   }

   ϟisOfType(...type: CATALOG.AllFieldTypes[]): boolean {
      return type.includes(this.ϟtype)
   }

   /** expand all children that can are collapsed */
   ϟexpandAllChildren(): void {
      this.ϟrunInTransaction(() => {
         for (const _item of this.ϟchildrenAll) {
            // this allow to make sure we fold though optionals and similar constructs
            const item = _item.ϟactualWidgetToDisplay
            item.ϟsetCollapsed(undefined)
         }
      })
   }

   // change management ------------------------------------------------
   /**
    *
    * RULES:
    * - every component should be able to be reset and must implement
    *   the reset function
    * - Reset MUST NEVER be called from the constructor
    * - RESET WILL TRIGGER VALUE/SERIAL update events.
    *
    * 2024-05-24 rvion: we could have some generic reset function that
    * | simply do a this.setValue(this.defaultValue)
    * | but it feels like a wrong implementation 🤔
    * | it's simpler  though
    * 🔶 some widget like `WidgetPrompt` would not work with such logic
    * */
   ϟreset(): void {
      runInAction(() => {
         this.ϟsetSerial(null)
         this.ϟtouched = false
      })
   }

   /** return a cloned/detached value object you can use anywhere without care */
   ϟtoValueJSON(): this['Ҩvalue'] {
      return JSON.parse(JSON.stringify(this.ϟvalue))
   }

   /** return a clone/detached serial object you can use anywhere without care */
   ϟtoSerialJSON(): this['Ҩserial'] {
      return this.ϟserial // JSON.parse(JSON.stringify(this.serial))
   }

   /** every child class must implement change detection from its default  */
   abstract readonly ϟhasChanges: boolean

   @observable private accessor ϟtouched_: boolean = false

   /** true when the field contains unsaved changes */
   get ϟtouched(): boolean {
      return this.ϟtouched_
   }

   set ϟtouched(val: boolean) {
      runInAction(() => {
         if (
            val === true && //
            this.ϟtouched_ !== val &&
            this.ϟparent !== this &&
            this.ϟparent != null
         ) {
            this.ϟparent.ϟtouched = true
         }

         this.ϟtouched_ = val
      })
   }
   /**
    * Identical to field.touched = true but easier to use when field is nullable
    */
   ϟtouch(): void {
      runInAction(() => {
         this.ϟtouched = true
      })
   }

   ϟtouchAll(): void {
      runInAction(() => {
         if (this.ϟchildrenAll.length === 0) this.ϟtouched = true

         for (const child of this.ϟchildrenAll) {
            child.ϟtouchAll()
         }
      })
   }

   /**
    * 2024-05-24 rvion: do we want some abstract defaultValue() too ?
    * feels like it's going to be PITA to use for higher level objects 🤔
    * but also... why not...
    * 🔶 some widget like `WidgetPrompt` would not work with such logic
    * 🔶 some widget like `Optional` have no simple way to retrieve the default value
    */
   // abstract readonly defaultValue: this['schema']['Ҩvalue'] |

   private $FieldSym: typeof FieldSym = FieldSym // DO NOT REMOVE

   /**
    * when this widget or one of its descendant publishes a value,
    * it will be stored here and possibly consumed by other descendants
    */
   @observable accessor ϟadvertisedValues: Record<ChannelId, any> = {}

   /**
    * when reading a publication, we will walk up the parent chain
    * and look for a value stored in the advsertised values.
    */
   ϟreadChannel<T extends any>(chan: Channel<T> | ChannelId): Maybe<T> /* 🔸: T | $EmptyChannel */ {
      const channelId = typeof chan === 'string' ? chan : chan.id
      let at = this as any as Field | null
      while (at != null) {
         if (channelId in at.ϟadvertisedValues) {
            return at.ϟadvertisedValues[channelId]
         }
         at = at.ϟparent
      }
      // console.warn(`[🪈] ${channelId} | not found from ${this.path}`)
      return null // $EmptyChannel
   }

   /**
    * return a short string summary that display the value in a simple way.
    * This method is expected to be overriden in most child classes
    */
   @computed get ϟsummary(): string {
      return JSON.stringify(this.ϟvalue)
   }

   /**
    * Retrive the config custom data.
    * 🔶: NOT TO BE CONFUSED WITH `getFieldCustom`
    * Config custom data is NOT persisted anywhere,
    * You can set config.custom when defining your schema.
    * This data is completely unused internally by CSuite.
    * It is READONLY.
    */
   ϟgetConfigCustom<T = unknown>(): Readonly<T> {
      return (
         this.ϟconfig.custom ?? //
         ({} as any)
      )
   }

   /**
    * Retrive the field custom data.
    * 🔶: NOT TO BE CONFUSED WITH `getConfigCustom`
    * Field custom data are persisted in the serial.custom.
    * This data is completely unused internally by CSuite.
    * You can use them however you want provided you keep them serializable.
    * It's just a quick/hacky place to store stuff
    */
   ϟgetFieldCustom<T = unknown>(): T {
      return this.ϟserial.custom
   }

   // will be easy to type/extend with the new type accumulator strategy when we backport
   get ϟcustom(): any {
      return this.ϟserial.custom
   }

   /**
    * update
    * You can either return a new value, or patch the initial value
    * use `deleteFieldCustomData` instead to replace the value by null or undefined.
    */
   ϟupdateFieldCustom(fn: (x: Maybe<this['Ҩvalue']>) => this['ϟcustom']): this {
      const prev = this.ϟvalue
      const next = fn(prev) ?? prev
      return this.ϟpatchInTransaction((draft) => {
         // 💬 2024-09-17 rvion:
         // | I'll assume that the custom data is already serializable...
         // | still wrong, but probably a bit less dangerous than naive deep-cloning it.
         draft.custom = next
         // draft.custom = JSON.parse(JSON.stringify(next))
      })
   }

   /** delete field custom data (delete this.serial.custom)  */
   ϟdeleteFieldCustomData(): this {
      return this.ϟpatchInTransaction((draft) => {
         delete draft.custom
      })
   }

   // 📌 ERROR / VALIDATION ---------------------------------------------------------------|

   // 🔶 TEMPORARY HACK UNTIL RENDER BRANCH
   ϟgetFieldUnchecked(): this {
      return this
   }

   /**
    * @since 2024-09-04
    * @category Validation
    */
   ϟvalidate(): Result<this, ValidationError> {
      this.ϟtouched = true
      if (!this.ϟisValid)
         return __ERROR(
            new ValidationError(
               `Validation failed for field ${this.ϟtype} at '${this.ϟpath}'`,
               this,
               this.ϟallErrorsIncludingChildrenErrors,
            ),
         )
      return __OK(this)
   }

   /**
    * helper function to chain things
    *
    * @since 2024-09-04
    * @category Validation
    * @see {@link validationOrThrow}
    */
   ϟvalidateOrNull(): Maybe<this> {
      this.ϟtouched = true
      if (!this.ϟisValid) return null
      return this
   }

   /**
    * helper function to chain things
    *
    * @since 2024-09-04
    * @category Validation
    * @see {@link ϟvalidateOrNull}
    */
   ϟvalidateOrThrow(): this {
      const res = this.ϟvalidate()
      if (!res.valid) throw res.error
      return this
   }

   /**
    * A field is `VALID` if and only if itself and its children (recursively)
    * - have no own errors
    * - are set
    *
    * an error is a problem with severity error.
    *
    * @category Validation
    * @since 2024-09-04
    */
   get ϟisValid(): boolean {
      return this.ϟallErrorsIncludingChildrenErrors.length === 0
   }

   /**
    * returns true if errors.length > 0
    * @category Validation
    */
   get ϟhasOwnErrors(): boolean {
      const errors = this.ϟownErrors
      return errors.length > 0
   }

   get ϟmustDisplayErrors(): boolean {
      return this.ϟhasOwnErrors && !this.ϟisInsideDisabledBranch
      return this.ϟhasOwnErrors
      return this.ϟhasOwnErrors && this.ϟtouched
   }
   /**
    * all own errors:
    *  + base/default (built-in field, e.g. minLength for string)
    *  + custom       (user-defined in config)
    * @category Validation
    */
   @computed get ϟownErrors(): Problem[] {
      const i18n = csuiteConfig.i18n
      // If we have a leaf Field, we add its "not set" error (isOwnSet)
      if (!this.ϟisOwnSet) {
         return [
            {
               path: this.ϟpath,
               message: i18n.err.field.not_set,
               longerMessage: `${i18n.err.field.not_set} (${this.ϟpathExt})`,
            },
         ]
      } else {
         return normalizeProblem(this, this.ϟownTypeSpecificProblems) //
            .concat(this.ϟownCustomConfigCheckProblems)
      }

      // return errors
   }

   /**
    * @category Validation
    */
   @computed get ϟallErrorsIncludingChildrenErrors(): Problem[] {
      const subErrs = this.ϟchildrenActive.flatMap((f) => f.ϟallErrorsIncludingChildrenErrors)
      if (subErrs.length === 0) return this.ϟownErrors

      const ownErrs = this.ϟownErrors
      if (ownErrs.length === 0) return subErrs

      return this.ϟownErrors.concat(subErrs)
   }

   /**
    * getter to retrieve the errors from the `check` function in the config.
    * ONLY returns errors from the `check` config
    *
    * 🔶 TODO: rename to "...."
    *
    * ```ts
    * b.int({ check: f => f.value % 3 ===0 })
    * ```
    * @category Validation
    */
   @computed get ϟownCustomConfigCheckProblems(): Problem[] {
      if (this.ϟconfig.check == null) return []
      const res = this.ϟconfig.check(this)
      return normalizeProblem(this, res)
      // return [...normalizeProblem(res), { message: 'foo' }]
   }

   /**
    * getter to retrieve the Errors specific to the Field Class
    *
    * e.g. Int will add an error if the value is floating.
    *
    * LAWS:
    *  - 1. must NOT include children-specific problems
    *  - 2. must NOT include problems from the shared `check` function in the config
    *  - 3. only least common ancestor can add problems ermerging from multiple children
    *
    * @category Validation
    */
   abstract readonly ϟownTypeSpecificProblems: Problem_Ext
   abstract readonly ϟownConfigSpecificProblems: Problem_Ext

   // -----------------------------------------------------------------------|
   /**
    * returns the list of all ancestors, NOT including self
    * @since 2024-07-08
    */
   @computed get ϟancestors(): Field[] {
      const result: Field[] = []
      let current: Maybe<Field> = this.ϟparent
      while (current) {
         result.push(current)
         current = current.ϟparent
      }
      return result
   }

   /**
    * returns the list of all ancestors, including self
    * @since 2024-07-08
    */
   @computed get ϟancestorsIncludingSelf(): Field[] {
      const result: Field[] = []
      // eslint-disable-next-line consistent-this
      let current: Maybe<Field> = this
      while (current) {
         result.push(current)
         current = current.ϟparent
      }
      return result
   }

   @computed get ϟdescendants(): Field[] {
      const result: Field[] = []
      for (const child of this.ϟchildrenAll) {
         result.push(child)
         result.push(...child.ϟdescendants)
      }
      return result
   }

   @computed get ϟdescendantsIncludingSelf(): Field[] {
      const result: Field[] = [this]
      for (const child of this.ϟchildrenAll) {
         result.push(child)
         result.push(...child.ϟdescendants)
      }
      return result
   }

   // BUMP ----------------------------------------------------
   private ϟ_extraSerialChangesFunction: ((self: Field) => void)[] = [] // 🔶 cannot (but probably need not) type self as K['Ҩfield'] due to variance issues
   ϟonSerialChanges(fn: (self: this) => void): this {
      this.ϟ_extraSerialChangesFunction.push(fn as any)
      return this
   }

   /**
    * every time a field serial is updated, we should call this function.
    * this function is called recursively upwards.
    * persistance will usually be done at the root field reacting to this event.
    */
   ϟ_applySerialUpdateEffects(): void {
      for (const fn of this.ϟ_extraSerialChangesFunction) fn(this)
      this.ϟconfig.onSerialChange?.(this)
      this.ϟconfig.onValueChange?.(this)
   }

   /**
    * this method can be heavily optimized
    * todo:
    *  - by storing the published value locally
    *  - by defining a getter on the _advertisedValues object of all parents
    *  - by only setting this getter up once.
    * */
   ϟrunPublications(this: Field): void {
      // 1. publications(broadcast upwards)
      const publications = this.ϟschema.publications
      if (publications.length === 0) return

      // 💬 2024-09-20 rvion:
      // | 🔴
      // | We need to write tests about that.
      // 💬 2024-12-30 rvion:
      // | seems like a good idea, but is actually a bad idea.
      // | it completely prevents us from beeing able to 'set' fields that require reading
      // | a parent publication to know the set of possible values.
      // | we need to add try-catch instead.
      // | 👇👇👇👇👇👇👇👇👇👇👇👇
      // ❌ if (!this.isSet) return
      if (!this.ϟisOwnSet)
         return console.log(`[🤠] skipping publication of ${this.ϟpathExt} because field is not set`)

      // Create and store values for every producer
      const producedValues: Record<ChannelId, any> = {}
      for (const publication of publications) {
         const channelId = typeof publication.chan === 'string' ? publication.chan : publication.chan.id
         if (publication.hoist) producedValues[channelId] = publication.produce(this)
         else this.ϟadvertisedValues[channelId] = publication.produce(this)
         // console.log(`[🪈] ${channelId} | ${this.path} is publishing`)
      }
      runInAction(() => {
         // Assign values to every parent widget in the hierarchy
         if (Object.keys(producedValues).length > 0) {
            let at = this as any as Field | null
            while (at != null) {
               Object.assign(at.ϟadvertisedValues, producedValues)
               at = at.ϟparent
            }
         }
      })
   }

   @computed get ϟisHidden(): boolean {
      if (this.ϟconfig.hidden != null) return this.ϟconfig.hidden
      if (isFieldGroup(this) && Object.keys(this.ϟfields).length === 0) return true
      return false
   }

   /** whether the widget should be considered inactive */
   @computed get ϟisDisabled(): boolean {
      return isFieldOptional(this) && !this.isActive
   }

   // #region UI
   // 💬 2024-09-11 rvion:
   // | UI section is a bit of a mess right now.
   // | it comes from the fact that originally, this library
   // | did not differenciate between the model and the view much.
   // | schema definition was also the place to write the UI.

   // #region UI.Fold
   /** @undecorated (single child action)  */
   ϟsetCollapsed(val?: boolean): void {
      if (this.ϟserial.collapsed === val) return
      this.ϟpatchInTransaction((draft) => {
         draft.collapsed = val
      })
   }

   /** @undecorated (single child action)  */
   ϟtoggleCollapsed(this: Field): void {
      this.ϟpatchInTransaction((draft) => {
         draft.collapsed = !draft.collapsed
      })
   }

   get ϟisCollapsedByDefault(): boolean {
      return false
   }

   @computed get ϟisCollapsed(): boolean {
      if (!this.ϟisCollapsible) return false
      if (this.ϟserial.collapsed != null) return this.ϟserial.collapsed
      if (this.ϟparent?.ϟisDisabled) return true
      return this.ϟisCollapsedByDefault ?? false
   }

   /**
    * if specified, overrides the default logic to decide if the widget need to be collapsible
    * @deprecated
    * 🔶 going to be removed ASAP
    */
   @computed get ϟisCollapsible(): boolean {
      // top level widget is not collapsible; we may want to revisit this decision
      // if (widget.parent == null) return false
      if (this.ϟconfig.collapsed != null) return this.ϟconfig.collapsed //
      if (this.ϟconfig.label === false) return false
      return true
   }

   /**
    * if provided, the default logic to decide if the widget need to be bordered
    * @deprecated
    */
   @computed get ϟborder(): TintExt {
      // avoif borders for the top level form
      if (this.ϟparent == null) return false
      // if (this.parent.subWidgets.length === 0) return false
      // if app author manually specify they want no border, then we respect that
      if (this.ϟconfig.border != null) return this.ϟconfig.border
      // if the widget do NOT have a body => we do not show the border
      // if (this.DefaultBodyUI == null) return false // 🔴 <-- probably a mistake here
      // default case when we have a body => we show the border
      return false
      // return 8
   }

   // #region UI.Render
   UI(props: RENDERER.FieldRenderArgs<this> = {}): ReactNode {
      // 💬 2024-10-17 ghusse:
      // | Spreading props here instead of passing them as a single object
      // | avoids useless refresh when the widget's parent is rerendered
      // | because the props object is recreated every time, even if
      // | the props themselves are the same.

      // 💬 2024-10-26 rvion:
      // | okay; so it it’s true-ish, but also probably deserve a quick discussion some day;
      // | since we probably want to have custom object comparer for key components like
      // | this one.
      // | relying on memo using Object.is to compare stuff is just wrong, and spread here
      // | just doesn’t fix much as soon as we pass down more complex props that include
      // | objects not beeing cached/made referentially stable in the parent component.

      // 💬 2024-10-17 ghusse:
      // | ⚠ props must be added first, to avoid circular references of field
      return <window.RENDERER.Render {...props} field={this} />
   }

   // 👉 use `UI`
   // | Render(props: RENDERER.FieldRenderArgs<this> = {}): ReactNode {
   // |    return this.UI(props)
   // | }

   // #region CHILDREN
   /**
    * @since 2024-12-11
    * return the serial path from the root to this field serial.
    * somewhat an internal method; usage should remain as low as possible.
    * @undecorated
    */
   ϟgetOwnSerialPathFromRoot(): string {
      const segments: string[] = []
      let at = this.ϟparent
      let key = this.ϟmountKey
      while (at != null) {
         segments.push(at.ϟgetChildrenSerialPath(key))
         at = at.ϟparent
         key = at?.ϟmountKey ?? '$'
      }
      return segments.reverse().join('.')
   }

   /**
    * need to be overwritten for all contaienr fields
    * @undecorated (placeholder made to be overriden)
    */
   ϟgetChildrenSerialPath(key: string): string {
      return `❌`
   }

   /**
    * list of all children fields that are technically in the in-memory instance tree
    * including those instanciated but only kept in a pending state, or those
    * that have been detached but are still registered as children from an internal
    * perspective
    *
    * use-cases: dispose-tree, etc, etc
    * if you just want to traverse the "active" part of the tree,
    * use `childrenActive` instead
    *
    * @since 2024-09-09
    * @remarks was previously named `subFields`
    * @undecorated (placeholder made to be overriden)
    */
   get ϟchildrenAll(): Field[] {
      return []
   }

   /**
    * list of all children that are logically part of the tree
    * use-cases: render, toValue, toSerial, various traversal, etc.
    *
    *
    * @since 2024-09-11
    * @remarks expected to be overriden in every field that have children that can be toggled,
    * like FIeldChoice, FieldOptional
    */
   get ϟchildrenActive(): Field[] {
      return this.ϟchildrenAll
   }

   // TODO: split subFields into two variants: active subFields, and childrenIncludingInactive
   // TODO: rename subFields into children
   //

   /**
    * list of all subwidgets, without named keys
    * @deprecated
    * we should be able to trust the `subField.mountKey`
    * // TODO: remove
    * @undecorated
    */
   get ϟsubFieldsWithKeys(): KeyedField[] {
      return []
   }

   // #region TRANSACTION
   /**
    * proxy this.repo.action
    * defined to shorted call and allow per-field override
    */
   ϟrunInTransaction<T>(fn: (tct: Transaction) => T): T {
      return this.ϟrepo.runInTransaction(fn)
   }

   /**
    * equivalent to `runInTransaction(() => patchSerial(() => {....}))`
    */
   ϟpatchInTransaction(fn: (draft: this['Ҩserial'], tct: Transaction) => undefined): this {
      this.ϟrunInTransaction((tct) => this.ϟpatchSerial((draft) => fn(draft, tct)))
      return this
   }

   /**
    * DO NOT OVERRIDE.
    * @internal
    */
   protected ϟassignNewSerial(next: this['Ҩserial']): void {
      const tct = this.ϟrepo.tct
      if (tct == null)
         throw new Error(
            '❌ patchSerial should be called within a transaction; you may want to use `patchInTransaction`',
         )

      // console.log(`[🤠] ${this.path}`, JSON.stringify(this.serial), JSON.stringify(next), this.serial === next)
      if (this.ϟserial === next) return
      runInAction(() => {
         tct.trackAsUpdated(this)
         this.ϟserial = next
         // this.__version__++
         this.ϟparent?.ϟacknowledgeNewChildSerial(this.ϟmountKey, this.ϟserial)
      })
   }

   /** @undecorated (we really don't need this anymore; legacy stuff; to remove) */
   // __version__: number = 1

   /**
    * equivalent to `produce`, followed by `assignNewSerial` (if something did change)
    *
    * return false when the lambda did not change the serial, and
    * true when serial has been updated by the lambda
    * @internal
    */
   ϟpatchSerial(
      //
      fn: (draft: this['Ҩserial']) => undefined,
      /*
       * cowe uld allow K['Ҩserial'] and hand it back to the caller
       * to match immerjs API
       * | fn: (serial: K['Ҩserial']) => undefined  | K['Ҩserial']
       */
   ): boolean {
      if (this.ϟrepo.tct == null)
         throw new Error(
            '❌ patchSerial should be called within a transaction; you may want to use `patchInTransaction`',
         )
      // console.log(`[🧑‍🦯‍➡️] patch serial called from ${this.pathExt}`)
      // from 2024-09-09, serial are not longer observable objects
      if (isObservable(this.ϟserial)) throw new Error('❌ serial should not be observable')

      // apply patch function
      const nextState = produce(this.ϟserial, fn)
      const stateChanged = nextState !== this.ϟserial // ⚠️ Ref equality check
      if (!stateChanged) return false // patch function did nothing; we can safely abort

      // otherwise, assign serial to current field, and bubble upwards to the document rot
      this.ϟassignNewSerial(nextState)
      return true
   }

   /**
    * if your field have children, you need to be able to acknolewdge
    * if they changed their serial.
    * don't forget to recursively call this method on this field's parent.
    *
    * (this method needs a true implementation in every field that use RECONCILE)
    */
   protected ϟacknowledgeNewChildSerial(mountKey: string, serial: any): boolean {
      throw new Error(`🔴 _acknowledgeNewChildSerial not implemented (${this.ϟpathExt})`)
   }

   // --------------------------------------------------------------------------------
   // 🔶 the 5 getters bellow are temporary hacks to make shared keep working
   // until every shared usage has been migrated

   /**
    * getter that resolve to `this.schema.producers`
    * @undecorated
    */
   get ϟproducers(): Publication<any, any>[] {
      return this.ϟschema.publications
   }

   /** probably the wrong place to retrieve that now that presenter are comming */
   get ϟicon(): Maybe<IconName> {
      const x = this.ϟschema.config.icon
      if (typeof x === 'function') return x(this)
      if (x == null) return null

      return x
   }

   private ϟhasBeenInitialized: boolean = false

   /** this function MUST be called at the end of every widget constructor */
   protected init(
      //
      serial?: this['Ҩserial'],
   ): void {
      // /* 😂 */ console.log(`[🤠] ${getUIDForMemoryStructure(serial)} (field.init)`)

      // 1. ensure field hasn't been initialized yet
      if (this.ϟhasBeenInitialized)
         return console.error(`[🔶] Field.init has already been called => ABORTING`)
      this.ϟhasBeenInitialized = true

      // 2. ...
      this.ϟrunInTransaction((tct) => {
         // this.copyCommonSerialFields(serial)
         this.ϟrepo._registerField(this, tct)

         //   VVVVVVVVVVVV this is where we hydrate children
         this.ϟsetOwnSerialWithValidationAndMigrationAndFixes(serial)

         this.UI = this.UI.bind(this)
         this.ϟready = true
      })
   }

   ϟcloneWithoutParent(): this {
      return this.ϟschema.create(this.ϟserial) as this
   }

   ϟcloneTheWholeTree(): this {
      const r = this.ϟroot.ϟcloneWithoutParent()
      return r.ϟgetFieldAt(this.ϟpath) as this
   }

   ϟcloneWithConfig(config: Partial<this['Ҩconfig']>, opts?: WithConfigOptions): this {
      return this.ϟschema.withConfig(config, opts).create(this.ϟserial) as this
   }

   ϟcodeForTypescriptValue(p?: { indent?: number }): string {
      return this.ϟschema.codeForTypescriptValue(p)
   }
   // ---------------------------------------------------------------

   @computed get ϟhasFoldableSubfieldsThatAreUnfolded(): boolean {
      return this.ϟchildrenAll.some((f) => f.ϟisCollapsible && !f.ϟserial.collapsed)
   }

   @computed get ϟhasFoldableSubfieldsThatAreFolded(): boolean {
      return this.ϟchildrenAll.some((f) => f.ϟisCollapsible && Boolean(f.ϟserial.collapsed))
   }

   @computed get ϟhasFoldableSubfields(): boolean {
      return this.ϟchildrenAll.some((f) => f.ϟisCollapsible)
   }

   ϟdeleteSnapshot(): void {
      this.ϟpatchInTransaction((draft) => {
         delete draft.snapshot
      })
   }

   // ['🤭caht'] = 1 // 🔶
   // ['-caht'] = 1; // 🔶
   // ['/chat'] = 1; // 🔶
   // ['Ҩchat'] = 1; // 🟢
   // ['ܔchat'] = 1;
   get ϟhasSnapshot(): boolean {
      return this.ϟserial.snapshot != null
   }

   /** update current field snapshot */
   ϟsaveSnapshot(): this['Ҩserial'] {
      const snapshot = produce(this.ϟserial, (draft) => {
         // a bad person would say: "Yo, Dawg; I heard you liked snapshots. So I put a snapshot in your snapshot, so you can snapshot while snapshotting"
         // but it's wrong. we don't want snapshotception.
         // so we delete the snapshot from the snapshot before it's too late.
         // otherwise, once we take a second snapshot, the first snapshot will indeed appear in the second snapshot.
         // Snapshot.
         delete draft.snapshot
      })
      this.ϟpatchInTransaction((draft) => void (draft.snapshot = snapshot))
      return snapshot
   }

   /** revert to the last snapshot */
   ϟrevertToSnapshot(): void {
      // 🔘 IX++
      // 🔘 console.log(`[🤠] #${IX} seri`, getUIDForMemoryStructure(this.serial))
      // 🔘 console.log(`[🤠] #${IX} snap`, getUIDForMemoryStructure(this.serial.snapshot))

      // 🔘 console.log(`[🤠] #${IX} seri.values`, getUIDForMemoryStructure(this.serial?.values))
      // 🔘 console.log(`[🤠] #${IX} snap.values`, getUIDForMemoryStructure(this.serial.snapshot?.values))
      if (this.ϟserial.snapshot == null) {
         // 🔘 console.log(`[🤠] #${IX} RESET`)
         return this.ϟreset()
      }
      // 🔘 console.log(`[🤠] #${IX} SNAP=`, deepCopyNaive(this.serial.snapshot))
      this.ϟsetSerial(this.ϟserial.snapshot)
   }

   get ϟisDirtyFromSnapshot_UNSAFE(): boolean {
      const { snapshot, ...currentSerial } = this.ϟserial
      if (snapshot == null) return false
      return hashJSONObjectToNumber(snapshot) !== hashJSONObjectToNumber(currentSerial)
   }

   get ϟhashSerial(): number {
      return hashJSONObjectToNumber(this.ϟserial)
   }

   abstract ϟisOwnSet: boolean

   /**
    * return true if and only if self and every descendant is set.
    * [not made to be overriden]
    */
   get ϟisSet(): boolean {
      if (!this.ϟisOwnSet) return false
      if (this.ϟchildrenActive.some((f) => !f.ϟisSet)) return false
      return true
   }

   get ϟlabelText(): string {
      if (this.ϟconfig.label == null) {
         const mountKey = this.ϟparent?.ϟtype === 'optional' ? this.ϟparent.ϟmountKey : this.ϟmountKey
         return makeLabelFromPrimitiveValue(mountKey)
      }
      if (this.ϟconfig.label === false) return '' // not sure about the config.label doc
      return this.ϟconfig.label
   }

   private ϟ_extraSaveChangesFunction: (() => Promise<void> | void)[] = []
   ϟonSaveChanges(fn: () => Promise<void> | void): void { this.ϟ_extraSaveChangesFunction.push(fn) } // prettier-ignore
   public async ϟsaveChanges(): Promise<void> {
      for (const fn of this.ϟ_extraSaveChangesFunction) await fn()
      this.ϟtouched = false
   }
}

// #region Mixins
export interface Field extends AnomalyMixin {}
Object.defineProperties(Field.prototype, AnomalyMixinDescriptors)

export interface Field extends SelectorMixin {}
Object.defineProperties(Field.prototype, SelectorMixinDescriptors)

export interface Field extends TraversalMixin {}
Object.defineProperties(Field.prototype, TraversalMixinDescriptors)

export interface Field extends CushyOnlyMixin {}
Object.defineProperties(Field.prototype, CushyOnlyMixinDescriptors)
