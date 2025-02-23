import type { CSchema } from '../../model/CSchema'
import type { CodegenOpts } from '../../model/FieldConstructor'
import type { Patch } from '../../model/Patch'
import type { Repository } from '../../model/Repository'
import type { SchemaDict } from '../../model/SchemaDict'
import type { Problem, Problem_Ext } from '../../model/Validation'

import { observable } from 'mobx'

import { Field, type KeyedField } from '../../model/Field'
import { registerFieldClass } from '../WidgetUI.DI'

// #region Config
export type Field_optional_config<T extends CSchema = CSchema> = Field_optional<T>['$config']
type Field_optional_ownConfig<T extends CSchema = CSchema> = {
   /** if true, child field will be instanciated by default */
   startActive?: boolean
   /** child schema; schema you want  to make optional */
   schema: T
}

// #region Serial
export type Field_optional_serial<T extends CSchema = CSchema> = Field_optional<T>['$serial']
type Field_optional_ownSerial<T extends CSchema = CSchema> = {
   $: 'optional'
   child?: Maybe<T['$serial']>
   active?: boolean
}

// #region Value
export type Field_optional_value<T extends CSchema = CSchema> = T['$value'] | undefined
export type Field_optional_SetValue<T extends CSchema = CSchema> = T['$setValue'] | undefined | null

// #region Types
export interface Field_optional<T extends CSchema = CSchema> {
   $type: 'optional'
   $ownConfig: Field_optional_ownConfig<T>
   $ownSerial: Field_optional_ownSerial<T>
   $value: Field_optional_value<T>
   $setValue: Field_optional_SetValue<T>
   $unchecked: Field_optional_value<T>
   $child: T['$Field']
   $opts: unknown
   $ownPatch: Patch<'optional'>
}

// #region State
export class Field_optional<out T extends CSchema = CSchema> extends Field {
   // #region Type
   static readonly type: 'optional' = 'optional'
   static readonly emptySerial: Field_optional_serial = { $: 'optional' }
   static override migrateSerial(): undefined {}
   static codeForTypescriptValue = (config: Field_optional_config, opts: CodegenOpts): string => {
      const childSchema = config.schema
      const childCodeRepr = childSchema.codeForTypescriptValue(opts)
      return `Maybe<${childCodeRepr}>`
   }
   static override getChildren(config: any): SchemaDict {
      return { child: config.schema }
   }

   // #region Ctor
   constructor(
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: CSchema<Field_optional<T>>,
      initialMountKey: string,
      serial?: Field_optional_serial<T>,
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      this.init(serial)
   }

   // #region UI
   override get actualWidgetToDisplay(): Field {
      return this.child.actualWidgetToDisplay
   }

   /** so optional fields do not increase nesting twice */
   override get indentChildren(): number {
      return 0
   }

   // #region Serial
   protected setOwnSerial(next: Field_optional_serial<T>): void {
      // new guideline for setOwnSerial:
      // > 1. normalize (via produce)

      // 💬 2024-09-11 rvion:
      // | WE CAN'T DO THIS
      // | since optioanl always instanciate its child,
      // | it's alwaysgoint to fill serial.child, even when no
      // | default.
      // |
      // | ```
      // | // Only setting child serial is supported since 2024-09-11
      // | // it implies active true
      // | if (next.child != null && next.active == null) {
      // |     next = produce(next, (draft: this['$serial']) => {
      // |         draft.active = true
      // |     })
      // | }
      // | ```

      // > 2. assign
      // > 3.1 EITHER (when unset): apply default (with reconcile if need be)
      // > 2.3.    OR (when set)  : just reconcile

      this.assignNewSerial(next)

      // when is not set
      if (next.active == null && this.config.startActive != null) {
         this.patchSerial((draft) => void (draft.active = this.config.startActive))
      }

      this.RECONCILE({
         mountKey: 'child',
         existingChild: this.child,
         correctChildSchema: this.config.schema,
         targetChildSerial: next?.child,
         attach: (child) => {
            this.child = child
         },
      })
   }

   get isOwnSet(): boolean {
      // 💬 2024-09-02 rvion:
      // | e.g. choice().optional()
      // | when activating the choice, we can't necessarilly pick an option
      // | so the optional node is transitively not-set.
      if ('active' in this.serial) {
         if (this.serial.active) return 'child' in this.serial
         return true
      }
      return false
   }

   // #region Changes
   get hasChanges(): boolean {
      // active by default
      if (this.config.startActive) {
         if (!this.serial.active) return true
         return this.child.hasChanges
      }
      // unactive by default
      else {
         if (!this.serial.active) return false
         return true
      }
   }

   // #region Problems
   get ownConfigSpecificProblems(): Problem_Ext {
      return null
   }

   get ownTypeSpecificProblems(): Problem_Ext {
      return null
   }

   // 🦀 I think we might need to override this here since we probably don't want
   // to return the child's problems if the optional is not active
   // Or maybe we do ? But then we should not be relying on that to determine validity
   override get allErrorsIncludingChildrenErrors(): Problem[] {
      if (!this.serial.active) return []
      return super.allErrorsIncludingChildrenErrors
   }

   // #region Children
   @observable.ref accessor child!: T['$Field']

   getChildIfActive(): Maybe<T['$Field']> {
      return this.serial.active ? this.child : null
   }

   override _acknowledgeNewChildSerial(mountKey: string, serial: any): boolean {
      if (mountKey !== 'child') throw new Error(`❌ invalid mountKey (${mountKey} for serial)`)
      const didChange = this.patchSerial((draft) => void (draft.child = serial))
      return didChange
   }

   get childOrThrow(): T['$Field'] {
      if (this.child == null) throw new Error('❌ optional active but child is null')
      return this.child
   }

   override getChildrenSerialPath(branchName: 'child'): string {
      return `child`
   }

   override get childrenAll(): Field[] {
      return [this.child]
   }

   override get childrenActive(): Field[] {
      if (!this.serial.active) return []
      return [this.child]
   }

   override get subFieldsWithKeys(): KeyedField[] {
      return this.serial.active ? [{ key: 'child', field: this.child }] : []
   }

   // #region Value
   override set(next: Field_optional_value<T>): this {
      if (next == null) {
         this.setActive(false)
      } else {
         this.setActive(true)
         this.child.set(next)
      }
      return this
   }
   override getSetValue(): this['$setValue'] | undefined {
      return this.child.getSetValue()
   }

   get value(): Field_optional_value<T> {
      return this.value_or_fail
   }

   set value(next: Field_optional_SetValue<T>) {
      if (next == null) {
         this.setActive(false)
         return
      } else {
         this.setActive(true)
         this.child.value = next
      }
   }

   get value_or_fail(): Field_optional_value<T> {
      if (!this.serial.active) return
      return this.childOrThrow.value_or_fail
   }

   get value_or_zero(): Field_optional_value<T> {
      if (!this.serial.active) return null
      return this.childOrThrow.value_or_zero
   }

   get value_unchecked(): Field_optional_value<T> {
      if (!this.serial.active) return null
      return this.childOrThrow.value_unchecked
   }

   override isValueEqual(other: Field): boolean {
      if (!(other instanceof Field_optional)) return false
      if (this.serial.active !== other.serial.active) return false
      if (this.serial.active === false) return true

      return this.child.isValueEqual(other.child)
   }

   public override readonly patchedSerialPaths: string[] = ['active']

   // #region Nullability
   get canBeSetOnOrOff(): true {
      return true
   }

   /** set the value to true */
   setOn(): void {
      this.setActive(true)
   }

   /** set the value to false */
   setOff(): void {
      this.setActive(false)
   }

   // #region Setters
   setActive(value: boolean): void {
      if (this.serial.active === value) return
      this.runInTransaction(() => {
         this.patchSerial((draft) => void (draft.active = value))

         // update child collapsed state if need be
         if (value) this.child.setCollapsed(false)
         else this.child.setCollapsed(true)
      })
   }

   get active(): boolean {
      return this.serial.active === true
   }

   set active(value: boolean) {
      this.setActive(value)
   }

   /**
    * similar to reset,
    * except when unactive by default => only reset the active property
    * 👉 the base reset() will always reset the child
    * 👉 this resetFast will only reset the child is active.
    */
   resetFast(): void {
      // active by default
      if (this.config.startActive) {
         if (!this.serial.active) this.setActive(true)
         if (this.child.hasChanges) this.child.reset()
         return
      }
      // unactive by default
      else {
         if (this.serial.active) this.setActive(false)
         return
      }
   }

   override randomize(): void {
      const active = Math.random() < 0.5
      this.setActive(active)
      if (active) this.child.randomize()
   }

   public override get isRequired(): boolean {
      return false
   }

   override get isEmpty(): boolean {
      return !this.active
   }
}

// DI
registerFieldClass('optional', Field_optional)
