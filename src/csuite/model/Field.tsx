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
import { observer } from 'mobx-react-lite'
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
import { makeLabelFromPrimitiveValue } from '../utils/makeLabelFromFieldName'
import { $FieldSym } from './$FieldSym'
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
   const FmtUI = (isObserver ? fn : observer(fn)) as T
   return FmtUI
}

export type KeyedField = { key: string; field: Field }
export type FL_FieldPathExt = Tagged<string, 'FL_FieldPathExt'>
export type FL_FieldPath = Tagged<string, 'FL_FieldPath'>

export type FieldCtorProps<TYPES extends Field = any> = [
   //
   repo: Repository,
   root: Field | null,
   parent: Field | null,
   schema: CSchema<TYPES>,
   initialMountKey: string,
   serial?: TYPES['$serial'],
]

export type FieldCtorProps_ALT<TYPES extends Field = any> = [
   //
   repo: Repository,
   root: Field | null,
   parent: Field | null,
   schema: CSchema<any>,
   initialMountKey: string,
   serial?: TYPES['$serial'],
]

type PathObject = [string, Maybe<PathObject>]

export abstract class Field {
   declare $type: CATALOG.AllFieldTypes
   declare $ownConfig: unknown
   declare $ownSerial: unknown

   declare $serial: FieldSerialFor<this>
   declare $config: FieldConfigFor<this>

   declare $value: unknown
   declare $setValue: unknown
   declare $unchecked: unknown
   declare $child: unknown
   declare $opts: unknown
   declare $ownPatch: Patch_Common<this['$type']>

   // 2025-02-11 new addition
   declare $Schema: CSchema<this>

   /**
    * @internal
    */
   static build: 'new' = 'new'

   /**
    * unique Field instance ID;
    * each node in the form tree has one;
    * NOT persisted in serial.
    * change every time the field is instantiated
    * @undecorated (can't change)
    */
   readonly _uid: FieldId

   /** widget serial is the full serialized representation of that widget  */
   @observable.ref accessor serial: this['$serial']

   /**
    * singleton repository for the project
    * allow access to global domain, as well as any other live field
    * and other shared resource
    * @undecorated (can't change)
    */
   readonly repo: Repository

   /**
    * root of the field tree this field belongs to
    * @undecorated (can't change)
    */
   readonly root: Field

   /**
    * alias to root; since that's what `document` is.
    * @undecorated (static as of 2025-02-06)
    */
   get document(): Field {
      return this.root
   }

   private _symField = Symbol.for('Field')

   /** parent field, (null when root) */
   @observable.ref accessor parent: Field | null

   /** schema used to instanciate this widget */
   schema: CSchema<this>

   get opts2(): this['$opts'] {
      return this.config.opts!
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
      serial?: any /* ❓ */, // this['$serial'],
   ) {
      this._uid = mkNewFieldId()
      this.repo = repo
      this.root = root ?? this
      this.parent = parent
      this.schema = schema
      this.serial = serial ?? this.schema.defaultSerial
      this.mountKey = initialMountKey
      this.parent?._acknowledgeNewChildSerial(initialMountKey, this.serial)
   }

   /**
    * type of the field (e.g. 'str', 'color', 'group', 'optional', etc.)
    * Retrieved by looking in prototype for static `type` attribute.
    * @undecorated
    */
   get type(): this['$type'] {
      return (this.constructor as FieldConstructor<this>).type
   }

   /** @undecorated */
   private get _migrateSerial(): SerialMigrationFunction<this['$serial']> {
      return (this.constructor as FieldConstructor<this>).migrateSerial
   }

   /**
    * widget value is the simple/easy-to-use representation of that widget
    * @undecorated
    */
   abstract value: this['$value']

   // 💬 2024-09-09 rvion:
   // | we can't actually use the following code to share get value() implementation
   // | because of mobx. Mobx force getters and setters to live on the same prototype.
   // |
   // | ```ts
   // | get value(): K['$value'] {
   // |     return this.value_or_fail
   // | }
   // |
   // | set value(_newValue: K['$value']) {
   // |     throw new Error(`❌ field_${this.type}.value = ... failed: setter not implemented`)
   // | }
   // | ```

   /**
    * crashes if the value is not set.
    * this method will NOT try to conjure any intented value.
    * @since 2024-09-03
    *
    * @see {@link value_or_zero}
    * @see {@link value_unchecked}
    */
   abstract value_or_fail: this['$value']

   /**
    * Should do its best to return a value,
    * conjuring some default value if necessary
    * but you may THROW if zero does not exists
    * 🔶 do not return null, unless the type allows you to
    * @since 2024-09-03
    *
    * @see {@link value_or_fail}
    * @see {@link value_unchecked}
    *
    **/
   abstract value_or_zero: this['$value']

   /**
     * this method
     *  - Always returns the advertized type (`Field['$unchecked']`).
     *  - Never crashes
     *
     * @since 2024-09-03
     *
     * @see {@link value_or_fail}
     * @see {@link value_or_zero}

     */
   abstract value_unchecked: this['$unchecked']

   /**
    * Returns true if the given field has the same value as this field
    * (only possible if fields are of the same type)
    */
   abstract isValueEqual(other: Field): boolean

   /**
    * you should NOT override this method.
    * you need to override the `generateOwnPatches`
    * @see generateOwnPatches
    *
    * (TODO: since final is not a thing in TS; we may prevent this overridability; configurable: false, writable: false) => probbaly want to wait for decorators first)
    * @undecorated (pure producer)
    */
   public generatePatches(referenceField: this): Patch_Common[] {
      const patches: Patch_Common[] = []
      if (this.type !== referenceField.type) {
         throw new Error(`Can't generate patches between fields of different types`)
         // what do we do here ? 🔴
         // case where it can happen:
         //   - hot reload ? different schema ? 🤔
         // return []
      }
      const ownPatches = this.generateOwnPatches(referenceField)
      patches.push(...ownPatches)
      patches.push(...this.generateChildrenPatches(referenceField))
      return patches
   }

   get patchedSerialPaths(): readonly string[] {
      return (this.constructor as FieldConstructor<this>).patchedSerialPaths
   }

   /**
    * To be overwritten by subclasses to generate patches for the field itself
    * for special cases
    * @undecorated
    */
   protected generateOwnPatches(referenceField: this): this['$ownPatch'][] {
      if (this.isValueEqual(referenceField)) return []

      return this.patchedSerialPaths.flatMap((serialPath): Patch<this['$type']>[] => {
         const thisValue = _get(this.serial, serialPath)
         const referenceValue = _get(referenceField.serial, serialPath)

         if (thisValue === referenceValue) return []

         if (thisValue === undefined) {
            return [
               {
                  op: 'remove',
                  fieldType: this.type,
                  fieldPath: this.path,
                  serialPath,
               } as PatchRemove<this['$type']>,
            ]
         }
         if (referenceValue === undefined) {
            return [
               {
                  op: 'add',
                  fieldType: this.type,
                  fieldPath: this.path,
                  serialPath,
                  value: thisValue,
               } as PatchAdd<this['$type'], unknown>,
            ]
         }

         return [
            {
               op: 'replace',
               fieldType: this.type,
               fieldPath: this.path,
               serialPath,
               value: thisValue,
            } as PatchReplace<this['$type'], unknown>,
         ]
      })
   }

   /**
    * generic implementation; must be overriden for every non-leaves
    * @undecorated (single action setter inside)
    */
   set(x: this['$setValue']): this {
      if (isProbablySomeFieldSerialOf(x, this.type)) this.setSerial(x as this['$serial'])
      else if ((x as any) instanceof Field) this.setSerial((x as any).serial as this['$serial'])
      else this.setValue(x)
      return this
   }

   /** @undecorated (pure getter function) */
   getSetValue(): this['$setValue'] | undefined {
      // console.log(`[💀 getSetValue] `, this.path)
      return this.value
   }

   /**
    * To be overwritten by subclasses to generate patches for children
    * @undecorated (pure getter)
    */
   protected generateChildrenPatches(reference: this): Patch_Common[] {
      return this.childrenAll.flatMap((child) => {
         const referenceChild = reference.getChildByKey(child.mountKey)

         if (referenceChild != null) {
            return child.generatePatches(referenceChild as Field)
         }

         return []
      })
   }

   /** @undecorated (manual runInAction inside) */
   public applyPatches(patches: Patch_Common[]): void {
      const thisPatches = patches.filter(
         (patch) => patch.fieldPath === this.path && patch.fieldType === this.type,
      )
      runInAction(() => {
         this.applyOwnPatches(thisPatches)
         this.applyChildrenPatches(patches)
      })
   }

   /** @undecorated (manual runInAction inside) */
   protected applyOwnPatches(patches: this['$ownPatch'][]): void {
      if (patches.length === 0) return
      runInAction(() => {
         const nextState = produce(this.serial, (draft) => {
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
         this.setSerial(nextState)
      })
   }

   /** @undecorated (manual runInAction inside) */
   protected applyChildrenPatches(patches: Patch_Common[]): void {
      if (patches.length === 0) return

      runInAction(() => {
         this.childrenAll.forEach((child) => {
            const childPatches = patches.filter(
               (patch) => patch.fieldPath === child.path || patch.fieldPath.startsWith(`${child.path}.`),
            )
            if (childPatches.length > 0) {
               child.applyPatches(childPatches)
            }
         })
      })
   }

   /**
    * @since 2024-08-30
    * @stability beta
    * @undecorated (base function does nothing)
    */
   static migrateSerial(serial: Field['$serial']): any {
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
   randomize(): void {}

   // #region lifecycle

   /** field is already instanciated => probably used as a linked */
   shared(): Z.Shared<this> {
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
   protected disposeFns: (() => void)[] = []

   /**
    * lifecycle method, is called
    *
    * @since 2024-07-05
    * @undecorated (this.repo.runInTransaction already wrapped in runInAction)
    */
   disposeTree(): void {
      this.runInTransaction((tct) => this._disposeTree(tct))
   }

   /**
    * calls itself recursively
    * @undecorated (manual runInAction inside)
    */
   private _disposeTree(tct: Transaction): void {
      runInAction(() => {
         this._disposeSelf(tct)

         // dispose all children
         for (const sub of this.childrenAll) {
            sub._disposeTree(tct)
         }
      })
   }

   /** @undecorated (only called by _disposeTree above, which is wrapped in runInAction) */
   private _disposeSelf(tct: Transaction): void {
      // TODO:
      // - disable all publish
      // - disable all reactions
      // - mark as DELETED;  => makes most function throw an error if used

      // unregister from repo
      this.repo._unregisterField(this, tct)

      // dispose all reactions/other long-running stuff
      for (const disposeFn of this.disposeFns) {
         disposeFn()
      }
   }

   /**
    * will be set to true after the first initialization
    * TODO: also use that to wait for whole tree to be patched before applying effects
    * (may not need to be made observable; review this decision later)
    * */
   @observable accessor ready: boolean = false

   /**
    * if your field need to wait for the document to be ready;
    * this observable getter does that.
    *
    * @since 2024-09-04
    */
   get isDocumentReady(): boolean {
      return this.root.ready
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
   setSerial(
      /** this serial may be from a previous schema; we need to be able to handle properly */
      serial: Maybe<this['$serial']>,
   ): void {
      if (serial === this.serial) return
      this.runInTransaction(() => {
         // this.copyCommonSerialFields(serial)
         this.setOwnSerialWithValidationAndMigrationAndFixes(serial)
      })
   }

   /**
    * NEVER CALL THIS FUNCTION YOURSELF
    *
    * This function can only be called by `setOwnSerialWithValidationAndMigration`
    * which itself can only be called by `init` and `setSerial`
    */
   protected abstract setOwnSerial(serial: this['$serial']): void

   /**
     * contains the list of all serial problems that occured during the last setSerial
     * it only contains the **LAST** setSerial problems
     * => this list will be emptied everytime we call setSerial
     *
     * @see {@link recordSerialProblem}
     * @since 2024-09-11

     */
   serialProblems: { msg: string; data: any }[] = []

   /**
    * Append a problem to the serialProblems list
    *
    * @see {@link serialProblems}
    * @since 2024-09-11
    */
   recordSerialProblem = (msg: string, data: any): void => {
      this.serialProblems.push({ msg, data })
   }

   /*

    // A. handle static migrateSerial function.
    // B. autofixes.
    // C. simple schema validation (check type only)
    // D. full serial validation.
    //    C.1. local validation, field by field
    //    C.2. global via generated zod-or-similar json schema

    */
   setOwnSerialWithValidationAndMigrationAndFixes(serialish: UNVALIDATED<Maybe<this['$serial']>>): {
      problems: { msg: string; data: any }[]
   } {
      const wasNull = serialish == null
      let skipAutoFix: boolean = false
      let serial: object

      // #region 1.1. case `null` => use `defaultSerial`
      if (serialish == null) {
         this.recordSerialProblem(`serial is null, using defaultSerial`, serialish)
         serial = this.schema.defaultSerial
         skipAutoFix = true
      }

      // #region 1.2. case not an object => use `defaultSerial`
      else if (typeof serialish !== 'object') {
         this.recordSerialProblem(`serial is not an object, using defaultSerial`, serialish)
         serial = this.schema.defaultSerial
         skipAutoFix = true
      }

      // #region 1.3. case object => use it
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
         const newSerial = this._migrateSerial(serial)
         if (newSerial != null) serial = newSerial
      }

      // #region 4. Legacy (🔴!) run the heuristic migration function
      // 🔶 this is probably wrong; and we probably need to get rid of it sooner than later.
      // TODO: dispatch to various migrateSerial functions within fields themselves
      if (isProbablySomeFieldSerial(serial) && serial.$ !== this.type) {
         // ADDING LIST
         if (this.type === 'list') {
            const id = nanoid(6) as Field_list_ItemID
            const next: Field_list_serial<any> = {
               $: 'list',
               items_: [serial],
               keys: [id],
            }
            serial = next
         }

         // ADDING OPTIONAL
         else if (this.type === 'optional') {
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
            if (isHole(item0)) throw new Error(`invalid serial at '${this.path}': hole found in list.`)
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
      if (this.config.beforeInit != null) {
         const oldVersion = (serial as any)._version ?? 'default'
         const newVersion = this.config.version ?? 'default'
         if (oldVersion !== newVersion) {
            serial = this.config.beforeInit(serial)
            if (!isProbablySomeFieldSerial(serial)) throw new Error(`invalid serial`)
            serial._version = newVersion
         }
      }
      // #region 6. New migration system
      // TODO

      // #region 7. catch all phase
      if (!isProbablySomeFieldSerial(serial)) {
         throw new Error(`invalid serial at '${this.path}'`)
      }
      if (isProbablySomeFieldSerial(serial) && serial.$ !== this.type) {
         console.log(`[🔶] INVALID SERIAL at ${this.path} (expected: ${this.type}, got: ${serial.$})`)
         console.log(`[🔶] INVALID SERIAL:`, JSON.stringify(serial))
         const anomaly: FieldAnomaly = {
            type: 'invalid-serial',
            date: Date.now(),
            path: this.path,
            pathExt: this.pathExt,
            got: serialish as AnyFieldSerial,
         }
         if (this.root !== this) {
            this.root.addAnomaly(anomaly)
            serial = this.schema.defaultSerial
         } else {
            serial = { ...this.schema.defaultSerial /* ❌ */, anomalies: [anomaly] }
         }
      }

      // #region 8. final validation
      function ensureValid<T>(serial: any): T {
         return serial
         // TODO
      }
      const validSerial = ensureValid<this['$serial']>(serial)

      // #region 9. set the now valid serial
      // 💬 2024-09-11 rvion: at this point, we should be able to guarantee that
      // | the serial is of the right type,
      // | the serial is well formed valid.
      // | no data has been discarded.
      // | all validation properly succeeed
      this.setOwnSerial(validSerial)
      return { problems: this.serialProblems }
   }

   // private copyCommonSerialFields(s: Maybe<FieldSerial_CommonProperties>): void {
   //     if (s == null) return
   //     if (s._version != null) this.serial._version = s._version
   //     if (s.collapsed != null) this.serial.collapsed = s.collapsed
   //     if (s.custom != null) this.serial.custom = s.custom
   //     if (s.lastUpdatedAt != null) this.serial.lastUpdatedAt = s.lastUpdatedAt
   // }

   /** unified api to allow setting serial from value */
   setValue(val: this['$value']): this {
      this.value = val
      return this
   }

   RECONCILE<SCHEMA extends CSchema>(p: {
      mountKey: string
      existingChild: Maybe<Field>
      correctChildSchema: SCHEMA
      /** the target child to clone/apply into child */
      targetChildSerial: Maybe<SCHEMA['$serial']>
      /**
       * ONLY CALLED FOR NEW CHILD
       *
       * must attach/register both
       *  - child into parent where it belongs
       *  - child.serial into parent.serial where it belongs  */
      attach(child: SCHEMA['$field']): void
   }): void {
      let child = p.existingChild
      if (child != null && child.schema === p.correctChildSchema) {
         child.setSerial(p.targetChildSerial)
      } else {
         if (child) child.disposeTree()
         child = p.correctChildSchema.instanciate(
            //
            this.repo,
            this.root,
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
   get actualWidgetToDisplay(): Field {
      return this
   }

   get indentChildren(): number {
      return 1
   }

   /** @deprecated ? with the new UI system */
   get justifyLabel(): boolean {
      if (this.config.justifyLabel != null) return this.config.justifyLabel
      return true
   }

   @computed get depth(): number {
      if (this.parent == null) return 0
      return this.parent.depth + this.parent.indentChildren
   }

   /** DO NOT OVERRIDE; used internally to properly schedule events */
   @computed get trueDepth(): number {
      if (this.parent == null) return 0
      return this.parent.trueDepth + 1
   }

   // #region ON/OFF

   /**
    * returns true if we can either `setOn` and `setOff` this field
    * @since 2024-09-03
    */
   @computed get canBeToggledWithinParent(): boolean {
      // if (isFieldOptional(this)) return true
      if (isFieldList(this.parent)) return true
      if (isFieldOptional(this.parent)) return true
      if (isFieldChoices(this.parent)) return true
      if (isFieldChoice(this.parent)) return false
      return false
   }

   /**
    * if parent can be toggled, sets the parent ON
    * throws otherwise
    * @since 2024-09-03
    * @undecorated (single child action)
    */
   enableSelfWithinParent(): void {
      const parent = this.parent
      if (isFieldOptional(parent)) return parent.setOn()
      if (isFieldChoices(parent)) return parent.enableBranch(this.mountKey)
      if (isFieldChoice(parent)) return parent.enableBranch(this.mountKey)
      throw new Error(
         `(${this.type}@'${this.path}').setOn: parent (${parent?.type}) is neither optional or choices`,
      )
   }

   /**
    * if parent can be toggled, sets the parent OFF
    * throws otherwise
    * @since 2024-09-03
    * @undecorated (single child action)
    */
   disableSelfWithinParent(): void {
      const parent = this.parent
      if (isFieldOptional(parent)) return parent.setOff()
      if (isFieldList(parent)) return parent.removeItem(this)
      if (isFieldChoices(parent)) return parent.disableBranch(this.mountKey)
      if (isFieldChoice(parent)) return parent.disableBranch(this.mountKey)
      throw new Error(
         `(${this.type}@'${this.path}').setOff: parent (${parent?.type}) is neither optional or choices`,
      )
   }

   @computed get isInsideDisabledBranch(): boolean {
      if (this.parent == null) return false
      if (this.parent.isInsideDisabledBranch) return true
      if (isFieldOptional(this.parent)) return this.parent.isDisabled
      if (isFieldChoices(this.parent)) return this.parent.isBranchDisabled(this.mountKey)
      if (isFieldChoice(this.parent)) return this.parent.isBranchDisabled(this.mountKey)
      return false
   }

   @computed get isDisabledWithinParent(): boolean {
      return !this.isEnabledWithinParent
   }

   @computed get isEnabledWithinParent(): boolean {
      if (isFieldOptional(this.parent)) return this.parent.isActive
      if (isFieldChoices(this.parent)) return this.parent.isBranchEnabled(this.mountKey)
      if (isFieldChoice(this.parent)) return this.parent.isBranchEnabled(this.mountKey)
      return true
   }

   // #region Tree

   // abstract readonly id: string
   asTreeElement(key: string): ITreeElement<{ widget: Field; key: string }> {
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
   get config(): this['$config'] {
      return this.schema.config
   }

   /** @undecorated (not an action; pure; defer to single computed) */
   getValue(mode: VALUE_MODE): this['$value'] | this['$unchecked'] {
      if (mode === 'fail') return this.value_or_fail
      if (mode === 'zero') return this.value_or_zero
      if (mode === 'unchecked') return this.value_unchecked
      if (mode === 'set') return this.getSetValue()
      exhaust(mode)
   }

   /**
    * return true when widget has no child
    * return false when widget has one or more child
    * */
   get hasNoChild(): boolean {
      return this.childrenAll.length === 0
   }

   /**
    * @since 2024-06-20
    * @status broken
    * return a short summary of changes from default
    */
   @computed get diffSummaryFromDefault(): string {
      return [
         this.hasChanges //
            ? `${this.path}(${this.value?.toString?.() ?? '.'})`
            : null,
         ...this.childrenAll.map((w) => w.diffSummaryFromDefault),
      ]
         .filter(Boolean)
         .join('\n')
   }

   /** path within the model */
   @computed get path(): FL_FieldPath {
      const p = this.parent
      if (p == null) return '$'
      return p.path + '.' + this.mountKey
   }

   @computed get pathObject(): PathObject {
      return [this.path, this.parent?.pathObject]
   }

   /** path within the model */
   @computed get pathExt(): FL_FieldPathExt {
      const p = this.parent
      if (p == null) return `@${this.type}`
      return p.pathExt + '.' + this.mountKey + `@${this.type}`
   }

   getFieldAt(path: string): Maybe<Field> {
      const parts = path.split('.')
      // eslint-disable-next-line consistent-this
      let current: Maybe<Field> = this
      for (const part of parts) {
         if (part === '$') {
            current = this.root
            continue
         }
         current = current.getChildByKey(part) as Maybe<Field>
         if (current == null) return null
      }

      return current
   }

   getChildByKey(key: string): Maybe<this['$child']> {
      // TODO: more efficient overrides
      return this.childrenAll.find((f) => f.mountKey === key)
   }

   @observable accessor mountKey: string
   // get mountKey(): string {
   //     if (this.parent == null) return '$'
   //     if (this.parent.type === 'optional') return 'child' // hack for line below who is wrong
   //     return this.parent.subFieldsWithKeys.find(({ field }) => field === this)?.key ?? '<error>'
   // }

   /** collapse all children that can be collapsed */
   collapseAllChildren(): void {
      runInAction(() => {
         for (const _item of this.childrenAll) {
            // this allow to make sure we fold though optionals and similar constructs
            const item = _item.actualWidgetToDisplay
            if (item.serial.collapsed) continue
            const isCollapsible = item.isCollapsible
            if (isCollapsible) item.setCollapsed(true)
         }
      })
   }

   isOfType(...type: CATALOG.AllFieldTypes[]): boolean {
      return type.includes(this.type)
   }

   /** expand all children that can are collapsed */
   expandAllChildren(): void {
      runInAction(() => {
         for (const _item of this.childrenAll) {
            // this allow to make sure we fold though optionals and similar constructs
            const item = _item.actualWidgetToDisplay
            item.setCollapsed(undefined)
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
   reset(): void {
      runInAction(() => {
         this.setSerial(null)
         this.touched = false
      })
   }

   /** return a cloned/detached value object you can use anywhere without care */
   toValueJSON(): this['$value'] {
      return JSON.parse(JSON.stringify(this.value))
   }

   /** return a clone/detached serial object you can use anywhere without care */
   toSerialJSON(): this['$serial'] {
      return this.serial // JSON.parse(JSON.stringify(this.serial))
   }

   /** every child class must implement change detection from its default  */
   abstract readonly hasChanges: boolean

   @observable private accessor touched_: boolean = false

   /** true when the field contains unsaved changes */
   get touched(): boolean {
      return this.touched_
   }

   set touched(val: boolean) {
      runInAction(() => {
         if (val === true && this.touched_ !== val && this.parent !== this && this.parent != null) {
            this.parent.touched = true
         }

         this.touched_ = val
      })
   }
   /**
    * Identical to field.touched = true but easier to use when field is nullable
    */
   touch(): void {
      runInAction(() => {
         this.touched = true
      })
   }

   touchAll(): void {
      runInAction(() => {
         if (this.childrenAll.length === 0) this.touched = true

         for (const child of this.childrenAll) {
            child.touchAll()
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
   // abstract readonly defaultValue: this['schema']['$value'] |

   $FieldSym: typeof $FieldSym = $FieldSym

   /**
    * when this widget or one of its descendant publishes a value,
    * it will be stored here and possibly consumed by other descendants
    */
   @observable accessor _advertisedValues: Record<ChannelId, any> = {}

   /**
    * when reading a publication, we will walk up the parent chain
    * and look for a value stored in the advsertised values.
    */
   readChannel<T extends any>(chan: Channel<T> | ChannelId): Maybe<T> /* 🔸: T | $EmptyChannel */ {
      const channelId = typeof chan === 'string' ? chan : chan.id
      let at = this as any as Field | null
      while (at != null) {
         if (channelId in at._advertisedValues) {
            return at._advertisedValues[channelId]
         }
         at = at.parent
      }
      // console.warn(`[🪈] ${channelId} | not found from ${this.path}`)
      return null // $EmptyChannel
   }

   /**
    * return a short string summary that display the value in a simple way.
    * This method is expected to be overriden in most child classes
    */
   @computed get summary(): string {
      return JSON.stringify(this.value)
   }

   /**
    * Retrive the config custom data.
    * 🔶: NOT TO BE CONFUSED WITH `getFieldCustom`
    * Config custom data is NOT persisted anywhere,
    * You can set config.custom when defining your schema.
    * This data is completely unused internally by CSuite.
    * It is READONLY.
    */
   getConfigCustom<T = unknown>(): Readonly<T> {
      return (
         this.config.custom ?? //
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
   getFieldCustom<T = unknown>(): T {
      return this.serial.custom
   }

   // will be easy to type/extend with the new type accumulator strategy when we backport
   get custom(): any {
      return this.serial.custom
   }

   /**
    * update
    * You can either return a new value, or patch the initial value
    * use `deleteFieldCustomData` instead to replace the value by null or undefined.
    */
   updateFieldCustom(fn: (x: Maybe<this['$value']>) => this['custom']): this {
      const prev = this.value
      const next = fn(prev) ?? prev
      return this.patchInTransaction((draft) => {
         // 💬 2024-09-17 rvion:
         // | I'll assume that the custom data is already serializable...
         // | still wrong, but probably a bit less dangerous than naive deep-cloning it.
         draft.custom = next
         // draft.custom = JSON.parse(JSON.stringify(next))
      })
   }

   /** delete field custom data (delete this.serial.custom)  */
   deleteFieldCustomData(): this {
      return this.patchInTransaction((draft) => {
         delete draft.custom
      })
   }

   // 📌 ERROR / VALIDATION ---------------------------------------------------------------|

   // 🔶 TEMPORARY HACK UNTIL RENDER BRANCH
   getFieldUnchecked(): this {
      return this
   }

   /**
    * @since 2024-09-04
    * @category Validation
    */
   validate(): Result<this, ValidationError> {
      this.touched = true
      if (!this.isValid)
         return __ERROR(
            new ValidationError(
               `Validation failed for field ${this.type} at '${this.path}'`,
               this,
               this.allErrorsIncludingChildrenErrors,
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
   validateOrNull(): Maybe<this> {
      this.touched = true
      if (!this.isValid) return null
      return this
   }

   /**
    * helper function to chain things
    *
    * @since 2024-09-04
    * @category Validation
    * @see {@link validateOrNull}
    */
   validateOrThrow(): this {
      const res = this.validate()
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
   get isValid(): boolean {
      return this.allErrorsIncludingChildrenErrors.length === 0
   }

   /**
    * returns true if errors.length > 0
    * @category Validation
    */
   get hasOwnErrors(): boolean {
      const errors = this.ownErrors
      return errors.length > 0
   }

   get mustDisplayErrors(): boolean {
      return this.hasOwnErrors && !this.isInsideDisabledBranch
      return this.hasOwnErrors
      return this.hasOwnErrors && this.touched
   }
   /**
    * all own errors:
    *  + base/default (built-in field, e.g. minLength for string)
    *  + custom       (user-defined in config)
    * @category Validation
    */
   @computed get ownErrors(): Problem[] {
      const i18n = csuiteConfig.i18n
      // If we have a leaf Field, we add its "not set" error (isOwnSet)
      if (!this.isOwnSet) {
         return [
            {
               path: this.path,
               message: i18n.err.field.not_set,
               longerMessage: `${i18n.err.field.not_set} (${this.pathExt})`,
            },
         ]
      } else {
         return normalizeProblem(this, this.ownTypeSpecificProblems) //
            .concat(this.ownCustomConfigCheckProblems)
      }

      // return errors
   }

   /**
    * @category Validation
    */
   @computed get allErrorsIncludingChildrenErrors(): Problem[] {
      const subErrs = this.childrenActive.flatMap((f) => f.allErrorsIncludingChildrenErrors)
      if (subErrs.length === 0) return this.ownErrors

      const ownErrs = this.ownErrors
      if (ownErrs.length === 0) return subErrs

      return this.ownErrors.concat(subErrs)
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
   @computed get ownCustomConfigCheckProblems(): Problem[] {
      if (this.config.check == null) return []
      const res = this.config.check(this)
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
   abstract readonly ownTypeSpecificProblems: Problem_Ext
   abstract readonly ownConfigSpecificProblems: Problem_Ext

   // -----------------------------------------------------------------------|
   /**
    * returns the list of all ancestors, NOT including self
    * @since 2024-07-08
    */
   @computed get ancestors(): Field[] {
      const result: Field[] = []
      let current: Maybe<Field> = this.parent
      while (current) {
         result.push(current)
         current = current.parent
      }
      return result
   }

   /**
    * returns the list of all ancestors, including self
    * @since 2024-07-08
    */
   @computed get ancestorsIncludingSelf(): Field[] {
      const result: Field[] = []
      // eslint-disable-next-line consistent-this
      let current: Maybe<Field> = this
      while (current) {
         result.push(current)
         current = current.parent
      }
      return result
   }

   @computed get descendants(): Field[] {
      const result: Field[] = []
      for (const child of this.childrenAll) {
         result.push(child)
         result.push(...child.descendants)
      }
      return result
   }

   @computed get descendantsIncludingSelf(): Field[] {
      const result: Field[] = [this]
      for (const child of this.childrenAll) {
         result.push(child)
         result.push(...child.descendants)
      }
      return result
   }

   // BUMP ----------------------------------------------------
   private _extraSerialChangesFunction: ((self: Field) => void)[] = [] // 🔶 cannot (but probably need not) type self as K['$field'] due to variance issues
   onSerialChanges(fn: (self: this) => void): this {
      this._extraSerialChangesFunction.push(fn as any)
      return this
   }

   /**
    * every time a field serial is updated, we should call this function.
    * this function is called recursively upwards.
    * persistance will usually be done at the root field reacting to this event.
    */
   INTERNAL_applySerialUpdateEffects(): void {
      for (const fn of this._extraSerialChangesFunction) fn(this)
      this.config.onSerialChange?.(this)
      this.config.onValueChange?.(this)
   }

   /** recursively walk upwards on any field change  */
   // private applyValueUpdateEffects_OF_CHILD(child: Field): void {
   //     this.serial.lastUpdatedAt = Date.now() as Timestamp
   //     this.parent?.applyValueUpdateEffects_OF_CHILD(child)
   //     this.config.onValueChange?.(this /* TODO: add extra param here:, child  */)
   //     this.publishValue() // 🔴  should probably be a reaction rather than this
   // }

   /**
    * this method can be heavily optimized
    * ping @globi
    * todo:
    *  - by storing the published value locally
    *  - by defining a getter on the _advertisedValues object of all parents
    *  - by only setting this getter up once.
    * */
   runPublications(this: Field): void {
      // 1. publications(broadcast upwards)
      const publications = this.schema.publications
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
      if (!this.isOwnSet)
         return console.log(`[🤠] skipping publication of ${this.pathExt} because field is not set`)

      // Create and store values for every producer
      const producedValues: Record<ChannelId, any> = {}
      for (const publication of publications) {
         const channelId = typeof publication.chan === 'string' ? publication.chan : publication.chan.id
         if (publication.hoist) producedValues[channelId] = publication.produce(this)
         else this._advertisedValues[channelId] = publication.produce(this)
         // console.log(`[🪈] ${channelId} | ${this.path} is publishing`)
      }
      runInAction(() => {
         // Assign values to every parent widget in the hierarchy
         if (Object.keys(producedValues).length > 0) {
            let at = this as any as Field | null
            while (at != null) {
               Object.assign(at._advertisedValues, producedValues)
               at = at.parent
            }
         }
      })
   }

   @computed get isHidden(): boolean {
      if (this.config.hidden != null) return this.config.hidden
      if (isFieldGroup(this) && Object.keys(this.fields).length === 0) return true
      return false
   }

   /** whether the widget should be considered inactive */
   @computed get isDisabled(): boolean {
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
   setCollapsed(val?: boolean): void {
      if (this.serial.collapsed === val) return
      this.patchInTransaction((draft) => {
         draft.collapsed = val
      })
   }

   /** @undecorated (single child action)  */
   toggleCollapsed(this: Field): void {
      this.patchInTransaction((draft) => {
         draft.collapsed = !draft.collapsed
      })
   }

   get isCollapsedByDefault(): boolean {
      return false
   }

   @computed get isCollapsed(): boolean {
      if (!this.isCollapsible) return false
      if (this.serial.collapsed != null) return this.serial.collapsed
      if (this.parent?.isDisabled) return true
      return this.isCollapsedByDefault ?? false
   }

   /**
    * if specified, overrides the default logic to decide if the widget need to be collapsible
    * @deprecated
    * 🔶 going to be removed ASAP
    */
   @computed get isCollapsible(): boolean {
      // top level widget is not collapsible; we may want to revisit this decision
      // if (widget.parent == null) return false
      if (this.config.collapsed != null) return this.config.collapsed //
      if (this.config.label === false) return false
      return true
   }

   /**
    * if provided, the default logic to decide if the widget need to be bordered
    * @deprecated
    */
   @computed get border(): TintExt {
      // avoif borders for the top level form
      if (this.parent == null) return false
      // if (this.parent.subWidgets.length === 0) return false
      // if app author manually specify they want no border, then we respect that
      if (this.config.border != null) return this.config.border
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
   Render(props: RENDERER.FieldRenderArgs<this> = {}): ReactNode {
      return this.UI(props)
   }

   // #region CHILDREN
   /**
    * @since 2024-12-11
    * return the serial path from the root to this field serial.
    * somewhat an internal method; usage should remain as low as possible.
    * @undecorated
    */
   getOwnSerialPathFromRoot(): string {
      const segments: string[] = []
      let at = this.parent
      let key = this.mountKey
      while (at != null) {
         segments.push(at.getChildrenSerialPath(key))
         at = at.parent
         key = at?.mountKey ?? '$'
      }
      return segments.reverse().join('.')
   }

   /**
    * need to be overwritten for all contaienr fields
    * @undecorated (placeholder made to be overriden)
    */
   getChildrenSerialPath(key: string): string {
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
   get childrenAll(): Field[] {
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
   get childrenActive(): Field[] {
      return this.childrenAll
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
   get subFieldsWithKeys(): KeyedField[] {
      return []
   }

   // #region TRANSACTION
   /**
    * proxy this.repo.action
    * defined to shorted call and allow per-field override
    */
   runInTransaction<T>(fn: (tct: Transaction) => T): T {
      return this.repo.runInTransaction(fn)
   }

   /**
    * equivalent to `runInTransaction(() => patchSerial(() => {....}))`
    */
   patchInTransaction(fn: (draft: this['$serial'], tct: Transaction) => undefined): this {
      this.runInTransaction((tct) => this.patchSerial((draft) => fn(draft, tct)))
      return this
   }

   /**
    * DO NOT OVERRIDE.
    * @internal
    */
   protected assignNewSerial(next: this['$serial']): void {
      const tct = this.repo.tct
      if (tct == null)
         throw new Error(
            '❌ patchSerial should be called within a transaction; you may want to use `patchInTransaction`',
         )

      // console.log(`[🤠] ${this.path}`, JSON.stringify(this.serial), JSON.stringify(next), this.serial === next)
      if (this.serial === next) return
      runInAction(() => {
         tct.trackAsUpdated(this)
         this.serial = next
         this.__version__++
         this.parent?._acknowledgeNewChildSerial(this.mountKey, this.serial)
      })
   }

   /** @undecorated (we really don't need this anymore; legacy stuff; to remove) */
   __version__: number = 1

   /**
    * equivalent to `produce`, followed by `assignNewSerial` (if something did change)
    *
    * return false when the lambda did not change the serial, and
    * true when serial has been updated by the lambda
    * @internal
    */
   patchSerial(
      //
      fn: (draft: this['$serial']) => undefined,
      /*
       * cowe uld allow K['$serial'] and hand it back to the caller
       * to match immerjs API
       * | fn: (serial: K['$serial']) => undefined  | K['$serial']
       */
   ): boolean {
      if (this.repo.tct == null)
         throw new Error(
            '❌ patchSerial should be called within a transaction; you may want to use `patchInTransaction`',
         )
      // console.log(`[🧑‍🦯‍➡️] patch serial called from ${this.pathExt}`)
      // from 2024-09-09, serial are not longer observable objects
      if (isObservable(this.serial)) throw new Error('❌ serial should not be observable')

      // apply patch function
      const nextState = produce(this.serial, fn)
      const stateChanged = nextState !== this.serial // ⚠️ Ref equality check
      if (!stateChanged) return false // patch function did nothing; we can safely abort

      // otherwise, assign serial to current field, and bubble upwards to the document rot
      this.assignNewSerial(nextState)
      return true
   }

   /**
    * if your field have children, you need to be able to acknolewdge
    * if they changed their serial.
    * don't forget to recursively call this method on this field's parent.
    *
    * (this method needs a true implementation in every field that use RECONCILE)
    */
   _acknowledgeNewChildSerial(mountKey: string, serial: any): boolean {
      throw new Error(`🔴 _acknowledgeNewChildSerial not implemented (${this.pathExt})`)
   }

   // --------------------------------------------------------------------------------
   // 🔶 the 5 getters bellow are temporary hacks to make shared keep working
   // until every shared usage has been migrated

   /**
    * getter that resolve to `this.schema.producers`
    * @undecorated
    */
   get producers(): Publication<any, any>[] {
      return this.schema.publications
   }

   /**
    * getter that resolve to `this.schema.publish`
    * @undecorated
    */
   get publish(): CSchema['publishToChannel'] {
      return this.schema.publishToChannel
   }

   /**
    * getter that resolve to `this.schema.subscribe`
    * @undecorated
    */
   get subscribe(): CSchema['subscribeToChannel'] {
      return this.schema.subscribeToChannel
   }

   /**
    * getter that resolve to `this.schema.reactions`
    * @undecorated
    */
   get reactions(): CSchema['reactions'] {
      return this.schema.reactions
   }

   /**
    * getter that resolve to `this.schema.addReaction`
    * @undecorated
    */
   get addReaction(): CSchema['addReaction'] {
      return this.schema.addReaction
   }

   /** probably the wrong place to retrieve that now that presenter are comming */
   get icon(): Maybe<IconName> {
      const x = this.schema.config.icon
      if (typeof x === 'function') return x(this)
      if (x == null) return null

      return x
   }

   private _hasBeenInitialized: boolean = false

   /** this function MUST be called at the end of every widget constructor */
   protected init(
      //
      serial?: this['$serial'],
   ): void {
      // /* 😂 */ console.log(`[🤠] ${getUIDForMemoryStructure(serial)} (field.init)`)

      // 1. ensure field hasn't been initialized yet
      if (this._hasBeenInitialized)
         return console.error(`[🔶] Field.init has already been called => ABORTING`)
      this._hasBeenInitialized = true

      // 2. ...
      this.runInTransaction((tct) => {
         // this.copyCommonSerialFields(serial)
         this.repo._registerField(this, tct)

         //   VVVVVVVVVVVV this is where we hydrate children
         this.setOwnSerialWithValidationAndMigrationAndFixes(serial)

         this.UI = this.UI.bind(this)
         this.ready = true
      })
   }

   cloneWithoutParent(): this {
      return this.schema.create(this.serial) as this
   }

   cloneTheWholeTree(): this {
      const r = this.root.cloneWithoutParent()
      return r.getFieldAt(this.path) as this
   }

   cloneWithConfig(config: Partial<this['$config']>, opts?: WithConfigOptions): this {
      return this.schema.withConfig(config, opts).create(this.serial) as this
   }

   codeForTypescriptValue(p?: { indent?: number }): string {
      return this.schema.codeForTypescriptValue(p)
   }
   // ---------------------------------------------------------------

   get hasSnapshot(): boolean {
      return this.serial.snapshot != null
   }

   @computed get hasFoldableSubfieldsThatAreUnfolded(): boolean {
      return this.childrenAll.some((f) => f.isCollapsible && !f.serial.collapsed)
   }

   @computed get hasFoldableSubfieldsThatAreFolded(): boolean {
      return this.childrenAll.some((f) => f.isCollapsible && Boolean(f.serial.collapsed))
   }

   @computed get hasFoldableSubfields(): boolean {
      return this.childrenAll.some((f) => f.isCollapsible)
   }

   deleteSnapshot(): void {
      this.patchInTransaction((draft) => {
         delete draft.snapshot
      })
   }

   /** update current field snapshot */
   saveSnapshot(): this['$serial'] {
      const snapshot = produce(this.serial, (draft) => {
         // a bad person would say: "Yo, Dawg; I heard you liked snapshots. So I put a snapshot in your snapshot, so you can snapshot while snapshotting"
         // but it's wrong. we don't want snapshotception.
         // so we delete the snapshot from the snapshot before it's too late.
         // otherwise, once we take a second snapshot, the first snapshot will indeed appear in the second snapshot.
         // Snapshot.
         delete draft.snapshot
      })

      // delete snapshot.snapshot

      this.patchInTransaction((draft) => void (draft.snapshot = snapshot))
      return snapshot
   }

   /** revert to the last snapshot */
   revertToSnapshot(): void {
      // 🔘 IX++
      // 🔘 console.log(`[🤠] #${IX} seri`, getUIDForMemoryStructure(this.serial))
      // 🔘 console.log(`[🤠] #${IX} snap`, getUIDForMemoryStructure(this.serial.snapshot))

      // 🔘 console.log(`[🤠] #${IX} seri.values`, getUIDForMemoryStructure(this.serial?.values))
      // 🔘 console.log(`[🤠] #${IX} snap.values`, getUIDForMemoryStructure(this.serial.snapshot?.values))
      if (this.serial.snapshot == null) {
         // 🔘 console.log(`[🤠] #${IX} RESET`)
         return this.reset()
      }
      // 🔘 console.log(`[🤠] #${IX} SNAP=`, deepCopyNaive(this.serial.snapshot))
      this.setSerial(this.serial.snapshot)
   }

   get isDirtyFromSnapshot_UNSAFE(): boolean {
      const { snapshot, ...currentSerial } = this.serial
      if (snapshot == null) return false
      return hashJSONObjectToNumber(snapshot) !== hashJSONObjectToNumber(currentSerial)
   }

   get hashSerial(): number {
      return hashJSONObjectToNumber(this.serial)
   }

   abstract isOwnSet: boolean

   /**
    * return true if and only if self and every descendant is set.
    * [not made to be overriden]
    */
   get isSet(): boolean {
      if (!this.isOwnSet) return false
      if (this.childrenActive.some((f) => !f.isSet)) return false
      return true
   }

   get labelText(): string {
      if (this.config.label == null) {
         if (this.parent?.type === 'link') {
            if (this.parent.path === '$') return '$'
            return `🔶 préciser le label pour ${this.path}`
         }
         const mountKey = this.parent?.type === 'optional' ? this.parent.mountKey : this.mountKey
         return makeLabelFromPrimitiveValue(mountKey)
      }
      if (this.config.label === false) return '' // not sure about the config.label doc
      return this.config.label
   }

   private _extraSaveChangesFunction: (() => Promise<void> | void)[] = []
   onSaveChanges(fn: () => Promise<void> | void): void { this._extraSaveChangesFunction.push(fn) } // prettier-ignore
   public async saveChanges(): Promise<void> {
      for (const fn of this._extraSaveChangesFunction) await fn()
      this.touched = false
   }

   /**
    * defined by subtypes
    */
   get isEmpty(): boolean {
      return false
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
