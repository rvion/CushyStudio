import type { IconName } from '../../icons/IconName'
import type { CSchema } from '../../model/CSchema'
import type { KeyedField, VALUE_MODE } from '../../model/Field'
import type { FieldConfig_CommonProperties } from '../../model/FieldConfig'
import type { CodegenOpts, FieldConstructor, SchemaDictWithPaths } from '../../model/FieldConstructor'
import type { Patch_Common } from '../../model/Patch'
import type { Repository } from '../../model/Repository'
import type { SchemaDict } from '../../model/SchemaDict'
import type { Problem_Ext } from '../../model/Validation'
import type { TabPositionConfig } from './TabPositionConfig'

import { produce } from 'immer'
import { computed, observable, reaction, runInAction } from 'mobx'

import { Field } from '../../model/Field'
import { bang } from '../../utils/bang'
import { capitalize } from '../../utils/capitalize'
import { exhaust } from '../../utils/exhaust'
import { makeLabelFromPrimitiveValue } from '../../utils/makeLabelFromFieldName'
import { isProbablySerialChoices, registerFieldClass } from '../WidgetUI.DI'

type ActiveBranchesByName<T> = { [key in keyof T]?: true }

// 💬 2024-12-30 rvion:
// added so we can offer "smart" completions before having instances.
export function getPossibleChoicesFromConfig(config: Field_choices['Ҩconfig']): string[] {
   const items = config.items
   const out = typeof items === 'function' ? Object.keys((items as any)() ?? {}) : Object.keys(items ?? {})
   return out
}

// #region CONFIG TYPE
type Field_choices_ownConfig<T extends SchemaDict = SchemaDict> = {
   /**
    * schema for  all possible branches
    * when using a lambda: never re-use the same key for different child.
    * if you child branch schema changes, you need to make a new key for it.
    * otherwise, you'll encouter reconciliation errors.
    */
   items: T | ((self?: Field_choices<T>) => T)

   /** if provided, the choice will follow the  */
   dynamic?: (self?: Field_choices<T>) => keyof T & string

   /**
    * true  => 0, 1 or more values can be selected
    * false => one and only one value can be selected (not 0, not 2)
    */
   multi: boolean

   /**
    * either a branch name if only one branch is active,
    * or a Dict<boolean> if multiple
    * // | boolean 🔴 TODO: support boolean default for "ALL ON", or "ALL OFF"
    */
   default?: ActiveBranchesByName<T> | keyof T

   // UI stuff----------------------
   /** placeholder to display in widget that support placeholders */
   placeholder?: string

   /** preffered widget to use for value selection */
   appearance?: 'select' | 'tab' | 'nested' | 'tab2'

   /** if the widget use tabs, where to place tabs */
   tabPosition?: TabPositionConfig

   /** UI stuff */
   expand?: boolean
}

// #region SERIAL TYPE
type Field_choices_ownSerial<T extends SchemaDict = SchemaDict> = {
   $: 'choices'

   /**
    * boolean dict (Record<BranchName, boolean>) of active branches
    * 👉 canonical form: only keep true properties.
    */
   branches?: ActiveBranchesByName<T>

   /** every children serial, including disabled ones */
   values?: { [k in keyof T]?: T[k]['Ҩserial'] }
}

// #region VALUE TYPE
export type Field_choices_value<T extends SchemaDict = SchemaDict> = {
   [k in keyof T]?: T[k]['Ҩfield']['Ҩvalue']
}

export type Field_choices_SetValue<T extends SchemaDict = SchemaDict> = {
   [k in keyof T]?: T[k]['Ҩfield']['Ҩsetvalue']
}

export type Field_choices_unchecked<T extends SchemaDict = SchemaDict> = {
   [k in keyof T]?: T[k]['Ҩfield']['Ҩunchecked']
}

// #region $TypeString
export interface Field_choices<T extends SchemaDict = SchemaDict> {
   ['Ҩtype']: 'choices'
   ['ҨownConfig']: Field_choices_ownConfig<T>
   ['ҨownSerial']: Field_choices_ownSerial<T>
   ['Ҩvalue']: Field_choices_value<T>
   ['Ҩsetvalue']: Field_choices_SetValue<T>
   ['Ҩunchecked']: Field_choices_unchecked<T>
   ['Ҩchild']: T[keyof T]['Ҩfield']
   ['Ҩopts']: unknown
   ['ҨownPatch']: Field_choices_patch<T>
   //
   Ҩsubfields: T
}

export type Field_choices_patch<T extends SchemaDict = SchemaDict> =
   | Field_choices_patch_enable<T>
   | Field_choices_patch_disable<T>
export type Field_choices_patch_enable<T extends SchemaDict = SchemaDict> = Patch_Common<'choices'> & {
   op: 'enable'
   branch: keyof T & string
   value: T[keyof T]['Ҩserial']
}
export type Field_choices_patch_disable<T extends SchemaDict = SchemaDict> = Patch_Common<'choices'> & {
   op: 'disable'
   branch: keyof T & string
}

export type MAGICCHOICES<T extends { [key: string]: { Ҩfield: any } }> = {
   [K in keyof T as Capitalize<K & string>]?: T[K]['Ҩfield']
}

// #region STATE
export class Field_choices<T extends SchemaDict = SchemaDict> extends Field {
   // #region TYPE
   static readonly type: 'choices' = 'choices'
   static readonly codeForTypescriptValue = (config: Field_choices['Ҩconfig'], opts: CodegenOpts): string => {
      const subSchema = config.items
      const schemaDict = typeof subSchema === 'function' ? subSchema() : subSchema
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
      for (const f of fields) {
         out += `${childIndent}${f[0]}${getComment(f[1])}?: ${f[1].codeForTypescriptValue(childOpts)},\n`
      }
      out += `${indentStr}}`
      return out
   }
   static override migrateSerial<T extends SchemaDict>(serial: object): Maybe<Field_choices<T>['Ҩserial']> {
      if (isProbablySerialChoices(serial)) {
         if ('values_' in serial) {
            const legacyValues = serial.values_ as Field_choices<T>['Ҩserial']['values'] // 🔴 very unchecked cast, much danger
            const { $, values_, ...rest } = serial
            const next: Field_choices<T>['Ҩserial'] = {
               $: 'choices',
               values: legacyValues,
               ...rest,
            }
            return next
         }
      }
   }
   static getSchemaDict(config: Field_choices<SchemaDict>['Ҩconfig']): SchemaDict {
      return typeof config.items === 'function' ? config.items() : (config.items ?? {})
   }
   static override getChildren(config: Field_choices<SchemaDict>['Ҩconfig']): SchemaDictWithPaths {
      const X = this.getSchemaDict(config)
      const OUT: SchemaDictWithPaths = {}
      for (const [k, v] of Object.entries(X)) {
         OUT[k] = { schema: v, serialPath: `values.${k}` }
      }
      return OUT
   }

   static generateSerial(
      value: Maybe<Field_choices<SchemaDict>['Ҩvalue']>,
      config: Field_choices<SchemaDict>['Ҩconfig'],
   ): Field_choices<SchemaDict>['Ҩserial'] {
      const configItems = typeof config.items === 'function' ? config.items() : config.items
      const defaultBranches =
         typeof config.default === 'string' ? { [config.default]: null } : (config.default ?? {})
      const branches = Object.keys(value ?? defaultBranches).filter((k) =>
         Object.prototype.hasOwnProperty.call(configItems, k),
      )

      return {
         $: 'choices',
         branches: Object.fromEntries(branches.map((k) => [k, true])) as ActiveBranchesByName<SchemaDict>,
         values: Object.fromEntries(
            branches.map((k) => {
               const configItem = configItems[k] as CSchema

               return [k, configItem.generateSerial(value?.[k])]
            }),
         ) as Field_choices<SchemaDict>['Ҩserial']['values'],
      }
   }

   // TODO: cache it (only compute it once, then store it on schema)
   private _defineMagicFields(): void {
      const properties: PropertyDescriptorMap & ThisType<any> = {}
      for (const [fName, fSchema] of this._fieldSchemas) {
         properties[capitalize(fName)] = {
            get: (): any => this._[fName],
            configurable: true,
         }
      }
      Object.defineProperties(this, properties)
   }

   // #region CTOR
   constructor(
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: CSchema<Field_choices<T>>,
      initialMountKey: string,
      serial?: Field_choices<T>['Ҩserial'],
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      this._defineMagicFields()
      this.init(serial)
      this.startDynamicBehaviour()
   }

   private startDynamicBehaviour(): void {
      const dynamic = this.ϟconfig.dynamic
      if (dynamic == null) return
      const disposeFn = reaction(
         () => dynamic(this),
         (key: keyof T & string) => {
            console.log(`[🤠🦖] startDynamicBehaviour  => setBranchTo("${key}")`)
            this.enableBranch(key)
            // console.log(`[🤠🦖]`, this.serial)
         },
         { fireImmediately: true },
      )
      this.ϟdisposeFns.push(disposeFn)
   }

   // #region MISC
   get expand(): boolean {
      return this.ϟconfig.expand ?? false
   }

   /**
    * true if the choice widget multiple values (0+)
    */
   get isMulti(): boolean {
      return this.ϟconfig.multi
   }

   /**
    * true if the choice widget accept ONE and only ONE value
    * (not 0, not 2+)
    */
   get isSingle(): boolean {
      return !this.ϟconfig.multi
   }

   /**
    * dictionary of enabled children branches
    * TODO: rename
    */
   readonly _: { [k in keyof T]?: T[k]['Ҩfield'] } = observable({})

   @computed get activeBranchesList(): T[keyof T]['Ҩfield'][] {
      return Object.values(this._)
   }

   getChildIfActive<KEY extends keyof T & string>(branchName: KEY): T[KEY]['Ҩfield'] | undefined {
      return this._[branchName]
   }

   get firstPossibleChoice(): (keyof T & string) | undefined {
      return this.allPossibleChoices[0]
   }

   get allPossibleChoices(): (keyof T & string)[] {
      return Object.keys(this.configItems)
   }

   override get ϟisCollapsible(): boolean {
      if (this.isMulti) return false // 🔶 may be wrong, but it really annoys me right now
      if (this.activeBranchNames.length === 0) return false
      return super.ϟisCollapsible
   }

   @computed get choicesWithLabels(): { key: keyof T & string; label: string; icon?: Maybe<IconName> }[] {
      return this.allPossibleChoices.map((key) => {
         const schema = bang(this.getSchemaForBranch(key))
         return {
            key,
            // note:
            // if child.config.label === false => makeLabelFromFieldName(key)
            // if child.config.label === '' => makeLabelFromFieldName(key)
            label:
               typeof schema.config.label === 'string' && schema.config.label.length > 0
                  ? schema.config.label
                  : makeLabelFromPrimitiveValue(key),
            icon: typeof schema.config.icon === 'function' ? schema.config.icon() : schema.config.icon,
         }
      })
   }

   /** array of all active branch keys */
   get activeBranchNames(): (keyof T & string)[] {
      const branches = this.ϟserial.branches
      if (branches == null) return []
      return Object.keys(branches).filter((x) => Boolean(branches[x]))
   }

   get firstActiveBranchName(): (keyof T & string) | undefined {
      return this.activeBranchNames[0]
   }

   get firstActiveBranchField(): T[keyof T]['Ҩfield'] | undefined {
      if (this.firstActiveBranchName == null) return undefined
      return this._[this.firstActiveBranchName]
   }

   /**
    * @since 2024-09-11
    */
   private isValidBranchName(branchName: string): branchName is keyof T & string {
      if (this.allPossibleChoices.includes(branchName)) return true
      return false
   }

   /**
    * return all branches that should be active by default.
    * more practical/consise/efficient that relying on isBranchActiveByDefault
    * @since 2024-09-11
    */
   @computed private get branchesActiveByDefault(): (keyof T & string)[] {
      const def = this.ϟconfig.default
      if (def == null) return []
      if (typeof def === 'string') {
         if (this.isValidBranchName(def)) return [def]
         return []
      }
      return Object.keys(def).filter((k) => this.isValidBranchName(k))
   }

   isBranchActiveByDefault(branchName: keyof T & string): boolean {
      const def = this.ϟconfig.default
      if (def == null) return false
      if (typeof def === 'string') return branchName === def
      return Boolean((def as ActiveBranchesByName<T>)[branchName])

      // 💬 2024-09-11 rvion:
      // | we used to pick the first available branch in single mode
      // | this is now handled at the builder level with `choice` and `choice_`
      // | variants.
      // |
      // | ```
      // | if (def == null) {
      // |     if (this.isMulti) return false
      // |     return this.allPossibleChoices[0] === branchName
      // | }
      // | ```
   }

   // #region Utilities
   private getActiveBranchNamesFromBooleanRecord = (record?: ActiveBranchesByName<T>): (keyof T)[] => {
      if (record == null) return []
      return Object.entries(record)
         .filter(([k, active]) => Boolean(active) && this.allPossibleChoices.includes(k))
         .map(([k]) => k)
   }

   // #region VALIDATION

   get ϟownConfigSpecificProblems(): Problem_Ext {
      return null
   }

   @computed get ϟownTypeSpecificProblems(): Problem_Ext {
      const OUT: Problem_Ext[] = []
      const config = this.ϟconfig
      const serial = this.ϟserial
      if (this.isSingle) {
         const activeBranches = this.getActiveBranchNamesFromBooleanRecord(serial.branches)

         // 1. more than one active branch, while in single mode
         if (activeBranches.length > 1) {
            OUT.push('Only One choices allowed but has multiple active branches')
         }

         // 💬 2024-09-11 rvion:
         // | no longer needed, handled by the `isOwnSet` getter
         // |
         // | ```
         // | // 2. no branch selected
         // | if (activeBranches.length > 1) {
         // |     OUT.push('Only One choices allowed but has multiple active branches')
         // | }
         // | ```
      }
      return OUT
   }

   @computed get ϟhasChanges(): boolean {
      for (const branchName of this.allPossibleChoices) {
         const shouldBeActive = this.isBranchActiveByDefault(branchName)
         const child = this._[branchName]
         if (child && !shouldBeActive) return true
         if (!child && shouldBeActive) return true
         if (child && shouldBeActive && child.ϟhasChanges) return true
      }
      return false
   }

   @computed get ϟisOwnSet(): boolean {
      if (this.ϟserial.values == null) return false
      if (this.ϟserial.branches == null) return false
      return true
      // if (this.subFields.some((f) => !f.isSet)) return false
      // return true
      // // 💬 2024-09-02 rvion:
      // // | seems to be the correct way to go with for optional stuff
      // // | that can be both without default and without value.
      // if (this.isMulti) return true

      // //
      // const hasAtLeastOneActiveBranch = Object.values(this.serial.branches).some((active) => active)
      // if (!hasAtLeastOneActiveBranch) return false
      // return this.subFields.every((f) => f.isSet)
   }

   // #region CHILDREN

   override ϟgetChildrenSerialPath(branchName: keyof T & string): string {
      return `values.${branchName}`
   }

   /**
    * as of 2024-09-11, choices eagerly dispose de-activated branches,
    * so it's active children fields are just the activated one
    */
   @computed override get ϟchildrenAll(): Field[] {
      return Object.values(this._)
   }

   override get ϟchildrenActive(): Field[] {
      return this.ϟchildrenAll
   }

   @computed override get ϟsubFieldsWithKeys(): KeyedField[] {
      return Object.entries(this._).map(([key, field]) => ({ key, field }))
   }

   override ϟacknowledgeNewChildSerial(mountKey: keyof T & string, childSerial: any): boolean {
      if (this.ϟserial.values?.[mountKey] === childSerial) return false

      return this.ϟpatchSerial((draft) => {
         draft.values ??= {}
         draft.values[mountKey] = childSerial
      })
   }

   protected checkConfigValidity(): void {
      // INVARIANT CHECKING -----------------------------------------------------------------------------
      const OUT: Problem_Ext[] = []
      const config = this.ϟconfig

      // 1. more than 1 default, while in single mode
      if (
         this.isSingle &&
         typeof config.default === 'object' &&
         this.getActiveBranchNamesFromBooleanRecord(config.default).length > 1
      ) {
         OUT.push('❌ ChoicesWidget is single but default sets multiple branches')
      }
   }

   @computed private get configItems(): T {
      const X = this.ϟconfig.items
      if (typeof X === 'function') {
         const res = (X as any)(this)
         for (const x of Object.keys(res)) {
            if (res[x] == null) {
               console.log(`[🔶🦖‼️] missing choice: ${x} at (${this.ϟpath})`)
               delete res[x]
            }
         }
         return res ?? {}
      }
      return X ?? {}
   }

   /**
    * technically, we can't always guarantee the config schema dict only contains schema for branches
    * since we allow to pass already instantiated fields instead of schema (in this case, those are wrapped)
    * as Schema as shared (SimpleSchema<Field_shared<....>>)
    */
   private getSchemaForBranch(branchName: keyof T & string): Maybe<CSchema> {
      const schema = this.configItems[branchName]
      if (schema == null) {
         console.log(`[🔶🦖] missing choice: ${branchName} at (${this.ϟpath})`)
         return null
      }
      // if (schema == null) throw new Error(`❌ Branch "${branchName}" has no initializer function`)
      return schema
   }

   /** just here to normalize fieldSchema definitions, since it used to be a lambda */
   @computed private get _fieldSchemas(): [keyof T & string, CSchema<any>][] {
      const fieldSchemas = this.configItems
      return Object.entries(fieldSchemas) as [keyof T & string, CSchema<any>][]
   }

   // #region setOwnSerial
   protected ϟsetOwnSerial(next: this['Ҩserial']): void {
      runInAction(() => {
         this.checkConfigValidity() // 🔴 bof -> à appeler ailleurs

         // Normalization:
         // Only setting values is supported since 2024-09-11
         if (next.values != null && next.branches == null) {
            const branchNames: (keyof T & string)[] = Object.keys(next.values)
            next = produce(next, (draft: this['Ҩserial']) => {
               draft.branches ??= {}
               for (const branchName of branchNames) {
                  draft.branches[branchName] = true
               }
            })
         }

         this.ϟassignNewSerial(next)

         // if field is not set, and field has default => apply default
         if (next.branches == null) {
            const branchesActiveByDefault = this.branchesActiveByDefault
            for (const branch of branchesActiveByDefault) {
               // allocate holes in the serial + set branch active...
               this.ϟpatchSerial((draft) => {
                  draft.values ??= {}
                  draft.branches ??= {}
                  draft.branches[branch] = true
               })
               // ...and reconcile
               this.ϟRECONCILE({
                  mountKey: branch,
                  correctChildSchema: bang(this.getSchemaForBranch(branch)),
                  existingChild: this._[branch],
                  targetChildSerial: null,
                  attach: (child) => {
                     this._[branch] = child
                  },
               })
            }
            return
         }

         // otherwise, simply hydate
         for (const branch of this.allPossibleChoices) {
            const branchSerial = next.values?.[branch]
            const schema = this.getSchemaForBranch(branch)
            const isActive = Boolean(next.branches?.[branch])
            if (isActive) {
               // set the active branch as active...
               this.ϟpatchSerial((draft) => {
                  draft.values ??= {}
                  draft.branches ??= {}
                  draft.branches[branch] = true
               })
               // and reconcile
               this.ϟRECONCILE({
                  mountKey: branch,
                  correctChildSchema: bang(schema),
                  existingChild: this._[branch],
                  targetChildSerial: branchSerial,
                  attach: (child) => {
                     this._[branch] = child
                  },
               })
            } else {
               // remove children
               const prevChild = this._[branch]
               if (prevChild) {
                  prevChild.ϟdisposeTree()
                  delete this._[branch]
               }
            }
         }
      })
   }

   // #region VALUE

   /** results, but only for active branches */
   get ϟvalue(): Field_choices_value<T> {
      return this.ϟvalue_or_fail
   }

   override ϟset(val: Field_choices_SetValue<T>): this {
      this.ϟrunInTransaction(() => {
         for (const branch of this.allPossibleChoices) {
            this._setBranchTo(branch, val[branch])
         }
      })
      return this
   }
   private _setBranchTo(branch: keyof T & string, to?: Maybe<T[keyof T]['Ҩsetvalue']>): void {
      // case 1. branch should be DISABLED
      if (to == null) {
         if (this.isBranchEnabled(branch)) this.disableBranch(branch)
      }
      // case 2. branch should be ENABLED
      else {
         this.ϟrunInTransaction(() => {
            // 2.1. enable branch if disabled
            if (this.isBranchDisabled(branch)) this.enableBranch(branch)

            // 2.2 then patch branch value to given value
            this._[branch]!.ϟset(to!)
         })
      }
   }

   set ϟvalue(val: Field_choices_value<T>) {
      this.ϟrunInTransaction(() => {
         for (const branch of this.allPossibleChoices) {
            this._setBranchValue(branch, val[branch])
         }
      })
   }

   get ϟvalue_or_fail(): Field_choices_value<T> {
      const value = new Proxy({} as any, this.makeValueProxy('fail'))
      void this.ϟserial
      Object.defineProperty(this, 'value_or_fail', {
         get: () => {
            void this.ϟserial
            return value
         },
      })
      return value
   }
   get ϟvalue_or_zero(): Field_choices_value<T> {
      const value = new Proxy({} as any, this.makeValueProxy('zero'))
      void this.ϟserial
      Object.defineProperty(this, 'value_or_zero', {
         get: () => {
            void this.ϟserial
            return value
         },
      })
      return value
   }
   get ϟvalue_unchecked(): Field_choices_unchecked<T> {
      const value = new Proxy({} as any, this.makeValueProxy('unchecked'))
      void this.ϟserial
      Object.defineProperty(this, 'value_unchecked', {
         get: () => {
            void this.ϟserial
            return value
         },
      })
      return value
   }
   get value_set(): Field_choices_SetValue<T> {
      const value = new Proxy({} as any, this.makeValueProxy('set'))
      void this.ϟserial
      Object.defineProperty(this, 'value_set', {
         get: () => {
            void this.ϟserial
            return value
         },
      })
      return value
   }

   override ϟisValueEqual(other: Field): boolean {
      if (!(other instanceof Field_choices)) return false
      return (
         this.hasSameActivatedBranches(other) &&
         this.ϟchildrenActive.every((f) => {
            const otherChild = other._[f.ϟmountKey]

            if (otherChild == null) return false

            return f.ϟisValueEqual(otherChild)
         })
      )
   }

   private hasSameActivatedBranches(referenceField: Field_choices<any>): boolean {
      if (this.activeBranchNames.length !== referenceField.activeBranchNames.length) return false

      const theseActive = new Set(this.activeBranchNames)
      const referenceActive = new Set(referenceField.activeBranchNames)

      for (const branch of theseActive) {
         if (!referenceActive.has(branch)) return false
      }

      return true
   }

   private makeValueProxy(mode: VALUE_MODE): ProxyHandler<any> {
      return {
         ownKeys: (_target): string[] => {
            return this.activeBranchNames
         },
         set: (_target, prop, value): boolean => {
            if (typeof prop !== 'string') return false
            const branchName = prop
            const subWidget: Maybe<Field> = this._[branchName]
            // case when branch currently DISABLED
            if (subWidget == null) {
               const field = this.enableBranch(branchName)
               if (field == null) return false
               field.ϟvalue = value
               return true
            }
            // case when branch currently ENABLED
            else {
               subWidget.ϟvalue = value
               return true
            }
         },
         get: (_target, prop): any => {
            if (typeof prop !== 'string') return
            const branchName = prop
            const subWidget: Maybe<Field> = this._[branchName]
            if (subWidget == null) return
            if (!(subWidget instanceof Field)) return void console.log(`[🔶] tried to access non-field`, prop)
            return subWidget.ϟgetValue(mode)
         },
         getOwnPropertyDescriptor: (_target, prop): PropertyDescriptor | undefined => {
            if (typeof prop !== 'string') return
            const branchName = prop
            const subWidget: Maybe<Field> = this._[branchName]
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
      return this.value_set
   }

   // #region METHODS
   disableBranch(branch: keyof T & string): void {
      // ensure branch to disable is enabled
      if (!this._[branch]) {
         return // console.info(`❌ Branch "${branch}" not enabled`)
      }
      this.ϟrunInTransaction(() => {
         // remove children
         const prevChild = this._[branch]
         if (prevChild) prevChild.ϟdisposeTree()
         delete this._[branch]

         // WE NEED TO KEEP THIS ONE UNLESS WE WANT TO DISCARD THE DRAFT
         // we could make this opt-in via a config flag and persist in memory only via enableBranch
         // delete this.serial.values_[branch]

         this.ϟpatchSerial((draft) => {
            draft.branches ??= {}
            delete draft.branches[branch] // = false
         })
      })
   }

   enableBranch<K extends keyof T & string>(branchName: K): Maybe<T[K]['Ҩfield']> {
      // ensure branch to enable is disabled
      if (this.isBranchEnabled(branchName)) {
         void console.info(`❌ Branch "${branchName}" already enabled`)
         return this._[branchName]
      }

      this.ϟrunInTransaction(() => {
         const schema = this.getSchemaForBranch(branchName)
         if (schema == null) return null

         if (this.isSingle) {
            for (const key in this._) {
               this.disableBranch(key)
            }
         }

         this.ϟRECONCILE({
            mountKey: branchName,
            correctChildSchema: schema,
            existingChild: this._[branchName],
            targetChildSerial: this.ϟserial.values?.[branchName],
            attach: (child) => {
               this._[branchName] = child
            },
         })

         // set the active branch as active
         this.ϟpatchSerial((draft) => {
            draft.branches ??= {}
            draft.branches[branchName] = true
         })
      })

      return this._[branchName]
   }

   toggleBranch(branch: keyof T & string): void {
      // 💬 2024-03-15 rvion: no need to bumpValue in this function;
      // | it's handled by enableBranch and disableBranch themselves.
      if (this.isBranchEnabled(branch)) {
         if (this.isMulti) this.disableBranch(branch)
      } else {
         this.enableBranch(branch)
      }
   }

   isBranchDisabled(branch: keyof T & string): boolean {
      return !this.isBranchEnabled(branch)
   }

   isBranchEnabled(branch: keyof T & string): boolean {
      if (this.ϟserial.branches == null) return false
      return Boolean(this.ϟserial.branches[branch])
   }

   /**
    * this method:
    *
    *  - DOES not change the active branch / nor toogle the branch
    *    It ONLY sets the branch value, but the branch remains either enabled or disabled
    *    according ot its previous state
    *
    *  - returns `true` if actually changed something, false otherwise
    *    (return type needed because this method is used in the value proxy)
    *
    */
   private _setBranchValue(
      //
      branch: keyof T & string,

      /**
       * pass null or undefined to disable the branch
       *
       * 🙈 < YES, you could have a choices<optional<int>>
       *      and you could want to disable the optional instead.
       *      but same goes for optional<optional<int>>
       *      or optional<optional<optional<int>>>.
       *
       *      Let's just say that passing null disable the highest
       *      level field that can be disabled.
       */
      value?: Maybe<T[keyof T]['Ҩvalue']>,
   ): boolean {
      // case 1. branch should be DISABLED
      if (value == null) {
         // disable branch
         if (this.isBranchEnabled(branch)) {
            this.disableBranch(branch)
            return true
         } else {
            return false
         }
      }

      // case 2. branch should be ENABLED
      else {
         // 2.1. enable branch if disabled
         if (this.isBranchDisabled(branch)) this.enableBranch(branch)

         // 2.2 then patch branch value to given value
         this._[branch]!.ϟvalue = value!
         return true
      }
   }

   // #region Matching
   matchCase<R, DEF = null>(
      cases: {
         [K in keyof T]?: (field: T[K]['Ҩfield']) => R
      },
      def: DEF,
   ): R | DEF {
      for (const branch of this.activeBranchesList) {
         if (branch != null && branch.ϟmountKey in cases) {
            return cases[branch.ϟmountKey]!(branch)
         }
      }
      return def
   }

   // sigh, nullable composition...
   // matchExhaustive<R>(cases: {
   //    [K in keyof T]: (field: T[K]['Ҩfield']) => R
   // }): [null] extends [R] ? "❌ match branches cannot return 'null'" : R

   matchExhaustive<R>(cases: {
      [K in keyof T]: (field: T[K]['Ҩfield']) => R
   }): R {
      const result = this.matchCase(cases, _NotExhaustive)
      if (result == _NotExhaustive)
         throw new Error(
            `❌ matchExhaustive did not have exhaustive cases (missing:${this.activeBranchNames})`,
         )
      return result
   }

   matchAll<R>(cases: {
      [K in keyof T]?: (field: T[K]['Ҩfield']) => R
   }): R[] {
      const OUT: R[] = []
      for (const branch of this.activeBranchesList) {
         if (branch != null && branch.ϟmountKey in cases) {
            OUT.push(cases[branch.ϟmountKey]!(branch))
         }
      }
      return OUT
   }

   // #region SETTERS
   override ϟrandomize(): void {
      // pick ONE random branch
      const branches = this.allPossibleChoices
      const branch = branches[Math.floor(Math.random() * branches.length)]
      if (branch == null) return
      this.enableBranch(branch)
      this.ϟchildrenActive.forEach((f) => f.ϟrandomize())
   }

   // #region PATCH

   public static readonly patchedSerialPaths: readonly string[] = Object.freeze([])

   protected override ϟgenerateOwnPatches(referenceField: this): Field_choices_patch<T>[] {
      const patches: Field_choices_patch<T>[] = []

      Object.entries(this._)
         .filter(([name]) => !referenceField.isBranchEnabled(name))
         .forEach(([name, child]) => {
            patches.push({
               op: 'enable',
               fieldPath: this.ϟpath,
               fieldType: 'choices',
               branch: name,
               value: child.serial,
            })
         })

      Object.entries(referenceField._)
         .filter(([name]) => !this.isBranchEnabled(name))
         .forEach(([name]) => {
            patches.push({
               op: 'disable',
               fieldPath: this.ϟpath,
               fieldType: 'choices',
               branch: name,
            })
         })

      return patches
   }

   protected override ϟapplyOwnPatches(patches: Field_choices_patch<T>[]): void {
      if (patches.length === 0) return

      this.ϟrunInTransaction(() => {
         patches.forEach((patch) => {
            if (isEnablePatch(patch)) {
               const activeChild = this.getChildIfActive(patch.branch)
               if (activeChild != null) {
                  activeChild.ϟsetSerial(patch.value)
                  return
               }

               this.ϟpatchSerial((draft) => {
                  draft.values ??= {}
                  draft.values[patch.branch] = patch.value
               })

               this.enableBranch(patch.branch)
            } else if (isDisablePatch(patch)) {
               this.disableBranch(patch.branch)
            } else {
               exhaust(patch)
            }
         })
      })
   }
}

// DI
registerFieldClass('choices', Field_choices)
Field_choices satisfies FieldConstructor<Field_choices>

const _NotExhaustive = Symbol.for('NotExhaustive')

function isEnablePatch<T extends SchemaDict>(
   patch: Field_choices_patch<T>,
): patch is Field_choices_patch_enable<T> {
   return patch.op === 'enable'
}

function isDisablePatch<T extends SchemaDict>(
   patch: Field_choices_patch<T>,
): patch is Field_choices_patch_disable<T> {
   return patch.op === 'disable'
}
