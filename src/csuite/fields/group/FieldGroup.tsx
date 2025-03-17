import type { CSchema } from '../../model/CSchema'
import type { KeyedField, VALUE_MODE } from '../../model/Field'
import type { FieldConfig_CommonProperties } from '../../model/FieldConfig'
import type { CodegenOpts, FieldConstructor, SchemaDictWithPaths } from '../../model/FieldConstructor'
import type { Patch } from '../../model/Patch'
import type { Repository } from '../../model/Repository'
import type { SchemaDict } from '../../model/SchemaDict'
import type { Problem_Ext } from '../../model/Validation'

import { produce } from 'immer'
import { computed, observable } from 'mobx'

import { Field } from '../../model/Field'
import { capitalize } from '../../utils/capitalize'
import { registerFieldClass } from '../WidgetUI.DI'

// CONFIG
export type Field_group_config<T extends SchemaDict> = Field_group<T>['$config']
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
   summary?(
      //
      items: { [k in keyof T]: T[k]['$value'] },
      self: Field_group<T>,
   ): string

   /** @default @false */
   presetButtons?: boolean
   default?: T['$value']

   // 🔶 TODO 1: remove summary from here and move it to the base field config directly
   // 🟢 TODO 2: stop passing values to that function, only pass the field directly
   // TODO 3: add a similary Cell option on the base fieldconfig, that return a ReactNode instead of a string
   // TODO 4: add various .customXXX on each ....
}

// SERIAL
export type Field_group_serial<T extends SchemaDict> = Field_group<T>['$serial']
type Field_group_ownSerial<T extends SchemaDict> = {
   $: 'group'
   // fix required here; invariant violation!
   // TODO: why is that not optional ? it should be.
   values_: { [K in keyof T]?: T[K]['$serial'] }
}

// VALUE
export type Field_group_value<T extends SchemaDict> = {
   [k in keyof T]: T[k]['$value']
}

export type Field_group_SetValue<T extends SchemaDict> = {
   [k in keyof T]?: T[k]['$setValue']
}

export type Field_group_unchecked<T extends SchemaDict> = {
   [k in keyof T]: T[k]['$unchecked']
}

// TYPES
export interface Field_group<T extends SchemaDict = SchemaDict> {
   $type: 'group'
   $ownConfig: Field_group_ownConfig<T>
   $ownSerial: Field_group_ownSerial<T>
   $value: Field_group_value<T>
   $setValue: Field_group_SetValue<T>
   $unchecked: Field_group_unchecked<T>
   $child: T[keyof T]['$field']
   $opts: unknown
   $ownPatch: Patch<'group'>
   // own
   $subfields: T
}

// ---------------------------------------------------------------------------
// 💬 2025-02-10 rvion: pending decision about removal or not
/** @deprecated */
export type FieldGroupWithMAGICFIELDS<T extends SchemaDict> = Field_group<T> & MAGICFIELDS<T>
export type MAGICFIELDS<T extends { [key: string]: { $field: any } }> = {
   [K in keyof T as Capitalize<K & string>]: T[K]['$field']
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
      value: Maybe<Field_group<any>['$value']>,
      config: Field_group<any>['$config'],
   ): Field_group<any>['$serial'] {
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
         properties[capitalize(fName)] = {
            get: (): any => this.fields[fName],
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
   override get summary(): string {
      return (
         this.config.toString_?.(this) ?? // 👇🤔 Maybe we don't want to invoke the summary unless the field is valid -> it could throw with children that have a throwable _or_zero
         this.config.summary?.(this.value_or_zero, this) ??
         ''
      )
      // return this.config.summary?.(this.value) ?? Object.keys(this.fields).length + ' fields'
   }

   override get justifyLabel(): boolean {
      if (this.numFields > 1) return false
      return true
   }

   // #region PROBLEMS
   get ownConfigSpecificProblems(): Problem_Ext {
      return null
   }

   get ownTypeSpecificProblems(): Problem_Ext {
      return null
   }

   // #region CHANGES
   get isOwnSet(): boolean {
      return true
      // return this.subFields.every((f) => f.isSet)
   }

   get hasChanges(): boolean {
      const fields: Field[] = Object.values(this.fields)
      return fields.some((f) => f.hasChanges)
   }
   //            IMPOSSIBLE
   //                VV
   // [x.a<, x.a<, x.a.b<, x.a.b>, x.a>]
   // runInTransaction

   // #region SERIAL
   protected setOwnSerial(next: Field_group_serial<T>): void {
      // setOwnSerial(next) is just here to call `this.serial = next`
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
      //   - 2. ASSIGN SERIAL (yup, just call `this.assignNewSerial(next)`, or use the setter alias `this.serial = ...`)
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
      this.assignNewSerial(next)

      // 3. RECONCILE CHILDREN
      for (const [fName, fSchema] of this._fieldSchemas) {
         // reconcile can yield different serial during setSerial; both for
         // - new child (e.g. running migration),
         // - old child (e.g. default value beeing added in setOwnSerial)
         this.RECONCILE({
            mountKey: fName,
            existingChild: this.fields[fName],
            correctChildSchema: fSchema,
            targetChildSerial: next?.values_?.[fName],
            attach: (child) => {
               this.fields[fName] = child
               const isNew = !(fName in next.values_)
               if (isNew) {
                  const hasDefault = this.config.default != null && fName in this.config.default
                  if (hasDefault) {
                     child.value = this.config.default![fName as keyof T['$value']]
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
   fields: { [k in keyof T]: T[k]['$field'] } = observable({}) as any
   get _(): { [k in keyof T]: T[k]['$field'] } {
      return this.fields
   }

   override _acknowledgeNewChildSerial(mountKey: string, newChildSerial: any): boolean {
      // fast path: abort when exactly the same
      if (this.serial.values_[mountKey] === newChildSerial) return false
      // console.log(`[🤠] ACK`, getUIDForMemoryStructure(newChildSerial), getUIDForMemoryStructure(this.serial), this.serial)
      return this.patchSerial((draft) => void ((draft.values_ as any)[mountKey] = newChildSerial))
      // console.log(`[🤠] ACK`, getUIDForMemoryStructure(newChildSerial), getUIDForMemoryStructure(this.serial), this.serial)
   }

   /** all [key,value] pairs */
   @computed get entries(): [string, Field][] {
      return Object.entries(this.fields) as [string, Field][]
   }

   @computed get numFields(): number {
      return Object.keys(this.fields).length
   }

   /** return item at give key */
   at<K extends keyof T>(key: K): T[K]['$field'] {
      return this.fields[key]
   }

   override getChildrenSerialPath(branchName: keyof T & string): string {
      return `values_.${branchName}`
   }

   @computed override get childrenAll(): Field[] {
      return Object.values(this.fields)
   }

   override get subFieldsWithKeys(): KeyedField[] {
      return Object.entries(this.fields).map(([key, field]) => ({ key, field }))
   }

   /** just here to normalize fieldSchema definitions, since it used to be a lambda */
   private get _fieldSchemas(): [keyof T & string, CSchema<any>][] {
      const itemsDef = this.config.items
      const fieldSchemas: SchemaDict =
         typeof itemsDef === 'function' //
            ? ((itemsDef as any)() ?? {}) // <-- LEGACY SUPPORT
            : (itemsDef ?? {})
      return Object.entries(fieldSchemas) as [keyof T & string, CSchema<any>][]
   }
   // #region VALUE
   setPartialValue(val: Field_group_SetValue<T>): this {
      return this.set(val)
   }

   override set(x: this['$setValue']): this {
      this.runInTransaction(() => {
         for (const key in x) {
            const child = this.fields[key]
            if (child == null) {
               console.error( `🔴 Field_Group(${this.path}).setValue: invalid key "${key}" with value`, x[key]) // prettier-ignore
               continue
            }
            child.set(x[key])
         }
      })
      return this
   }

   get value(): Field_group_value<T> {
      return this.value_or_fail
   }

   set value(val: Field_group_value<T>) {
      this.runInTransaction(() => {
         for (const key in val) {
            const child = this.fields[key]
            if (child == null) {
               console.warn(`🔴 Field_Group(${this.path}).value: invalid key "${key}" with value`, val[key], Object.keys(this.fields)) // prettier-ignore
               continue
            }
            child.value = val[key]
         }
      })
   }

   get value_or_fail(): Field_group_value<T> {
      const value = new Proxy({}, this.makeValueProxy('fail'))
      void this.serial
      Object.defineProperty(this, 'value_or_fail', {
         get: () => {
            void this.serial
            return value
         },
      })
      return value
   }
   get value_or_zero(): Field_group_value<T> {
      const value = new Proxy({}, this.makeValueProxy('zero'))
      void this.serial
      Object.defineProperty(this, 'value_or_zero', {
         get: () => {
            void this.serial
            return value
         },
      })
      return value
   }
   get value_unchecked(): Field_group_unchecked<T> {
      const value = new Proxy({}, this.makeValueProxy('unchecked'))
      void this.serial
      Object.defineProperty(this, 'value_unchecked', {
         get: () => {
            void this.serial
            return value
         },
      })
      return value
   }
   get value_set(): Field_group_SetValue<T> {
      const value = new Proxy({}, this.makeValueProxy('set'))
      void this.serial
      Object.defineProperty(this, 'value_set', {
         get: () => {
            void this.value
            return value
         },
      })
      return value
   }

   public isValueEqual(other: Field): boolean {
      if (other === this) return true
      if (!(other instanceof Field_group)) return false
      const otherChildren = other.childrenActive
      const thisChildren = this.childrenActive

      if (otherChildren.length !== thisChildren.length) return false

      return thisChildren.every((child) => {
         const otherChild = other.fields[child.mountKey]
         if (otherChild == null) return false

         return child.mountKey === otherChild.mountKey && child.isValueEqual(otherChild)
      })
   }

   public static readonly patchedSerialPaths: readonly string[] = Object.freeze([])

   private makeValueProxy(mode: VALUE_MODE): ProxyHandler<any> {
      return {
         ownKeys: (_target): string[] => {
            return Object.keys(this.fields)
         },
         set: (_target, prop, value): boolean => {
            if (typeof prop !== 'string') return false
            const subWidget: Maybe<Field> = this.fields[prop]
            if (subWidget == null) return false
            subWidget.value = value
            return true
         },
         get: (_target, prop): any => {
            if (typeof prop !== 'string') return
            const subWidget: Maybe<Field> = this.fields[prop]
            if (subWidget == null) return
            if (!(subWidget instanceof Field)) return void console.log(`[🔶] tried to access non-field`, prop)
            return subWidget.getValue(mode)
         },
         getOwnPropertyDescriptor: (_target, prop): PropertyDescriptor | undefined => {
            if (typeof prop !== 'string') return
            const subWidget: Maybe<Field> = this.fields[prop]
            if (subWidget == null) return
            if (!(subWidget instanceof Field)) return void console.log(`[🔶] tried to access non-field`, prop)
            return {
               enumerable: true,
               configurable: true,
               get(): any {
                  return subWidget.getValue(mode)
               },
            }
         },
      }
   }

   override getSetValue(): this['$setValue'] | undefined {
      // console.log(`[💀 getSetValue] `, this.path)
      return this.value_set
   }

   override reset(): void {
      super.reset()
      this.childrenAll.forEach((f) => f.reset())
   }

   override randomize(): void {
      this.childrenAll.forEach((f) => f.randomize())
   }
}

// DI
registerFieldClass('group', Field_group)
Field_group satisfies FieldConstructor<Field_group>
