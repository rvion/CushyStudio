import type { Field_list_ItemID, Field_list_serial } from '../fields/list/FieldList'
import type { Field_optional_serial } from '../fields/optional/FieldOptional'
import type { IconName } from '../icons/IconName'
import type { TintExt } from '../kolor/Tint'
import type { FieldAnomaly } from '../migration/Anomaly'
import type { ITreeElement } from '../tree/TreeEntry'
import type { CovariantFn } from '../variance/BivariantHack'
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
import type { FieldReaction } from './pubsub/FieldReaction'
import type { Repository } from './Repository'
import type { Transaction } from './Transaction'
import type { Problem, Problem_Ext } from './Validation'

import { produce, setAutoFreeze } from 'immer'
import _get from 'lodash/get'
import _set from 'lodash/set'
import _unset from 'lodash/unset'
import { computed, isObservable, observable, reaction, runInAction } from 'mobx'
import { nanoid } from 'nanoid'
import { type DependencyList, type FC, type ReactNode, useCallback, useEffect, useMemo } from 'react'

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
import { FieldEvent, type FieldEvent_ } from './FieldEvent'
import { mkNewFieldId_v1 } from './FieldId'
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
   serial?: TYPES['{serial}'],
]

export type FieldCtorProps_ALT<TYPES extends Field = any> = [
   repo: Repository,
   root: Field | null,
   parent: Field | null,
   schema: CSchema<any>,
   initialMountKey: string,
   serial?: TYPES['{serial}'],
]

type PathObject = [string, Maybe<PathObject>]

export interface Field {
   '{type}': CATALOG.AllFieldTypes
   '{ownConfig}': unknown
   '{ownSerial}': unknown
   '{serial}': FieldSerialFor<this>
   '{config}': FieldConfigFor<this>
   '{value}': unknown
   '{setValue}': unknown
   '{unchecked}': unknown
   '{child}': unknown
   '{opts}': unknown
   '{ownPatch}': Patch_Common<this['{type}']>
   '{schema}': CSchema<this>
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
   readonly zUid: FieldId

   /** field serial is the full serialized representation of that field */
   @observable.ref accessor zSerial: this['{serial}']

   /**
    * singleton repository for the project
    * allow access to global domain, as well as any other live field
    * and other shared resource
    * @undecorated (can't change)
    */
   readonly zRepo: Repository

   /**
    * root of the field tree this field belongs to
    * @undecorated (can't change)
    */
   readonly zRoot: Field

   private _symField = Symbol.for('Field')

   /** parent field, (null when root) */
   @observable.ref accessor zParent: Field | null

   /** schema used to instanciate this field */
   zSchema: CSchema<this>

   get zOpts2(): this['{opts}'] {
      return this.zConfig.opts!
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
      /** schema used to instanciate this field */
      schema: CSchema<any /* ❓ */>,
      initialMountKey: string,
      serial?: any /* ❓ */, // this['{serial}'],
   ) {
      this.zUid = mkNewFieldId_v1()
      this.zRepo = repo
      this.zRoot = root ?? this
      this.zParent = parent
      this.zSchema = schema
      this.zSerial = serial ?? this.zSchema.defaultSerial
      this.zMountKey = initialMountKey
      this.zParent?.zAcknowledgeNewChildSerial(initialMountKey, this.zSerial)
   }

   /**
    * type of the field (e.g. 'str', 'color', 'group', 'optional', etc.)
    * Retrieved by looking in prototype for static `type` attribute.
    * @undecorated
    */
   get zType(): this['{type}'] {
      return (this.constructor as FieldConstructor<this>).type
   }

   private get zMigrateSerial_(): SerialMigrationFunction<this['{serial}']> {
      return (this.constructor as FieldConstructor<this>).migrateSerial
   }

   /**
    * field value is an easy-to-use representation of that field
    * not guaranteed to be the serializable,
    * [@see {@link zGetSetValue} for that]
    */
   abstract zValue: this['{value}']

   // 💬 2024-09-09 rvion:
   // | we can't actually use the following code to share get value() implementation
   // | because of mobx. Mobx force getters and setters to live on the same prototype.
   // |
   // | ```ts
   // | get value(): K['{value}'] {
   // |     return this.zValue_or_fail
   // | }
   // |
   // | set value(_newValue: K['{value}']) {
   // |     throw new Error(`❌ field_${this.type}.value = ... failed: setter not implemented`)
   // | }
   // | ```

   /**
    * crashes if the value is not set.
    * this method will NOT try to conjure any intented value.
    *
    * @see {@link zValue_or_zero}
    * @see {@link zValue_unchecked}
    */
   abstract zValue_or_fail: this['{value}']

   /**
    * Should do its best to return a value,
    * conjuring some default value if necessary
    * but you may THROW if zero does not exists
    * 🔶 do not return null, unless the type allows you to
    *
    * @see {@link zValue_or_fail}
    * @see {@link zValue_unchecked}
    *
    **/
   abstract zValue_or_zero: this['{value}']

   /**
     * this method
     *  - Always returns the advertized type (`Field['{unchecked}']`).
     *  - Never crashes
     *
     * @see {@link zValue_or_fail}
     * @see {@link zValue_or_zero}

     */
   abstract zValue_unchecked: this['{unchecked}']

   /**
    * Returns true if the given field has the same value as this field
    * (only possible if fields are of the same type)
    */
   abstract zIsValueEqual(other: Field): boolean

   /**
    * you should NOT override this method.
    * you need to override the `generateOwnPatches`
    * @see zGenerateOwnPatches
    *
    * (TODO: since final is not a thing in TS; we may prevent this overridability; configurable: false, writable: false) => probbaly want to wait for decorators first)
    * @undecorated (pure producer)
    */
   public zGeneratePatches(referenceField: this): Patch_Common[] {
      const patches: Patch_Common[] = []
      if (this.zType !== referenceField.zType) {
         throw new Error(`Can't generate patches between fields of different types`)
         // what do we do here ? 🔴
         // case where it can happen:
         //   - hot reload ? different schema ? 🤔
         // return []
      }
      const ownPatches = this.zGenerateOwnPatches(referenceField)
      patches.push(...ownPatches)
      patches.push(...this.zGenerateChildrenPatches(referenceField))
      return patches
   }

   get zPatchedSerialPaths(): readonly string[] {
      return (this.constructor as FieldConstructor<this>).patchedSerialPaths
   }

   get zShorthash(): string {
      return getUIDForMemoryStructure(this.zSerial)
   }

   // superFoo=1
   // יFoo=1
   // test(){
   //    this.foo
   // }

   /**
    * To be overwritten by subclasses to generate patches for the field itself
    * for special cases
    * @undecorated
    */
   protected zGenerateOwnPatches(referenceField: this): this['{ownPatch}'][] {
      if (this.zIsValueEqual(referenceField)) return []

      return this.zPatchedSerialPaths.flatMap((serialPath): Patch<this['{type}']>[] => {
         const thisValue = _get(this.zSerial, serialPath)
         const referenceValue = _get(referenceField.zSerial, serialPath)

         if (thisValue === referenceValue) return []

         if (thisValue === undefined) {
            return [
               {
                  op: 'remove',
                  fieldType: this.zType,
                  fieldPath: this.zPath,
                  serialPath,
               } as PatchRemove<this['{type}']>,
            ]
         }
         if (referenceValue === undefined) {
            return [
               {
                  op: 'add',
                  fieldType: this.zType,
                  fieldPath: this.zPath,
                  serialPath,
                  value: thisValue,
               } as PatchAdd<this['{type}'], unknown>,
            ]
         }

         return [
            {
               op: 'replace',
               fieldType: this.zType,
               fieldPath: this.zPath,
               serialPath,
               value: thisValue,
            } as PatchReplace<this['{type}'], unknown>,
         ]
      })
   }

   /**
    * generic implementation; must be overriden for every non-leaves
    * @undecorated (single action setter inside)
    */
   zSet(x: this['{setValue}']): this {
      if (isProbablySomeFieldSerialOf(x, this.zType)) this.zSetSerial(x as this['{serial}'])
      else if ((x as any) instanceof Field) this.zSetSerial((x as Field).zSerial as this['{serial}'])
      else this.zSetValue(x)
      return this
   }

   /** @undecorated (pure getter function) */
   zGetSetValue(): this['{setValue}'] | undefined {
      // console.log(`[💀 getSetValue] `, this.path)
      return this.zValue
   }

   /**
    * To be overwritten by subclasses to generate patches for children
    * @undecorated (pure getter)
    */
   protected zGenerateChildrenPatches(reference: this): Patch_Common[] {
      return this.zChildrenAll.flatMap((child) => {
         const referenceChild = reference.zGetChildByKey(child.zMountKey)

         if (referenceChild != null) {
            return child.zGeneratePatches(referenceChild as Field)
         }

         return []
      })
   }

   /** @undecorated (manual runInAction inside) */
   public zApplyPatches(patches: Patch_Common[]): void {
      const thisPatches = patches.filter(
         (patch) => patch.fieldPath === this.zPath && patch.fieldType === this.zType,
      )
      runInAction(() => {
         this.zApplyOwnPatches(thisPatches)
         this.zApplyChildrenPatches(patches)
      })
   }

   /** @undecorated (manual runInAction inside) */
   protected zApplyOwnPatches(patches: this['{ownPatch}'][]): void {
      if (patches.length === 0) return
      runInAction(() => {
         const nextState = produce(this.zSerial, (draft) => {
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
         this.zSetSerial(nextState)
      })
   }

   /** @undecorated (manual runInAction inside) */
   protected zApplyChildrenPatches(patches: Patch_Common[]): void {
      if (patches.length === 0) return

      runInAction(() => {
         this.zChildrenAll.forEach((child) => {
            const childPatches = patches.filter(
               (patch) => patch.fieldPath === child.zPath || patch.fieldPath.startsWith(`${child.zPath}.`),
            )
            if (childPatches.length > 0) {
               child.zApplyPatches(childPatches)
            }
         })
      })
   }

   /**
    * @stability beta
    * @undecorated (base function does nothing)
    */
   static migrateSerial(serial: Field['{serial}']): any {
      return serial
   }

   /** should be overritten by every parent field. */
   static getChildren(config: any): SchemaDictWithPaths {
      return {}
   }

   /** should be overritten by every parent field. */
   static getTravels(config: any): SchemaDictWithPaths {
      if (config.getCustomTravels != null)
         return {
            ...this.getChildren(config),
            ...config.getCustomTravels?.(),
         }
      return this.getChildren(config)
   }

   /**
    * TODO later: make abstract to make sure we
    * have that on every single field + add field config option
    * to customize that. useful for tests.
    * @undecorated (base function does nothing)
    */
   zRandomize(): void {}

   // #region lifecycle

   /** field is already instanciated => probably used as a linked */
   zShared(): Z.Shared<this> {
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
    *
    * todo: make lazy; will save an empty array per field.
    */
   protected zDisposeFns: (() => void)[] = []

   /**
    * lifecycle method, is called
    * @undecorated (this.repo.runInTransaction already wrapped in runInAction)
    */
   zDisposeTree(): void {
      this.zRunInTransaction((tct) => this.z_disposeTree(tct))
   }

   /**
    * calls itself recursively
    * @undecorated (manual runInAction inside)
    */
   private z_disposeTree(tct: Transaction): void {
      runInAction(() => {
         this.z_disposeSelf(tct)

         // dispose all children
         for (const sub of this.zChildrenAll) {
            sub.z_disposeTree(tct)
         }
      })
   }

   /** @undecorated (only called by _disposeTree above, which is wrapped in runInAction) */
   private z_disposeSelf(tct: Transaction): void {
      // TODO:
      // - disable all publish
      // - disable all reactions
      // - mark as DELETED;  => makes most function throw an error if used

      // unregister from repo
      this.zRepo._unregisterField(this, tct)

      // dispose all reactions/other long-running stuff
      for (const disposeFn of this.zDisposeFns) {
         disposeFn()
      }
   }

   /**
    * will be set to true after the first initialization
    * TODO: also use that to wait for whole tree to be patched before applying effects
    * (may not need to be made observable; review this decision later)
    * */
   @observable accessor zReady: boolean = false

   /**
    * if your field need to wait for the document to be ready;
    * this observable getter does that.
    */
   get zIsDocumentReady(): boolean {
      return this.zRoot.zReady
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
   zSetSerial(
      /** this serial may be from a previous schema; we need to be able to handle properly */
      serial: Maybe<this['{serial}']>,
   ): void {
      if (serial === this.zSerial) return
      this.zRunInTransaction(() => {
         // this.copyCommonSerialFields(serial)
         this.zSetOwnSerialWithValidationAndMigrationAndFixes(serial)
      })
   }

   /**
    * NEVER CALL THIS FUNCTION YOURSELF
    *
    * This function can only be called by `setOwnSerialWithValidationAndMigration`
    * which itself can only be called by `init` and `setSerial`
    */
   protected abstract zSetOwnSerial(serial: this['{serial}']): void

   /**
    * contains the list of all serial problems that occured during the last setSerial
    * it only contains the **LAST** setSerial problems
    * => this list will be emptied everytime we call setSerial
    *
    * @see {@link zRecordSerialProblem}
    */
   zSerialProblems: { msg: string; data: any }[] = []

   /**
    * Append a problem to the serialProblems list
    *
    * @see {@link zSerialProblems}
    */
   zRecordSerialProblem = (msg: string, data: any): void => {
      this.zSerialProblems.push({ msg, data })
   }

   /*

    // A. handle static migrateSerial function.
    // B. autofixes.
    // C. simple schema validation (check type only)
    // D. full serial validation.
    //    C.1. local validation, field by field
    //    C.2. global via generated zod-or-similar json schema

    */
   zSetOwnSerialWithValidationAndMigrationAndFixes(serialish: UNVALIDATED<Maybe<this['{serial}']>>): {
      problems: { msg: string; data: any }[]
   } {
      const wasNull = serialish == null
      let skipAutoFix: boolean = false
      let serial: object

      // #region 1.1. case `null` => use `defaultSerial`
      if (serialish == null) {
         this.zRecordSerialProblem(`serial is null, using defaultSerial`, serialish)
         serial = this.zSchema.defaultSerial
         skipAutoFix = true
      }

      // #region 1.2. case not an object => use `defaultSerial`
      else if (typeof serialish !== 'object') {
         this.zRecordSerialProblem(`serial is not an object, using defaultSerial`, serialish)
         serial = this.zSchema.defaultSerial
         skipAutoFix = true
      }

      // #region 1.3. empty object => use defaultSerial
      else if (Object.keys(serialish).length === 0) {
         this.zRecordSerialProblem(`serial is not an empty object, using defaultSerial`, serialish)
         serial = this.zSchema.defaultSerial
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
         const newSerial = this.zMigrateSerial_(serial)
         if (newSerial != null) serial = newSerial
      }

      // #region 4. Legacy (🔴!) run the heuristic migration function
      // 🔶 this is probably wrong; and we probably need to get rid of it sooner than later.
      // TODO: dispatch to various migrateSerial functions within fields themselves
      if (isProbablySomeFieldSerial(serial) && serial.$ !== this.zType) {
         // ADDING LIST
         if (this.zType === 'list') {
            const id = nanoid(6) as Field_list_ItemID
            const next: Field_list_serial<any> = {
               $: 'list',
               items_: [serial],
               keys: [id],
            }
            serial = next
         }

         // ADDING OPTIONAL
         else if (this.zType === 'optional') {
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
            if (isHole(item0)) throw new Error(`invalid serial at '${this.zPath}': hole found in list.`)
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
      if (this.zConfig.beforeInit != null) {
         const oldVersion = (serial as any)._version ?? 'default'
         const newVersion = this.zConfig.version ?? 'default'
         if (oldVersion !== newVersion) {
            serial = this.zConfig.beforeInit(serial)
            if (!isProbablySomeFieldSerial(serial)) throw new Error(`invalid serial`)
            serial._version = newVersion
         }
      }
      // #region 6. New migration system
      // TODO

      // #region 7. catch all phase
      if (!isProbablySomeFieldSerial(serial)) {
         console.error({ invalidSerial: serial })
         throw new Error(`invalid serial at '${this.zPath}'`)
      }
      if (isProbablySomeFieldSerial(serial) && serial.$ !== this.zType) {
         console.log(`[🔶] INVALID SERIAL at ${this.zPath} (expected: ${this.zType}, got: ${serial.$})`)
         console.log(`[🔶] INVALID SERIAL:`, JSON.stringify(serial))
         const anomaly: FieldAnomaly = {
            type: 'invalid-serial',
            date: Date.now(),
            path: this.zPath,
            pathExt: this.zPathExt,
            got: serialish as AnyFieldSerial,
         }
         if (this.zRoot !== this) {
            this.zRoot.zAddAnomaly(anomaly)
            serial = this.zSchema.defaultSerial
         } else {
            serial = { ...this.zSchema.defaultSerial /* ❌ */, anomalies: [anomaly] }
         }
      }

      // #region 8. final validation
      function ensureValid<T>(serial: any): T {
         return serial
         // TODO
      }
      const validSerial = ensureValid<this['{serial}']>(serial)

      // #region 9. set the now valid serial
      // 💬 2024-09-11 rvion: at this point, we should be able to guarantee that
      // | the serial is of the right type,
      // | the serial is well formed valid.
      // | no data has been discarded.
      // | all validation properly succeeed
      this.zSetOwnSerial(validSerial)
      return { problems: this.zSerialProblems }
   }

   /** unified api to allow setting serial from value */
   zSetValue(val: this['{value}']): this {
      this.zValue = val
      return this
   }

   zRECONCILE<SCHEMA extends CSchema>(p: {
      mountKey: string
      existingChild: Maybe<Field>
      correctChildSchema: SCHEMA
      /** the target child to clone/apply into child */
      targetChildSerial: Maybe<SCHEMA['{serial}']>
      /**
       * ONLY CALLED FOR NEW CHILD
       *
       * must attach/register both
       *  - child into parent where it belongs
       *  - child.serial into parent.serial where it belongs  */
      attach(child: SCHEMA['{field}']): void
   }): void {
      let child = p.existingChild
      if (child != null && child.zSchema === p.correctChildSchema) {
         child.zSetSerial(p.targetChildSerial)
      } else {
         if (child) child.zDisposeTree()
         child = p.correctChildSchema.instanciate(
            //
            this.zRepo,
            this.zRoot,
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
   get zActualWidgetToDisplay(): Field {
      return this
   }

   get zIndentChildren(): number {
      return 1
   }

   /** @deprecated ? with the new UI system */
   get zJustifyLabel(): boolean {
      if (this.zConfig.justifyLabel != null) return this.zConfig.justifyLabel
      return true
   }

   @computed get zDepth(): number {
      if (this.zParent == null) return 0
      return this.zParent.zDepth + this.zParent.zIndentChildren
   }

   /** DO NOT OVERRIDE; used internally to properly schedule events */
   @computed get zTrueDepth(): number {
      if (this.zParent == null) return 0
      return this.zParent.zTrueDepth + 1
   }

   // #region ON/OFF

   /**
    * returns true if we can either `setOn` and `setOff` this field
    */
   @computed get zCanBeToggledWithinParent(): boolean {
      // if (isFieldOptional(this)) return true
      // if (isFieldList(this.zParent)) return true
      if (isFieldOptional(this.zParent)) return true
      if (isFieldChoices(this.zParent)) return true
      if (isFieldChoice(this.zParent)) return false
      return false
   }

   /**
    * if parent can be toggled, sets the parent ON
    * throws otherwise
    * @undecorated (single child action)
    */
   zEnableSelfWithinParent(): void {
      const parent = this.zParent
      if (isFieldOptional(parent)) return parent.setOn()
      if (isFieldChoices(parent)) return parent.enableBranch(this.zMountKey)
      if (isFieldChoice(parent)) return parent.enableBranch(this.zMountKey)
      throw new Error(
         `(${this.zType}@'${this.zPath}').setOn: parent (${parent?.zType}) is neither optional or choices`,
      )
   }

   /**
    * if parent can be toggled, sets the parent OFF
    * throws otherwise
    * @undecorated (single child action)
    */
   zDisableSelfWithinParent(): void {
      const parent = this.zParent
      if (isFieldOptional(parent)) return parent.setOff()
      if (isFieldList(parent)) return parent.removeItem(this)
      if (isFieldChoices(parent)) return parent.disableBranch(this.zMountKey)
      if (isFieldChoice(parent)) return parent.disableBranch(this.zMountKey)
      throw new Error(
         `(${this.zType}@'${this.zPath}').setOff: parent (${parent?.zType}) is neither optional or choices`,
      )
   }

   @computed get zIsInsideDisabledBranch(): boolean {
      if (this.zParent == null) return false
      if (this.zParent.zIsInsideDisabledBranch) return true
      if (isFieldOptional(this.zParent)) return this.zParent.zIsDisabled
      if (isFieldChoices(this.zParent)) return this.zParent.isBranchDisabled(this.zMountKey)
      if (isFieldChoice(this.zParent)) return this.zParent.isBranchDisabled(this.zMountKey)
      return false
   }

   @computed get zIsDisabledWithinParent(): boolean {
      return !this.zIsEnabledWithinParent
   }

   @computed get zIsEnabledWithinParent(): boolean {
      if (isFieldOptional(this.zParent)) return this.zParent.isActive
      if (isFieldChoices(this.zParent)) return this.zParent.isBranchEnabled(this.zMountKey)
      if (isFieldChoice(this.zParent)) return this.zParent.isBranchEnabled(this.zMountKey)
      return true
   }

   // #region Tree

   // abstract readonly id: string
   zAsTreeElement(key: string): ITreeElement<{ widget: Field; key: string }> {
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
   get zConfig(): this['{config}'] {
      return this.zSchema.config
   }

   /** @undecorated (not an action; pure; defer to single computed) */
   zGetValue(mode: VALUE_MODE): this['{value}'] | this['{unchecked}'] {
      if (mode === 'fail') return this.zValue_or_fail
      if (mode === 'zero') return this.zValue_or_zero
      if (mode === 'unchecked') return this.zValue_unchecked
      if (mode === 'set') return this.zGetSetValue()
      exhaust(mode)
   }

   /**
    * return true when field has no child
    * return false when field has one or more child
    * */
   get zHasNoChild(): boolean {
      return this.zChildrenAll.length === 0
   }

   /**
    * @status broken
    * return a short summary of changes from default
    */
   @computed get zDiffSummaryFromDefault(): string {
      return [
         this.zHasChanges //
            ? `${this.zPath}(${this.zValue?.toString?.() ?? '.'})`
            : null,
         ...this.zChildrenAll.map((w) => w.zDiffSummaryFromDefault),
      ]
         .filter(Boolean)
         .join('\n')
   }

   /** path within the model */
   @computed get zPath(): FL_FieldPath {
      const p = this.zParent
      if (p == null) return '$'
      return p.zPath + '.' + this.zMountKey
   }

   @computed get zPathObject(): PathObject {
      return [this.zPath, this.zParent?.zPathObject]
   }

   /** path within the model */
   @computed get zPathExt(): FL_FieldPathExt {
      const p = this.zParent
      if (p == null) return `@${this.zType}`
      return p.zPathExt + '.' + this.zMountKey + `@${this.zType}`
   }

   zGetFieldAt(path: string): Maybe<Field> {
      const parts = path.split('.')
      // eslint-disable-next-line consistent-this
      let current: Maybe<Field> = this
      for (const part of parts) {
         if (part === '$') {
            current = this.zRoot
            continue
         }
         current = current.zGetChildByKey(part) as Maybe<Field>
         if (current == null) return null
      }

      return current
   }

   zGetChildByKey(key: string): Maybe<this['{child}']> {
      // TODO: more efficient overrides
      return this.zChildrenAll.find((f) => f.zMountKey === key)
   }

   @observable accessor zMountKey: string
   // get mountKey(): string {
   //     if (this.parent == null) return '$'
   //     if (this.parent.type === 'optional') return 'child' // hack for line below who is wrong
   //     return this.parent.subFieldsWithKeys.find(({ field }) => field === this)?.key ?? '<error>'
   // }

   /** collapse all children that can be collapsed */
   zCollapseAllChildren(): void {
      this.zRunInTransaction(() => {
         for (const _item of this.zChildrenAll) {
            // this allow to make sure we fold though optionals and similar constructs
            const item = _item.zActualWidgetToDisplay
            if (item.zSerial.collapsed) continue
            const isCollapsible = item.zIsCollapsible
            if (isCollapsible) item.zSetCollapsed(true)
         }
      })
   }

   zIsOfType(...type: CATALOG.AllFieldTypes[]): boolean {
      return type.includes(this.zType)
   }

   /** expand all children that can are collapsed */
   zExpandAllChildren(): void {
      this.zRunInTransaction(() => {
         for (const _item of this.zChildrenAll) {
            // this allow to make sure we fold though optionals and similar constructs
            const item = _item.zActualWidgetToDisplay
            item.zSetCollapsed(undefined)
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
    * 🔶 some field like `WidgetPrompt` would not work with such logic
    * */
   zReset(): void {
      runInAction(() => {
         this.zSetSerial(null)
         this.zTouched = false
      })
   }

   /** return a cloned/detached value object you can use anywhere without care */
   zToValueJSON(): this['{value}'] {
      return JSON.parse(JSON.stringify(this.zValue))
   }

   /** return a clone/detached serial object you can use anywhere without care */
   zToSerialJSON(): this['{serial}'] {
      return this.zSerial // JSON.parse(JSON.stringify(this.serial))
   }

   /** every child class must implement change detection from its default  */
   abstract readonly zHasChanges: boolean

   @observable private accessor zTouched_: boolean = false

   /** true when the field contains unsaved changes */
   get zTouched(): boolean {
      return this.zTouched_
   }

   set zTouched(val: boolean) {
      runInAction(() => {
         if (
            val === true && //
            this.zTouched_ !== val &&
            this.zParent !== this &&
            this.zParent != null
         ) {
            this.zParent.zTouched = true
         }

         this.zTouched_ = val
      })
   }
   /** Identical to field.touched = true but easier to use when field is nullable */
   zTouch(): void {
      runInAction(() => void (this.zTouched = true))
   }

   zTouchAll(): void {
      runInAction(() => {
         if (this.zChildrenAll.length === 0) this.zTouched = true
         for (const child of this.zChildrenAll) child.zTouchAll()
      })
   }

   private $FieldSym: typeof FieldSym = FieldSym // DO NOT REMOVE

   /**
    * when this field or one of its descendant publishes a value,
    * it will be stored here and possibly consumed by other descendants
    */
   protected readonly zAdvertisedValues: Record<ChannelId, any> = observable({})
   protected readonly zLurkers: Map<ChannelId, ((val: any) => void)[]> = new Map()

   /**
    * when reading a publication, we will walk up the parent chain
    * and look for a value stored in the advsertised values.
    */
   zReadChannel<T extends any>(chan: Channel<T> | ChannelId): Maybe<T> /* 🔸: T | $EmptyChannel */ {
      const channelId = typeof chan === 'string' ? chan : chan.id
      let at = this as any as Field | null
      while (at != null) {
         if (channelId in at.zAdvertisedValues) {
            return at.zAdvertisedValues[channelId]
         }
         at = at.zParent
      }
      // console.warn(`[🪈] ${channelId} | not found from ${this.path}`)
      return null // $EmptyChannel
   }

   /**
    * return a short string summary that display the value in a simple way.
    * This method is expected to be overriden in most child classes
    */
   @computed get zSummary(): string {
      return JSON.stringify(this.zValue)
   }

   /**
    * Retrive the config custom data.
    * 🔶: NOT TO BE CONFUSED WITH `getFieldCustom`
    * Config custom data is NOT persisted anywhere,
    * You can set config.custom when defining your schema.
    * This data is completely unused internally by CSuite.
    * It is READONLY.
    */
   zGetConfigCustom<T = unknown>(): Readonly<T> {
      return (
         this.zConfig.custom ?? //
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
   zGetFieldCustom<T = unknown>(): T {
      return this.zSerial.custom
   }

   // will be easy to type/extend with the new type accumulator strategy when we backport
   get zCustom(): any {
      return this.zSerial.custom
   }

   /**
    * update
    * You can either return a new value, or patch the initial value
    * use `deleteFieldCustomData` instead to replace the value by null or undefined.
    */
   zUpdateFieldCustom(fn: (x: Maybe<this['{value}']>) => this['zCustom']): this {
      const prev = this.zValue
      const next = fn(prev) ?? prev
      return this.zPatchInTransaction((draft) => {
         // 💬 2024-09-17 rvion:
         // | I'll assume that the custom data is already serializable...
         // | still wrong, but probably a bit less dangerous than naive deep-cloning it.
         draft.custom = next
         // draft.custom = JSON.parse(JSON.stringify(next))
      })
   }

   /** delete field custom data (delete this.serial.custom)  */
   zDeleteFieldCustomData(): this {
      return this.zPatchInTransaction((draft) => {
         delete draft.custom
      })
   }

   // 📌 ERROR / VALIDATION ---------------------------------------------------------------|

   // 🔶 TEMPORARY HACK UNTIL RENDER BRANCH
   zGetFieldUnchecked(): this {
      return this
   }

   /**
    * @category Validation
    */
   zValidate(): Result<this, ValidationError> {
      this.zTouched = true
      if (!this.zIsValid)
         return __ERROR(
            new ValidationError(
               `Validation failed for field ${this.zType} at '${this.zPath}'`,
               this,
               this.zAllErrorsIncludingChildrenErrors,
            ),
         )
      return __OK(this)
   }

   /**
    * helper function to chain things
    *
    * @category Validation
    * @see {@link validationOrThrow}
    */
   zValidateOrNull(): Maybe<this> {
      this.zTouched = true
      if (!this.zIsValid) return null
      return this
   }

   /**
    * helper function to chain things
    *
    * @category Validation
    * @see {@link zValidateOrNull}
    */
   zValidateOrThrow(): this {
      const res = this.zValidate()
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
    */
   get zIsValid(): boolean {
      return this.zAllErrorsIncludingChildrenErrors.length === 0
   }

   /**
    * returns true if errors.length > 0
    * @category Validation
    */
   get zHasOwnErrors(): boolean {
      const errors = this.zOwnErrors
      return errors.length > 0
   }

   get zMustDisplayErrors(): boolean {
      return this.zHasOwnErrors && !this.zIsInsideDisabledBranch
      return this.zHasOwnErrors
      return this.zHasOwnErrors && this.zTouched
   }
   /**
    * all own errors:
    *  + base/default (built-in field, e.g. minLength for string)
    *  + custom       (user-defined in config)
    * @category Validation
    */
   @computed get zOwnErrors(): Problem[] {
      const i18n = csuiteConfig.i18n
      // If we have a leaf Field, we add its "not set" error (isOwnSet)
      if (!this.zIsOwnSet) {
         return [
            {
               path: this.zPath,
               message: i18n.err.field.not_set,
               longerMessage: `${i18n.err.field.not_set} (${this.zPathExt})`,
            },
         ]
      } else {
         return normalizeProblem(this, this.zOwnTypeSpecificProblems) //
            .concat(this.zOwnCustomConfigCheckProblems)
      }

      // return errors
   }

   /**
    * @category Validation
    */
   @computed get zAllErrorsIncludingChildrenErrors(): Problem[] {
      const subErrs = this.zChildrenActive.flatMap((f) => f.zAllErrorsIncludingChildrenErrors)
      if (subErrs.length === 0) return this.zOwnErrors

      const ownErrs = this.zOwnErrors
      if (ownErrs.length === 0) return subErrs

      return this.zOwnErrors.concat(subErrs)
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
   @computed get zOwnCustomConfigCheckProblems(): Problem[] {
      if (this.zConfig.check == null) return []
      const res = this.zConfig.check(this)
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
   abstract readonly zOwnTypeSpecificProblems: Problem_Ext
   abstract readonly zOwnConfigSpecificProblems: Problem_Ext

   // -----------------------------------------------------------------------|
   /**
    * returns the list of all ancestors, NOT including self
    */
   @computed get zAncestors(): Field[] {
      const result: Field[] = []
      let current: Maybe<Field> = this.zParent
      while (current) {
         result.push(current)
         current = current.zParent
      }
      return result
   }

   /**
    * returns the list of all ancestors, including self
    */
   @computed get zAncestorsIncludingSelf(): Field[] {
      const result: Field[] = []
      // eslint-disable-next-line consistent-this
      let current: Maybe<Field> = this
      while (current) {
         result.push(current)
         current = current.zParent
      }
      return result
   }

   @computed get zDescendants(): Field[] {
      const result: Field[] = []
      for (const child of this.zChildrenAll) {
         result.push(child)
         result.push(...child.zDescendants)
      }
      return result
   }

   @computed get zDescendantsIncludingSelf(): Field[] {
      const result: Field[] = [this]
      for (const child of this.zChildrenAll) {
         result.push(child)
         result.push(...child.zDescendants)
      }
      return result
   }

   // BUMP ----------------------------------------------------
   private z_extraSerialChangesFunction: ((self: Field) => void)[] = [] // 🔶 cannot (but probably need not) type self as K['{field}'] due to variance issues
   zOnSerialChanges(fn: (self: this) => void): this {
      this.z_extraSerialChangesFunction.push(fn as any)
      return this
   }

   /**
    * every time a field serial is updated, we should call this function.
    * this function is called recursively upwards.
    * persistance will usually be done at the root field reacting to this event.
    */
   zApplySerialUpdateEffects(): void {
      for (const fn of this.z_extraSerialChangesFunction) fn(this)
      this.zConfig.onSerialChange?.(this)
      this.zConfig.onValueChange?.(this)
   }

   zSetupSubscriptions(): void {
      if (this.zConfig.subscriptions == null) return
      if (this.zConfig.subscriptions.length === 0) return
      // for every subscription
      for (const sub of this.zConfig.subscriptions) {
         // get chanelID
         const channelId = typeof sub.channel === 'string' ? sub.channel : sub.channel.id

         // build a memory-stable effect lambda (bind effect to this)
         const effect = (val: any): void => sub.effect(val, this)

         // then walk ancestor chain
         anc: for (const parent of this.zAncestors) {
            // and register self as lurker
            const prev = parent.zLurkers.get(channelId)
            if (prev == null) parent.zLurkers.set(channelId, [effect])
            else prev.push(effect)

            // if parent already has a published value,
            const alreadyHasAPublishedValue = channelId in parent.zAdvertisedValues
            if (alreadyHasAPublishedValue) {
               // we run the effect immediately
               effect(parent.zAdvertisedValues[channelId])

               // and we stop, because assume we'll never read any
               // channel value from any field above in the field tree
               break anc
            }
         }
      }
   }

   /**
    * this method might be optimized
    *  - by storing the published value locally
    *  - by defining a getter on the _advertisedValues object of all parents
    *  - by only setting this getter up once.
    * but ALSO MAYBE NOT; need to double check mobx interractions
    * */

   zRunPublications(mode: FieldEvent_): void {
      const publicationsAll = this.zConfig.publications
      if (publicationsAll == null) return

      const publications = publicationsAll.filter((p) => p.on === mode)
      if (publications.length === 0) return

      // 💬 2024-12-30 rvion:
      // | seems like a good idea, but is actually a bad idea.
      // | it completely prevents us from beeing able to 'set' fields that require reading
      // | a parent publication to know the set of possible values.
      // | we need to add try-catch instead.
      // if (!this.isSet) return console.log(`[🤠] skipping publication of ${this.pathExt} because field is not set`)
      // if (!this.isOwnSet) return console.log(`[🤠] skipping publication of ${this.pathExt} because field is not ownSet`)

      // 💬 2025-04-03 rvion:
      // | lurkerdNotified is a set of effects.
      // | effects should be stable per field, so it's a bit like checking we've
      // |
      // | -> bug-I-went-though-1. de-duplicating by field will cause misses when
      // |    (A publish x1 and x2, both beeing subscribed by B)
      // |
      // | -> bug-I-went-though-2. storing anything else than the effect in the _lurkers
      // |    map is less efficient
      // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      const lurkerdNotified = new Set<Function>()

      // Create and store values for every producer
      for (const publication of publications) {
         if (publication.onlyIfSet && !this.zIsSet) continue
         if (publication.onlyIfOwnSet && !this.zIsOwnSet) continue
         if (publication.onlyIfValid && !this.zIsValid) continue

         const channelId =
            typeof publication.chan === 'string' //
               ? publication.chan
               : publication.chan.id

         const value = publication.produce(this)
         const publishTo = (field: Field): void => {
            // update value in `_advertisedValues`
            field.zAdvertisedValues[channelId] = value

            // notify lurkers directly without waiting for mobx transaction
            const lurkers = field.zLurkers.get(channelId)
            if (lurkers == null) return
            for (const lurker of lurkers) {
               // TODO: if no in-between fields between this lurker and us has ....
               if (lurkerdNotified.has(lurker)) continue
               lurkerdNotified.add(lurker)
               lurker(value)
            }
         }

         // if hoist, publish
         const hoist = publication.hoist
         let reach =
            typeof hoist === 'number'
               ? hoist // number
               : hoist // boolean
                 ? Infinity
                 : 0

         // eslint-disable-next-line consistent-this
         let at: Maybe<Field> = this
         while (at != null && reach-- >= 0) {
            publishTo(at)
            at = at.zParent
         }
      }
   }

   @computed get zIsHidden(): boolean {
      if (this.zConfig.hidden != null) return this.zConfig.hidden
      if (isFieldGroup(this) && Object.keys(this.zFields).length === 0) return true
      return false
   }

   /** whether the field should be considered inactive */
   @computed get zIsDisabled(): boolean {
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
   zSetCollapsed(val?: boolean): void {
      if (this.zSerial.collapsed === val) return
      this.zPatchInTransaction((draft) => {
         draft.collapsed = val
      })
   }

   /** @undecorated (single child action)  */
   zToggleCollapsed(this: Field): void {
      this.zPatchInTransaction((draft) => {
         draft.collapsed = !draft.collapsed
      })
   }

   get zIsCollapsedByDefault(): boolean {
      return false
   }

   @computed get zIsCollapsed(): boolean {
      if (!this.zIsCollapsible) return false
      if (this.zSerial.collapsed != null) return this.zSerial.collapsed
      if (this.zParent?.zIsDisabled) return true
      return this.zIsCollapsedByDefault ?? false
   }

   /**
    * if specified, overrides the default logic to decide if the field need to be collapsible
    * @deprecated
    * 🔶 going to be removed ASAP
    */
   @computed get zIsCollapsible(): boolean {
      // top level field is not collapsible; we may want to revisit this decision
      // if (widget.parent == null) return false
      if (this.zConfig.collapsed != null) return this.zConfig.collapsed //
      if (this.zConfig.label === false) return false
      return true
   }

   /**
    * if provided, the default logic to decide if the field need to be bordered
    * @deprecated
    */
   @computed get zBorder(): TintExt {
      // avoif borders for the top level form
      if (this.zParent == null) return false
      // if (this.parent.subWidgets.length === 0) return false
      // if app author manually specify they want no border, then we respect that
      if (this.zConfig.border != null) return this.zConfig.border
      // if the field do NOT have a body => we do not show the border
      // if (this.DefaultBodyUI == null) return false // 🔴 <-- probably a mistake here
      // default case when we have a body => we show the border
      return false
      // return 8
   }

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
    * return the serial path from the root to this field serial.
    * somewhat an internal method; usage should remain as low as possible.
    * @undecorated
    */
   zGetOwnSerialPathFromRoot(): string {
      const segments: string[] = []
      let at = this.zParent
      let key = this.zMountKey
      while (at != null) {
         segments.push(at.zGetChildrenSerialPath(key))
         at = at.zParent
         key = at?.zMountKey ?? '$'
      }
      return segments.reverse().join('.')
   }

   /**
    * need to be overwritten for all contaienr fields
    * @undecorated (placeholder made to be overriden)
    */
   zGetChildrenSerialPath(key: string): string {
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
    * @remarks was previously named `subFields`
    * @undecorated (placeholder made to be overriden)
    */
   get zChildrenAll(): Field[] {
      return []
   }

   /**
    * list of all children that are logically part of the tree
    * use-cases: render, toValue, toSerial, various traversal, etc.
    *
    *
    * @remarks expected to be overriden in every field that have children that can be toggled,
    * like FIeldChoice, FieldOptional
    */
   get zChildrenActive(): Field[] {
      return this.zChildrenAll
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
   get zSubFieldsWithKeys(): KeyedField[] {
      return []
   }

   // #region TRANSACTION
   /**
    * proxy this.repo.action
    * defined to shorted call and allow per-field override
    */
   zRunInTransaction<T>(fn: (tct: Transaction) => T): T {
      return this.zRepo.runInTransaction(fn)
   }

   /**
    * equivalent to `runInTransaction(() => patchSerial(() => {....}))`
    */
   zPatchInTransaction(fn: (draft: this['{serial}'], tct: Transaction) => undefined): this {
      this.zRunInTransaction((tct) => this.zPatchSerial((draft) => fn(draft, tct)))
      return this
   }

   /**
    * DO NOT OVERRIDE.
    * @internal
    */
   protected zAssignNewSerial(next: this['{serial}']): void {
      const tct = this.zRepo.tct
      if (tct == null)
         throw new Error(
            '❌ patchSerial should be called within a transaction; you may want to use `patchInTransaction`',
         )

      // console.log(`[🤠] ${this.path}`, JSON.stringify(this.serial), JSON.stringify(next), this.serial === next)
      if (this.zSerial === next) return
      runInAction(() => {
         this.zSerial = next
         // this.__version__++
         tct.trackAsUpdated(this)
         this.zRunPublications(FieldEvent.TrackAsUpdated)
         this.zRunPublications(FieldEvent.TrackAsCreatedOrUpdated)
         this.zParent?.zAcknowledgeNewChildSerial(this.zMountKey, this.zSerial)
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
   zPatchSerial(
      //
      fn: (draft: this['{serial}']) => undefined,
      /*
       * cowe uld allow K['{serial}'] and hand it back to the caller
       * to match immerjs API
       * | fn: (serial: K['{serial}']) => undefined  | K['{serial}']
       */
   ): boolean {
      if (this.zRepo.tct == null)
         throw new Error(
            '❌ patchSerial should be called within a transaction; you may want to use `patchInTransaction`',
         )
      // console.log(`[🧑‍🦯‍➡️] patch serial called from ${this.pathExt}`)
      // from 2024-09-09, serial are not longer observable objects
      if (isObservable(this.zSerial)) throw new Error('❌ serial should not be observable')

      // apply patch function
      const nextState = produce(this.zSerial, fn)
      const stateChanged = nextState !== this.zSerial // ⚠️ Ref equality check
      if (!stateChanged) return false // patch function did nothing; we can safely abort

      // otherwise, assign serial to current field, and bubble upwards to the document rot
      this.zAssignNewSerial(nextState)
      return true
   }

   /**
    * if your field have children, you need to be able to acknolewdge
    * if they changed their serial.
    * don't forget to recursively call this method on this field's parent.
    *
    * (this method needs a true implementation in every field that use RECONCILE)
    */
   protected zAcknowledgeNewChildSerial(mountKey: string, serial: any): boolean {
      throw new Error(`🔴 _acknowledgeNewChildSerial not implemented (${this.zPathExt})`)
   }

   /** probably the wrong place to retrieve that now that presenter are comming */
   get zIcon(): Maybe<IconName> {
      const x = this.zSchema.config.icon
      if (typeof x === 'function') return x(this)
      if (x == null) return null

      return x
   }

   private zHasBeenInitialized: boolean = false

   /** allow to add a live reaction on a field */
   zAddReaction(r: FieldReaction<this>): void {
      const cleanupFn = reaction(
         () => r.expr(this),
         (val) => r.effect(val, this),
         { fireImmediately: true, name: `Field-_setupReactions@${this.zPath}` },
      )
      this.zDisposeFns.push(cleanupFn)
   }

   private zSetupReactions(): void {
      if (this.zConfig.reactions == null) return
      for (const reaction of this.zSchema.reactions) {
         this.zAddReaction(reaction)
      }
   }

   /** this function MUST be called at the end of every field constructor */
   /** this function MUST be called at the end of every widget constructor */
   protected init(serial?: this['{serial}']): void {
      if (this.zHasBeenInitialized) return console.error(`[🔶] Field.init already called => ABORTING`)
      this.zHasBeenInitialized = true
      const transaction = this.zRepo.ASSERT_IS_RUNNING_IN_TRANSACTION()
      this.zRepo._registerField(this)
      transaction.trackAsCreated(this)
      //   VVVVVVVVVVVV this is where we hydrate children
      this.zSetOwnSerialWithValidationAndMigrationAndFixes(serial)
      this.zSetupReactions()
      this.zSetupSubscriptions()
      this.zRunPublications(FieldEvent.CommitUpdate)
      this.zRunPublications(FieldEvent.TrackAsCreated)
      this.zRunPublications(FieldEvent.TrackAsCreatedOrUpdated)
      this.UI = this.UI.bind(this)
      this.zReady = true
   }

   zCloneWithoutParent(): this {
      return this.zSchema.create(this.zSerial) as this
   }

   zCloneTheWholeTree(): this {
      const r = this.zRoot.zCloneWithoutParent()
      return r.zGetFieldAt(this.zPath) as this
   }

   zCloneWithConfig(config: Partial<this['{config}']>, opts?: WithConfigOptions): this {
      return this.zSchema.withConfig(config, opts).create(this.zSerial) as this
   }

   zCodeForTypescriptValue(p?: { indent?: number }): string {
      return this.zSchema.codeForTypescriptValue(p)
   }
   // ---------------------------------------------------------------

   @computed get zHasFoldableSubfieldsThatAreUnfolded(): boolean {
      return this.zChildrenAll.some((f) => f.zIsCollapsible && !f.zSerial.collapsed)
   }

   @computed get zHasFoldableSubfieldsThatAreFolded(): boolean {
      return this.zChildrenAll.some((f) => f.zIsCollapsible && Boolean(f.zSerial.collapsed))
   }

   @computed get zHasFoldableSubfields(): boolean {
      return this.zChildrenAll.some((f) => f.zIsCollapsible)
   }

   zDeleteSnapshot(): void {
      this.zPatchInTransaction((draft) => {
         delete draft.snapshot
      })
   }

   // ['🤭caht'] = 1 // 🔶
   // ['-caht'] = 1; // 🔶
   // ['/chat'] = 1; // 🔶
   // ['{chat}'] = 1; // 🟢
   // ['ܔchat'] = 1;
   get zHasSnapshot(): boolean {
      return this.zSerial.snapshot != null
   }

   /** update current field snapshot */
   zSaveSnapshot(): this['{serial}'] {
      const snapshot = produce(this.zSerial, (draft) => {
         // a bad person would say: "Yo, Dawg; I heard you liked snapshots. So I put a snapshot in your snapshot, so you can snapshot while snapshotting"
         // but it's wrong. we don't want snapshotception.
         // so we delete the snapshot from the snapshot before it's too late.
         // otherwise, once we take a second snapshot, the first snapshot will indeed appear in the second snapshot.
         // Snapshot.
         delete draft.snapshot
      })
      this.zPatchInTransaction((draft) => void (draft.snapshot = snapshot))
      return snapshot
   }

   /** revert to the last snapshot */
   zRevertToSnapshot(): void {
      // 🔘 IX++
      // 🔘 console.log(`[🤠] #${IX} seri`, getUIDForMemoryStructure(this.serial))
      // 🔘 console.log(`[🤠] #${IX} snap`, getUIDForMemoryStructure(this.serial.snapshot))

      // 🔘 console.log(`[🤠] #${IX} seri.values`, getUIDForMemoryStructure(this.serial?.values))
      // 🔘 console.log(`[🤠] #${IX} snap.values`, getUIDForMemoryStructure(this.serial.snapshot?.values))
      if (this.zSerial.snapshot == null) {
         // 🔘 console.log(`[🤠] #${IX} RESET`)
         return this.zReset()
      }
      // 🔘 console.log(`[🤠] #${IX} SNAP=`, deepCopyNaive(this.serial.snapshot))
      this.zSetSerial(this.zSerial.snapshot)
   }

   get zIsDirtyFromSnapshot_UNSAFE(): boolean {
      const { snapshot, ...currentSerial } = this.zSerial
      if (snapshot == null) return false
      return hashJSONObjectToNumber(snapshot) !== hashJSONObjectToNumber(currentSerial)
   }

   get zHashSerial(): number {
      return hashJSONObjectToNumber(this.zSerial)
   }

   abstract zIsOwnSet: boolean

   /**
    * return true if and only if self and every descendant is set.
    * [not made to be overriden]
    */
   get zIsSet(): boolean {
      if (!this.zIsOwnSet) return false
      if (this.zChildrenActive.some((f) => !f.zIsSet)) return false
      return true
   }

   get zLabelText(): string {
      if (this.zConfig.label == null) {
         const mountKey = this.zParent?.zType === 'optional' ? this.zParent.zMountKey : this.zMountKey
         return makeLabelFromPrimitiveValue(mountKey)
      }
      if (this.zConfig.label === false) return '' // not sure about the config.label doc
      return this.zConfig.label
   }

   // legacy => migrate to new event system
   private zExtraSaveChangesFunction: (() => Promise<void> | void)[] = []
   zOnSaveChanges(fn: () => Promise<void> | void): void { this.zExtraSaveChangesFunction.push(fn) } // prettier-ignore
   public async zSaveChanges(): Promise<void> {
      for (const fn of this.zExtraSaveChangesFunction) await fn()
      this.zTouched = false
   }

   // ---------------------------------------------------------------------------
   private zCallbacks_: { [key in FieldEvent_]?: ((field: any) => void)[] } = {}

   /** @internal */
   zInternalRunCallbacksForEvent(event: FieldEvent_): void {
      if (this.zCallbacks_[event] == null) return
      for (const cb of this.zCallbacks_[event]!) {
         cb(this)
      }
   }
   zOn(event: FieldEvent_, cb: CovariantFn<[field: this], void>): void {
      if (this.zCallbacks_[event] == null) this.zCallbacks_[event] = []
      this.zCallbacks_[event]?.push(cb)
   }

   zOff(event: FieldEvent_, cb: CovariantFn<[field: this], void>): void {
      if (this.zCallbacks_[event] == null) return console.warn(`[🔶] Field.off: no callbacks for ${event}`)
      const i = this.zCallbacks_[event]?.indexOf(cb)
      if (i === -1) return console.warn(`[🔶] Field.off callback not found for ${event}`)
      this.zCallbacks_[event]?.splice(i, 1)
   }

   /**
    * this function allow to register temporary events callbacks
    * on a field that last while the component is mounted
    */
   zReactUseEvent(event: FieldEvent_, cb: CovariantFn<[field: this], void>, deps: DependencyList): void {
      const cbStable = useCallback(cb, deps)
      useEffect(() => {
         this.zOn(event, cbStable)
         return (): void => this.zOff(event, cbStable)
      }, [cbStable, event])
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
