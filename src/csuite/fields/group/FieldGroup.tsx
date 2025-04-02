import type { CSchema } from '../../model/CSchema'
import type { KeyedField, VALUE_MODE } from '../../model/Field'
import type { FieldConfig_CommonProperties } from '../../model/FieldConfig'
import type { CodegenOpts, FieldConstructor, SchemaDictWithPaths } from '../../model/FieldConstructor'
import type { Patch } from '../../model/Patch'
import type { Repository } from '../../model/Repository'
import type { SchemaDict } from '../../model/SchemaDict'
import type { Problem_Ext } from '../../model/Validation'
import type { CovariantFn } from '../../variance/BivariantHack'

import { produce } from 'immer'
import { computed, observable } from 'mobx'

import { Field } from '../../model/Field'
import { capitalize } from '../../utils/capitalize'
import { registerFieldClass } from '../WidgetUI.DI'

// CONFIG
export type Field_group_config<T extends SchemaDict> = Field_group<T>['::Config']
type Field_group_ownConfig<T extends SchemaDict> = {
   /**
    * Lambdas allowed only for recursive fields;
    *   => Don't use that to change the fields dynamically
    *   => If you want a dynamic field, use a b.dynamic(() => b.group(...)) instead, so you can controll
    *      how the field is re-instanciated when schema changes.
    *      This is a very important concept to understand, and we don't want to pollute the group field
    *      with the complexity of dynamic fields.
    */
   items?: T | (() => T)

   /** @deprecated; use `toString` instead */
   summary?: CovariantFn<[items: { [k in keyof T]: T[k]['::Value'] }, self: Field_group<T>], string>
   // (
   //    //
   // ): string

   /** @default @false */
   presetButtons?: boolean
   default?: T['::Value']

   // 🔶 TODO 1: remove summary from here and move it to the base field config directly
   // 🟢 TODO 2: stop passing values to that function, only pass the field directly
   // TODO 3: add a similary Cell option on the base fieldconfig, that return a ReactNode instead of a string
   // TODO 4: add various .customXXX on each ....
}

// SERIAL
export type Field_group_serial<T extends SchemaDict> = Field_group<T>['::Serial']
type Field_group_ownSerial<T extends SchemaDict> = {
   $: 'group'
   // fix required here; invariant violation!
   // TODO: why is that not optional ? it should be.
   values_: { [K in keyof T]?: T[K]['::Serial'] }
}

// VALUE
export type Field_group_value<T extends SchemaDict> = {
   [k in keyof T]: T[k]['::Value']
}

export type Field_group_SetValue<T extends SchemaDict> = {
   [k in keyof T]?: T[k]['::Setvalue']
}

export type Field_group_unchecked<T extends SchemaDict> = {
   [k in keyof T]: T[k]['::Unchecked']
}

// TYPES
export interface Field_group<T extends SchemaDict = SchemaDict> {
   '::Type': 'group'
   '::OwnConfig': Field_group_ownConfig<T>
   '::OwnSerial': Field_group_ownSerial<T>
   '::Value': Field_group_value<T>
   '::Setvalue': Field_group_SetValue<T>
   '::Unchecked': Field_group_unchecked<T>
   '::Child': T[keyof T]['::Field']
   '::Opts': unknown
   '::OwnPatch': Patch<'group'>
   // own
   '::Subfields': T
}

// ---------------------------------------------------------------------------
// 💬 2025-02-10 rvion: pending decision about removal or not
/** @deprecated */
export type FieldGroupWithMAGICFIELDS<T extends SchemaDict> = Field_group<T> & MAGICFIELDS<T>
export type MAGICFIELDS<T extends { [key: string]: { '::Field': any } }> = {
   [K in keyof T /* as Capitalize<K & string> */]: T[K]['::Field']
}

export class Field_group<T extends SchemaDict> extends Field {
   static readonly type: 'group' = 'group'
   private static readonly unsetSerial: Field_group_serial<any> = { $: 'group', values_: {} }
   static override migrateSerial(): undefined {}
   static codeForTypescriptValue = (config: Field_group_config<SchemaDict>, opts: CodegenOpts): string => {
      const schemaDict = Field_group.getSchemaDict(config)
      if (schemaDict == null) return 'never'
      const fields = Object.entries(schemaDict)
      const getComment = (field: { config: FieldConfig_CommonProperties<any> }): string =>
         field.config.label == null ? '' : ` /* ${field.config.label} */`
      const tab = opts.tab
      const myIndent = opts.indent ?? 0
      const indentStr = tab.repeat(myIndent)
      const childIndent = tab.repeat(myIndent + 1)
      const childOpts = { ...opts, indent: myIndent + 1 }
      let out = '{\n'
      for (const f of fields)
         out += `${childIndent}${f[0]}${getComment(f[1])}: ${f[1].codeForTypescriptValue(childOpts)},\n`
      out += `${indentStr}}`
      return out
   }
   static getSchemaDict(config: Field_group_config<SchemaDict>): SchemaDict {
      return typeof config.items === 'function' ? config.items() : (config.items ?? {})
   }
   static override getChildren(config: Field_group_config<SchemaDict>): SchemaDictWithPaths {
      const X = this.getSchemaDict(config)
      const OUT: SchemaDictWithPaths = {}
      for (const [k, v] of Object.entries(X)) {
         OUT[k] = { schema: v, serialPath: `values_.${k}` }
      }
      return OUT
   }
   static generateSerial(
      value: Maybe<Field_group<any>['::Value']>,
      config: Field_group<any>['::Config'],
   ): Field_group<any>['::Serial'] {
      const configItems = typeof config.items === 'function' ? config.items() : config.items
      if (configItems == null) return this.unsetSerial

      return {
         $: 'group',
         values_: Object.fromEntries(
            Object.entries(configItems).map(([k, schema]) => [
               k,
               (schema as CSchema).generateSerial(value?.[k] ?? config.default?.[k]),
            ]),
         ) as any,
      }
   }

   private _defineMagicFields(): void {
      const properties: PropertyDescriptorMap & ThisType<any> = {}
      for (const [fName, fSchema] of this._fieldSchemas) {
         properties[fName as string] = {
            get: (): any => this.zFields[fName],
            configurable: true,
         }
      }
      Object.defineProperties(this, properties)
   }

   constructor(
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: CSchema<Field_group<T>>,
      initialMountKey: string,
      serial?: Field_group_serial<T>,
   ) {
      super(repo, root, parent, schema as any, initialMountKey, serial)
      this._defineMagicFields()
      this.init(serial)
   }

   // #region UI
   override get zSummary(): string {
      return (
         this.zConfig.toString_?.(this) ?? // 👇🤔 Maybe we don't want to invoke the summary unless the field is valid -> it could throw with children that have a throwable _or_zero
         this.zConfig.summary?.(this.zValue_or_zero, this) ??
         ''
      )
      // return this.config.summary?.(this.value) ?? Object.keys(this.fields).length + ' fields'
   }

   override get zJustifyLabel(): boolean {
      if (this.zNumFields > 1) return false
      return true
   }

   // #region PROBLEMS
   get zOwnConfigSpecificProblems(): Problem_Ext {
      return null
   }

   get zOwnTypeSpecificProblems(): Problem_Ext {
      return null
   }

   // #region CHANGES
   get zIsOwnSet(): boolean {
      return true
      // return this.subFields.every((f) => f.isSet)
   }

   @computed get zHasChanges(): boolean {
      const fields: Field[] = Object.values(this.zFields)
      return fields.some((f) => f.zHasChanges)
   }
   //            IMPOSSIBLE
   //                VV
   // [x.a<, x.a<, x.a.b<, x.a.b>, x.a>]
   // runInTransaction

   // #region SERIAL
   protected zSetOwnSerial(next: Field_group_serial<T>): void {
      // with some extra stuff. it's almost a regular field action, execpt
      // it's internal, and has a few extra responsibilities (like fixing external serials)
      // so it's efficient and avoids producing intermediary serials.
      //
      // your `setOwnSerial` should in order
      //   - 1. CANONICAL SERIAL FORM (tweak the input serial into it's canonical form)
      //       - 1.1 add various default values when they need to be persisted in serial uppon instanciation.
      //       - 1.2 add various missing expected properties
      //             (sometimes, they are marked optional, but it's convenient to add them early here)
      //
      //   - 2. ASSIGN SERIAL (yup, just call `this.assignNewSerial(next)`, or use the setter alias `this.zSerial = ...`)
      //
      //   - 3. RECONCILIATION (finally, reconcile the children)
      //        they may produce new versions, but that's OKAY.
      //        if you find a better way to assign the serial only once at the end only, let's discuss it !
      //        (But beware of dragons, it's easy to break the mental model during those intermediary steps )

      // 1. MAKE SERIAL CANONICAL
      if (next.values_ == null) {
         next = produce(next, (draft) => void (draft.values_ = {} as any))
      }

      // 2. ASSIGN SERIAL
      this.zAssignNewSerial(next)

      // 3. RECONCILE CHILDREN
      for (const [fName, fSchema] of this._fieldSchemas) {
         // reconcile can yield different serial during setSerial; both for
         // - new child (e.g. running migration),
         // - old child (e.g. default value beeing added in setOwnSerial)
         this.zRECONCILE({
            mountKey: fName,
            existingChild: this.zFields[fName],
            correctChildSchema: fSchema,
            targetChildSerial: next?.values_?.[fName],
            attach: (child) => {
               this.zFields[fName] = child
               const isNew = !(fName in next.values_)
               if (isNew) {
                  const hasDefault = this.zConfig.default != null && fName in this.zConfig.default
                  if (hasDefault) {
                     child.value = this.zConfig.default![fName as keyof T['::Value']]
                  }
               }
            },
         })
      }
   }

   // #region CHILDREN
   /**
    * The dict of all child widgets
    * will be filled during constructor
    * // fix | I'm not really convinces that this should be observable
    * // fix | varying fields should probably always go though a dynamic 🤔
    */
   zFields: { [k in keyof T]: T[k]['::Field'] } = observable({}) as any
   override zAcknowledgeNewChildSerial(mountKey: string, newChildSerial: any): boolean {
      // fast path: abort when exactly the same
      if (this.zSerial.values_[mountKey] === newChildSerial) return false
      return this.zPatchSerial((draft) => void ((draft.values_ as any)[mountKey] = newChildSerial))
   }

   /** all [key,value] pairs */
   @computed get zEntries(): [string, Field][] {
      return Object.entries(this.zFields) as [string, Field][]
   }

   @computed get zNumFields(): number {
      return Object.keys(this.zFields).length
   }

   /** return item at give key */
   zAt<K extends keyof T>(key: K): T[K]['::Field'] {
      return this.zFields[key]
   }

   override zGetChildrenSerialPath(branchName: keyof T & string): string {
      return `values_.${branchName}`
   }

   @computed override get zChildrenAll(): Field[] {
      return Object.values(this.zFields)
   }

   override get zSubFieldsWithKeys(): KeyedField[] {
      return Object.entries(this.zFields).map(([key, field]) => ({ key, field }))
   }

   /** just here to normalize fieldSchema definitions, since it used to be a lambda */
   private get _fieldSchemas(): [keyof T & string, CSchema<any>][] {
      const itemsDef = this.zConfig.items
      const fieldSchemas: SchemaDict =
         typeof itemsDef === 'function' //
            ? ((itemsDef as any)() ?? {}) // <-- LEGACY SUPPORT
            : (itemsDef ?? {})
      return Object.entries(fieldSchemas) as [keyof T & string, CSchema<any>][]
   }
   // #region VALUE
   override zSet(x: this['::Setvalue']): this {
      this.zRunInTransaction(() => {
         for (const key in x) {
            // set support partial values
            if (x[key] === undefined) continue

            const child = this.zFields[key]
            if (child == null) {
               console.error( `🔴 Field_Group(${this.zPath}).setValue: invalid key "${key}" with value`, x[key]) // prettier-ignore
               continue
            }
            child.zSet(x[key])
         }
      })
      return this
   }

   get zValue(): Field_group_value<T> {
      return this.zValue_or_fail
   }

   set zValue(val: Field_group_value<T>) {
      this.zRunInTransaction(() => {
         for (const key in val) {
            const child = this.zFields[key]
            if (child == null) {
               console.warn(`🔴 Field_Group(${this.zPath}).value: invalid key "${key}" with value`, val[key], Object.keys(this.zFields)) // prettier-ignore
               continue
            }
            child.zValue = val[key]
         }
      })
   }

   get zValue_or_fail(): Field_group_value<T> {
      const value = new Proxy({}, this.makeValueProxy('fail'))
      void this.zSerial
      Object.defineProperty(this, 'zValue_or_fail', {
         get: () => {
            void this.zSerial
            return value
         },
      })
      return value
   }
   get zValue_or_zero(): Field_group_value<T> {
      const value = new Proxy({}, this.makeValueProxy('zero'))
      void this.zSerial
      Object.defineProperty(this, 'zValue_or_zero', {
         get: () => {
            void this.zSerial
            return value
         },
      })
      return value
   }
   get zValue_unchecked(): Field_group_unchecked<T> {
      const value = new Proxy({}, this.makeValueProxy('unchecked'))
      void this.zSerial
      Object.defineProperty(this, 'zValue_unchecked', {
         get: () => {
            void this.zSerial
            return value
         },
      })
      return value
   }
   get zValue_set(): Field_group_SetValue<T> {
      const value = new Proxy({}, this.makeValueProxy('set'))
      void this.zSerial
      Object.defineProperty(this, 'zValue_set', {
         get: () => {
            void this.zValue
            return value
         },
      })
      return value
   }

   public zIsValueEqual(other: Field): boolean {
      if (other === this) return true
      if (!(other instanceof Field_group)) return false
      const otherChildren = other.zChildrenActive
      const thisChildren = this.zChildrenActive

      if (otherChildren.length !== thisChildren.length) return false

      return thisChildren.every((child) => {
         const otherChild = other.zFields[child.zMountKey]
         if (otherChild == null) return false

         return child.zMountKey === otherChild.mountKey && child.zIsValueEqual(otherChild)
      })
   }

   public static readonly patchedSerialPaths: readonly string[] = Object.freeze([])

   private makeValueProxy(mode: VALUE_MODE): ProxyHandler<any> {
      return {
         ownKeys: (_target): string[] => {
            return Object.keys(this.zFields)
         },
         set: (_target, prop, value): boolean => {
            if (typeof prop !== 'string') return false
            const subWidget: Maybe<Field> = this.zFields[prop]
            if (subWidget == null) return false
            subWidget.zValue = value
            return true
         },
         get: (_target, prop): any => {
            if (typeof prop !== 'string') return
            const subWidget: Maybe<Field> = this.zFields[prop]
            if (subWidget == null) return
            if (!(subWidget instanceof Field)) return void console.log(`[🔶] tried to access non-field`, prop)
            if (mode === 'set' && !subWidget.zIsSet) return undefined // 🔴
            return subWidget.zGetValue(mode)
         },
         getOwnPropertyDescriptor: (_target, prop): PropertyDescriptor | undefined => {
            if (typeof prop !== 'string') return
            const subWidget: Maybe<Field> = this.zFields[prop]
            if (subWidget == null) return
            if (!(subWidget instanceof Field)) return void console.log(`[🔶] tried to access non-field`, prop)
            return {
               enumerable: true,
               configurable: true,
               get(): any {
                  return subWidget.zGetValue(mode)
               },
            }
         },
      }
   }

   override zGetSetValue(): this['::Setvalue'] | undefined {
      // console.log(`[💀 getSetValue] `, this.path)
      return this.zValue_set
   }

   override zReset(): void {
      super.zReset()
      this.zChildrenAll.forEach((f) => f.zReset())
   }

   override zRandomize(): void {
      this.zChildrenAll.forEach((f) => f.zRandomize())
   }
}

// DI
registerFieldClass('group', Field_group)
Field_group satisfies FieldConstructor<Field_group>
