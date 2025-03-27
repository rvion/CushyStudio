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
export type Field_group_config<T extends SchemaDict> = Field_group<T>['Ҩconfig']
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
   summary?: CovariantFn<[items: { [k in keyof T]: T[k]['Ҩvalue'] }, self: Field_group<T>], string>
   // (
   //    //
   // ): string

   /** @default @false */
   presetButtons?: boolean
   default?: T['Ҩvalue']

   // 🔶 TODO 1: remove summary from here and move it to the base field config directly
   // 🟢 TODO 2: stop passing values to that function, only pass the field directly
   // TODO 3: add a similary Cell option on the base fieldconfig, that return a ReactNode instead of a string
   // TODO 4: add various .customXXX on each ....
}

// SERIAL
export type Field_group_serial<T extends SchemaDict> = Field_group<T>['Ҩserial']
type Field_group_ownSerial<T extends SchemaDict> = {
   $: 'group'
   // fix required here; invariant violation!
   // TODO: why is that not optional ? it should be.
   values_: { [K in keyof T]?: T[K]['Ҩserial'] }
}

// VALUE
export type Field_group_value<T extends SchemaDict> = {
   [k in keyof T]: T[k]['Ҩvalue']
}

export type Field_group_SetValue<T extends SchemaDict> = {
   [k in keyof T]?: T[k]['Ҩsetvalue']
}

export type Field_group_unchecked<T extends SchemaDict> = {
   [k in keyof T]: T[k]['Ҩunchecked']
}

// TYPES
export interface Field_group<T extends SchemaDict = SchemaDict> {
   Ҩtype: 'group'
   ҨownConfig: Field_group_ownConfig<T>
   ҨownSerial: Field_group_ownSerial<T>
   Ҩvalue: Field_group_value<T>
   Ҩsetvalue: Field_group_SetValue<T>
   Ҩunchecked: Field_group_unchecked<T>
   Ҩchild: T[keyof T]['Ҩfield']
   Ҩopts: unknown
   ҨownPatch: Patch<'group'>
   // own
   Ҩsubfields: T
}

// ---------------------------------------------------------------------------
// 💬 2025-02-10 rvion: pending decision about removal or not
/** @deprecated */
export type FieldGroupWithMAGICFIELDS<T extends SchemaDict> = Field_group<T> & MAGICFIELDS<T>
export type MAGICFIELDS<T extends { [key: string]: { Ҩfield: any } }> = {
   [K in keyof T /* as Capitalize<K & string> */]: T[K]['Ҩfield']
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
      value: Maybe<Field_group<any>['Ҩvalue']>,
      config: Field_group<any>['Ҩconfig'],
   ): Field_group<any>['Ҩserial'] {
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
            get: (): any => this.ϟfields[fName],
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
   override get ϟsummary(): string {
      return (
         this.ϟconfig.toString_?.(this) ?? // 👇🤔 Maybe we don't want to invoke the summary unless the field is valid -> it could throw with children that have a throwable _or_zero
         this.ϟconfig.summary?.(this.ϟvalue_or_zero, this) ??
         ''
      )
      // return this.config.summary?.(this.value) ?? Object.keys(this.fields).length + ' fields'
   }

   override get ϟjustifyLabel(): boolean {
      if (this.ϟnumFields > 1) return false
      return true
   }

   // #region PROBLEMS
   get ϟownConfigSpecificProblems(): Problem_Ext {
      return null
   }

   get ϟownTypeSpecificProblems(): Problem_Ext {
      return null
   }

   // #region CHANGES
   get ϟisOwnSet(): boolean {
      return true
      // return this.subFields.every((f) => f.isSet)
   }

   @computed get ϟhasChanges(): boolean {
      const fields: Field[] = Object.values(this.ϟfields)
      return fields.some((f) => f.ϟhasChanges)
   }
   //            IMPOSSIBLE
   //                VV
   // [x.a<, x.a<, x.a.b<, x.a.b>, x.a>]
   // runInTransaction

   // #region SERIAL
   protected ϟsetOwnSerial(next: Field_group_serial<T>): void {
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
      this.ϟassignNewSerial(next)

      // 3. RECONCILE CHILDREN
      for (const [fName, fSchema] of this._fieldSchemas) {
         // reconcile can yield different serial during setSerial; both for
         // - new child (e.g. running migration),
         // - old child (e.g. default value beeing added in setOwnSerial)
         this.ϟRECONCILE({
            mountKey: fName,
            existingChild: this.ϟfields[fName],
            correctChildSchema: fSchema,
            targetChildSerial: next?.values_?.[fName],
            attach: (child) => {
               this.ϟfields[fName] = child
               const isNew = !(fName in next.values_)
               if (isNew) {
                  const hasDefault = this.ϟconfig.default != null && fName in this.ϟconfig.default
                  if (hasDefault) {
                     child.value = this.ϟconfig.default![fName as keyof T['Ҩvalue']]
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
   ϟfields: { [k in keyof T]: T[k]['Ҩfield'] } = observable({}) as any
   override ϟacknowledgeNewChildSerial(mountKey: string, newChildSerial: any): boolean {
      // fast path: abort when exactly the same
      if (this.ϟserial.values_[mountKey] === newChildSerial) return false
      // console.log(`[🤠] ACK`, getUIDForMemoryStructure(newChildSerial), getUIDForMemoryStructure(this.serial), this.serial)
      return this.ϟpatchSerial((draft) => void ((draft.values_ as any)[mountKey] = newChildSerial))
      // console.log(`[🤠] ACK`, getUIDForMemoryStructure(newChildSerial), getUIDForMemoryStructure(this.serial), this.serial)
   }

   /** all [key,value] pairs */
   @computed get ϟentries(): [string, Field][] {
      return Object.entries(this.ϟfields) as [string, Field][]
   }

   @computed get ϟnumFields(): number {
      return Object.keys(this.ϟfields).length
   }

   /** return item at give key */
   ϟat<K extends keyof T>(key: K): T[K]['Ҩfield'] {
      return this.ϟfields[key]
   }

   override ϟgetChildrenSerialPath(branchName: keyof T & string): string {
      return `values_.${branchName}`
   }

   @computed override get ϟchildrenAll(): Field[] {
      return Object.values(this.ϟfields)
   }

   override get ϟsubFieldsWithKeys(): KeyedField[] {
      return Object.entries(this.ϟfields).map(([key, field]) => ({ key, field }))
   }

   /** just here to normalize fieldSchema definitions, since it used to be a lambda */
   private get _fieldSchemas(): [keyof T & string, CSchema<any>][] {
      const itemsDef = this.ϟconfig.items
      const fieldSchemas: SchemaDict =
         typeof itemsDef === 'function' //
            ? ((itemsDef as any)() ?? {}) // <-- LEGACY SUPPORT
            : (itemsDef ?? {})
      return Object.entries(fieldSchemas) as [keyof T & string, CSchema<any>][]
   }
   // #region VALUE
   override ϟset(x: this['Ҩsetvalue']): this {
      this.ϟrunInTransaction(() => {
         for (const key in x) {
            const child = this.ϟfields[key]
            if (child == null) {
               console.error( `🔴 Field_Group(${this.ϟpath}).setValue: invalid key "${key}" with value`, x[key]) // prettier-ignore
               continue
            }
            child.ϟset(x[key])
         }
      })
      return this
   }

   get ϟvalue(): Field_group_value<T> {
      return this.ϟvalue_or_fail
   }

   set ϟvalue(val: Field_group_value<T>) {
      this.ϟrunInTransaction(() => {
         for (const key in val) {
            const child = this.ϟfields[key]
            if (child == null) {
               console.warn(`🔴 Field_Group(${this.ϟpath}).value: invalid key "${key}" with value`, val[key], Object.keys(this.ϟfields)) // prettier-ignore
               continue
            }
            child.ϟvalue = val[key]
         }
      })
   }

   get ϟvalue_or_fail(): Field_group_value<T> {
      const value = new Proxy({}, this.makeValueProxy('fail'))
      void this.ϟserial
      Object.defineProperty(this, 'value_or_fail', {
         get: () => {
            void this.ϟserial
            return value
         },
      })
      return value
   }
   get ϟvalue_or_zero(): Field_group_value<T> {
      const value = new Proxy({}, this.makeValueProxy('zero'))
      void this.ϟserial
      Object.defineProperty(this, 'value_or_zero', {
         get: () => {
            void this.ϟserial
            return value
         },
      })
      return value
   }
   get ϟvalue_unchecked(): Field_group_unchecked<T> {
      const value = new Proxy({}, this.makeValueProxy('unchecked'))
      void this.ϟserial
      Object.defineProperty(this, 'value_unchecked', {
         get: () => {
            void this.ϟserial
            return value
         },
      })
      return value
   }
   get ϟvalue_set(): Field_group_SetValue<T> {
      const value = new Proxy({}, this.makeValueProxy('set'))
      void this.ϟserial
      Object.defineProperty(this, 'value_set', {
         get: () => {
            void this.ϟvalue
            return value
         },
      })
      return value
   }

   public ϟisValueEqual(other: Field): boolean {
      if (other === this) return true
      if (!(other instanceof Field_group)) return false
      const otherChildren = other.ϟchildrenActive
      const thisChildren = this.ϟchildrenActive

      if (otherChildren.length !== thisChildren.length) return false

      return thisChildren.every((child) => {
         const otherChild = other.ϟfields[child.ϟmountKey]
         if (otherChild == null) return false

         return child.ϟmountKey === otherChild.mountKey && child.ϟisValueEqual(otherChild)
      })
   }

   public static readonly patchedSerialPaths: readonly string[] = Object.freeze([])

   private makeValueProxy(mode: VALUE_MODE): ProxyHandler<any> {
      return {
         ownKeys: (_target): string[] => {
            return Object.keys(this.ϟfields)
         },
         set: (_target, prop, value): boolean => {
            if (typeof prop !== 'string') return false
            const subWidget: Maybe<Field> = this.ϟfields[prop]
            if (subWidget == null) return false
            subWidget.ϟvalue = value
            return true
         },
         get: (_target, prop): any => {
            if (typeof prop !== 'string') return
            const subWidget: Maybe<Field> = this.ϟfields[prop]
            if (subWidget == null) return
            if (!(subWidget instanceof Field)) return void console.log(`[🔶] tried to access non-field`, prop)
            return subWidget.ϟgetValue(mode)
         },
         getOwnPropertyDescriptor: (_target, prop): PropertyDescriptor | undefined => {
            if (typeof prop !== 'string') return
            const subWidget: Maybe<Field> = this.ϟfields[prop]
            if (subWidget == null) return
            if (!(subWidget instanceof Field)) return void console.log(`[🔶] tried to access non-field`, prop)
            return {
               enumerable: true,
               configurable: true,
               get(): any {
                  return subWidget.ϟgetValue(mode)
               },
            }
         },
      }
   }

   override ϟgetSetValue(): this['Ҩsetvalue'] | undefined {
      // console.log(`[💀 getSetValue] `, this.path)
      return this.ϟvalue_set
   }

   override ϟreset(): void {
      super.ϟreset()
      this.ϟchildrenAll.forEach((f) => f.ϟreset())
   }

   override ϟrandomize(): void {
      this.ϟchildrenAll.forEach((f) => f.ϟrandomize())
   }
}

// DI
registerFieldClass('group', Field_group)
Field_group satisfies FieldConstructor<Field_group>
