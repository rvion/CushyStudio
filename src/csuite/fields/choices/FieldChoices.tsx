import type { IconName } from '../../icons/IconName'
import type { CSchema } from '../../model/CSchema'
import type { KeyedField, VALUE_MODE } from '../../model/Field'
import type { FieldConfig_CommonProperties } from '../../model/FieldConfig'
import type { CodegenOpts, FieldConstructor, SchemaDictWithPaths } from '../../model/FieldConstructor'
import type { FieldSerial_CommonProperties } from '../../model/FieldSerial'
import type { Patch_Common } from '../../model/Patch'
import type { Repository } from '../../model/Repository'
import type { SchemaDict } from '../../model/SchemaDict'
import type { Problem_Ext } from '../../model/Validation'
import type { TabPositionConfig } from './TabPositionConfig'

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
export function getPossibleChoicesFromConfig(config: Field_choices['{config}']): string[] {
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

   /** defaults to true */
   preserveDisabledBranches?: boolean

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
export type Field_choices_ownSerial_old1<T extends SchemaDict = SchemaDict> = {
   $: 'choices'
   /** boolean dict (Record<BranchName, boolean>) of active branches */
   branches?: ActiveBranchesByName<T>
   /** every children serial, including disabled ones */
   values_?: { [k in keyof T]?: T[k]['{serial}'] }
}

export type Field_choices_ownSerial_old2<T extends SchemaDict = SchemaDict> = {
   $: 'choices'
   /** boolean dict (Record<BranchName, boolean>) of active branches */
   branches?: ActiveBranchesByName<T>
   /** every children serial, including disabled ones */
   values?: { [k in keyof T]?: T[k]['{serial}'] }
}

type Field_choices_ownSerial<T extends SchemaDict = SchemaDict> = {
   $: 'choices'
   n?: { [k in keyof T]?: T[k]['{serial}'] }
   /** every children serial, including disabled ones */
   y?: { [k in keyof T]?: T[k]['{serial}'] }
}

// #region VALUE TYPE
export type Field_choices_value<T extends SchemaDict = SchemaDict> = {
   [k in keyof T]?: T[k]['{field}']['{value}']
}

export type Field_choices_SetValue<T extends SchemaDict = SchemaDict> = {
   [k in keyof T]?: T[k]['{field}']['{setValue}']
}

export type Field_choices_unchecked<T extends SchemaDict = SchemaDict> = {
   [k in keyof T]?: T[k]['{field}']['{unchecked}']
}

// #region $TypeString
export interface Field_choices<T extends SchemaDict = SchemaDict> {
   '{type}': 'choices'
   '{ownConfig}': Field_choices_ownConfig<T>
   '{ownSerial}': Field_choices_ownSerial<T>
   '{value}': Field_choices_value<T>
   '{setValue}': Field_choices_SetValue<T>
   '{unchecked}': Field_choices_unchecked<T>
   '{child}': T[keyof T]['{field}']
   '{opts}': unknown
   '{ownPatch}': Field_choices_patch<T>
   //
   '{subfields}': T
}

export type Field_choices_patch<T extends SchemaDict = SchemaDict> =
   | Field_choices_patch_enable<T>
   | Field_choices_patch_disable<T>

export type Field_choices_patch_enable<T extends SchemaDict = SchemaDict> = Patch_Common<'choices'> & {
   op: 'enable'
   branch: keyof T & string
   serial?: T[keyof T]['{serial}']
}
export type Field_choices_patch_disable<T extends SchemaDict = SchemaDict> = Patch_Common<'choices'> & {
   op: 'disable'
   branch: keyof T & string
}

export type MAGICCHOICES<T extends { [key: string]: { '{field}': any } }> = {
   [K in keyof T]?: T[K]['{field}']
}

// #region STATE
export class Field_choices<T extends SchemaDict = SchemaDict> extends Field {
   // #region TYPE
   static readonly type: 'choices' = 'choices'
   static readonly codeForTypescriptValue = (
      config: Field_choices['{config}'],
      opts: CodegenOpts,
   ): string => {
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
   static override migrateSerial<T extends SchemaDict>(serial: object): Maybe<Field_choices<T>['{serial}']> {
      if (isProbablySerialChoices(serial)) {
         type SOld1 = FieldSerial_CommonProperties & Field_choices_ownSerial_old1
         type SOld2 = FieldSerial_CommonProperties & Field_choices_ownSerial_old2
         type SOK = FieldSerial_CommonProperties & Field_choices_ownSerial

         let next: any = serial

         // 1st migration --------------------------------------------------------
         if ('values_' in serial) {
            const serialOld1 = serial as SOld1
            const { $, values_, ...rest } = serialOld1
            const migrated: SOld2 = { $: 'choices', values: values_, ...rest }

            next = migrated
            console.log(`[🤠] post migration 1`, JSON.stringify(next))
         }

         // 2nd migration ------------------------------------------------------------
         if ('branches' in next) {
            const serialOld2 = next as SOld2
            const { $, values, branches, ...rest } = serialOld2
            const y: SOK['y'] = {}
            let n: SOK['n'] | undefined
            if (values == null) next = { $: 'choices', y: {}, n: {}, ...rest }
            else {
               for (const [branchName, childSerial] of Object.entries(values)) {
                  const isActive = Boolean(branches?.[branchName])
                  if (isActive) y[branchName] = childSerial
                  else (n ??= {})[branchName] = childSerial
               }
               next = { $: 'choices', y, n, ...rest }
            }
            console.log(`[🤠] post migration 2`, JSON.stringify(next))
         }

         return next
      }
   }
   static getSchemaDict(config: Field_choices<SchemaDict>['{config}']): SchemaDict {
      return typeof config.items === 'function' ? config.items() : (config.items ?? {})
   }
   static override getChildren(config: Field_choices<SchemaDict>['{config}']): SchemaDictWithPaths {
      const X = this.getSchemaDict(config)
      const OUT: SchemaDictWithPaths = {}
      for (const [k, v] of Object.entries(X)) {
         OUT[k] = { schema: v, serialPath: `y.${k}` }
      }
      return OUT
   }

   static generateSerial(
      setValue: Maybe<Field_choices<SchemaDict>['{setValue}']>,
      config: Field_choices<SchemaDict>['{config}'],
   ): Field_choices<SchemaDict>['{serial}'] {
      const configItems =
         typeof config.items === 'function' //
            ? config.items()
            : config.items

      // get list of branch to enable
      let enabledBranchesList: string[]
      if (setValue != null) {
         enabledBranchesList = Object.keys(setValue)
      } else if (config.default != null) {
         if (typeof config.default === 'string') {
            enabledBranchesList = [config.default]
         } else {
            enabledBranchesList = Object.keys(config.default)
         }
      } else {
         enabledBranchesList = []
      }
      const y: Field_choices<SchemaDict>['{serial}']['y'] = {}
      for (const branchName of enabledBranchesList) {
         if (!Object.prototype.hasOwnProperty.call(configItems, branchName)) continue
         const childSchema = configItems[branchName] as CSchema
         const childSetValue = setValue?.[branchName]
         const childSerial = childSchema.generateSerial(childSetValue)
         y[branchName] = childSerial
      }

      return { $: 'choices', y: y }
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
      serial?: Field_choices<T>['{serial}'],
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      this._defineMagicFields()
      this.init(serial)
      this.startDynamicBehaviour()
   }

   private startDynamicBehaviour(): void {
      const dynamic = this.zConfig.dynamic
      if (dynamic == null) return
      const disposeFn = reaction(
         () => dynamic(this),
         (key: keyof T & string) => {
            if (this.isBranchDisabled(key)) {
               console.log(`[🤠🦖] startDynamicBehaviour  => setBranchTo("${key}")`)
               this.zEnableBranch(key)
            }
            // console.log(`[🤠🦖]`, this.zSerial)
         },
         { fireImmediately: true, name: `choices-dynamic@${this.zPath}` },
      )
      this.zDisposeFns.push(disposeFn)
   }

   // #region MISC
   get expand(): boolean {
      return this.zConfig.expand ?? false
   }

   /**
    * true if the choice widget multiple values (0+)
    */
   get isMulti(): boolean {
      return this.zConfig.multi
   }

   /**
    * true if the choice widget accept ONE and only ONE value
    * (not 0, not 2+)
    */
   get isSingle(): boolean {
      return !this.zConfig.multi
   }

   /**
    * dictionary of enabled children branches
    * TODO: rename
    */
   readonly _: { [k in keyof T]?: T[k]['{field}'] } = observable({})

   @computed get activeBranchesList(): T[keyof T]['{field}'][] {
      return Object.values(this._)
   }

   getChildIfActive<KEY extends keyof T & string>(branchName: KEY): T[KEY]['{field}'] | undefined {
      return this._[branchName]
   }

   get firstPossibleChoice(): (keyof T & string) | undefined {
      return this.allPossibleChoices[0]
   }

   get allPossibleChoices(): (keyof T & string)[] {
      return Object.keys(this.configItems)
   }

   override get zIsCollapsible(): boolean {
      if (this.isMulti) return false // 🔶 may be wrong, but it really annoys me right now
      if (this.activeBranchNames.length === 0) return false
      return super.zIsCollapsible
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
      const branches = this.zSerial.y
      if (branches == null) return []
      return Object.keys(branches)
   }

   get firstActiveBranchName(): (keyof T & string) | undefined {
      return this.activeBranchNames[0]
   }

   get firstActiveBranchField(): T[keyof T]['{field}'] | undefined {
      if (this.firstActiveBranchName == null) return undefined
      return this._[this.firstActiveBranchName]
   }

   private isValidBranchName(branchName: string): branchName is keyof T & string {
      if (this.allPossibleChoices.includes(branchName)) return true
      return false
   }

   /**
    * return all branches that should be active by default.
    * more practical/consise/efficient that relying on isBranchActiveByDefault
    */
   @computed private get branchesActiveByDefault(): (keyof T & string)[] {
      const def = this.zConfig.default
      if (def == null) return []
      if (typeof def === 'string') {
         if (this.isValidBranchName(def)) return [def]
         return []
      }
      return Object.keys(def).filter((k) => this.isValidBranchName(k))
   }

   isBranchActiveByDefault(branchName: keyof T & string): boolean {
      const def = this.zConfig.default
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

   get zOwnConfigSpecificProblems(): Problem_Ext {
      return null
   }

   @computed get zOwnTypeSpecificProblems(): Problem_Ext {
      const OUT: Problem_Ext[] = []
      const serial = this.zSerial
      if (this.isSingle) {
         const activeBranches = serial.y == null ? [] : Object.keys(serial.y)

         // 1. more than one active branch, while in single mode
         if (activeBranches.length > 1) {
            OUT.push('Only One choices allowed but has multiple active branches')
         }
      }
      return OUT
   }

   @computed get zHasChanges(): boolean {
      for (const branchName of this.allPossibleChoices) {
         const shouldBeActive = this.isBranchActiveByDefault(branchName)
         const child = this._[branchName]
         if (child && !shouldBeActive) return true
         if (!child && shouldBeActive) return true
         if (child && shouldBeActive && child.zHasChanges) return true
      }
      return false
   }

   @computed get zIsOwnSet(): boolean {
      if (!('y' in this.zSerial)) return false
      if (this.isSingle && Object.keys(this.zSerial.y!).length !== 1) return false
      return true
      // if (this.subFields.some((f) => !f.isSet)) return false
      // return true
      // // 💬 2024-09-02 rvion:
      // // | seems to be the correct way to go with for optional stuff
      // // | that can be both without default and without value.
      // if (this.isMulti) return true

      // //
      // const hasAtLeastOneActiveBranch = Object.values(this.zSerial.branches).some((active) => active)
      // if (!hasAtLeastOneActiveBranch) return false
      // return this.subFields.every((f) => f.isSet)
   }

   // #region CHILDREN

   override zGetChildrenSerialPath(branchName: keyof T & string): string {
      return `values.${branchName}`
   }

   /**
    * as of 2024-09-11, choices eagerly dispose de-activated branches,
    * so it's active children fields are just the activated one
    */
   @computed override get zChildrenAll(): Field[] {
      return Object.values(this._)
   }

   override get zChildrenActive(): Field[] {
      return this.zChildrenAll
   }

   @computed override get zSubFieldsWithKeys(): KeyedField[] {
      return Object.entries(this._).map(([key, field]) => ({ key, field }))
   }

   override zAcknowledgeNewChildSerial(mountKey: keyof T & string, childSerial: any): boolean {
      if (this.zSerial.y?.[mountKey] === childSerial) return false
      if (this.zSerial.n?.[mountKey] === childSerial) return false

      return this.zPatchSerial((draft) => {
         draft.y ??= {}
         if (mountKey in draft.y) {
            draft.y[mountKey] = childSerial
         } else {
            draft.n ??= {}
            draft.n[mountKey] = childSerial
         }
      })
   }

   protected checkConfigValidity(): void {
      // INVARIANT CHECKING -----------------------------------------------------------------------------
      const OUT: Problem_Ext[] = []
      const config = this.zConfig

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
      const X = this.zConfig.items
      if (typeof X === 'function') {
         const res = (X as any)(this)
         for (const x of Object.keys(res)) {
            if (res[x] == null) {
               console.log(`[🔶🦖‼️] missing choice: ${x} at (${this.zPath})`)
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
         console.log(`[🔶🦖] missing choice: ${branchName} at (${this.zPath})`)
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
   protected zSetOwnSerial(next: this['{serial}']): void {
      runInAction(() => {
         this.checkConfigValidity() // 🔴 bof -> à appeler ailleurs

         // Normalization:
         const isSet = 'y' in next
         if (!isSet) next = { ...next, y: {} }

         this.zAssignNewSerial(next)

         // if field is not set, and field has default => apply default
         if (!isSet) {
            const branchesActiveByDefault = this.branchesActiveByDefault
            for (const branch of branchesActiveByDefault) {
               // allocate holes in the serial + set branch active...
               const correctChildSchema = bang(this.getSchemaForBranch(branch))
               const targetChildSerial = correctChildSchema.generateSerial(undefined)
               this.zPatchSerial((draft) => {
                  // draft.n ??= {}
                  // draft.y ??= {}
                  draft.y![branch] = targetChildSerial
               })

               // ...and reconcile
               this.zRECONCILE({
                  mountKey: branch,
                  correctChildSchema,
                  existingChild: this._[branch],
                  targetChildSerial: targetChildSerial,
                  attach: (child) => void (this._[branch] = child),
               })
            }
            return
         }

         // otherwise, simply hydrate
         for (const branch of this.allPossibleChoices) {
            const schema = this.getSchemaForBranch(branch)
            const isActive = Boolean(branch in next.y!)
            if (isActive) {
               const branchSerial = next.y?.[branch]
               // and reconcile
               this.zRECONCILE({
                  mountKey: branch,
                  correctChildSchema: bang(schema),
                  existingChild: this._[branch],
                  targetChildSerial: branchSerial,
                  attach: (child) => void (this._[branch] = child),
               })
            } else {
               // remove children
               const prevChild = this._[branch]
               if (prevChild) {
                  prevChild.zDisposeTree()
                  delete this._[branch]
               }
            }
         }
      })
   }

   // #region VALUE
   override zSet(val: Field_choices_SetValue<T>): this {
      this.zRunInTransaction(() => {
         for (const branch of this.allPossibleChoices) {
            this._setBranchTo(branch, val[branch])
         }
      })
      return this
   }
   private _setBranchTo(branch: keyof T & string, to?: Maybe<T[keyof T]['{setValue}']>): void {
      // case 1. branch should be DISABLED
      if (to == null) {
         if (this.isBranchEnabled(branch)) this.zDisableBranch(branch)
      }
      // case 2. branch should be ENABLED
      else {
         this.zRunInTransaction(() => {
            // 2.1. enable branch if disabled
            if (this.isBranchDisabled(branch)) this.zEnableBranch(branch)

            // 2.2 then patch branch value to given value
            this._[branch]!.zSet(to!)
         })
      }
   }

   /** only here to avoid copy-pasting the implementation twice */
   private zValue__setter(val: Field_choices_value<T>): void {
      this.zRunInTransaction(() => {
         for (const branch of this.allPossibleChoices) {
            this._setBranchValue(branch, val[branch])
         }
      })
   }

   /** results, but only for active branches */
   set zValue(val: Field_choices_value<T>) { this.zValue__setter(val) } // prettier-ignore
   get zValue(): Field_choices_value<T> {
      const value = new Proxy({} as any, this.makeValueProxy('fail'))
      void this.zSerial
      Object.defineProperty(this, 'zValue', {
         get: () => (void this.zSerial, value),
         set: (val) => this.zValue__setter(val),
      })
      return value
   }
   get zValueOrZero(): Field_choices_value<T> {
      const value = new Proxy({} as any, this.makeValueProxy('zero'))
      void this.zSerial
      Object.defineProperty(this, 'zValueOrZero', {
         get: () => (void this.zSerial, value),
      })
      return value
   }
   get zValueUnchecked(): Field_choices_unchecked<T> {
      const value = new Proxy({} as any, this.makeValueProxy('unchecked'))
      void this.zSerial
      Object.defineProperty(this, 'zValueUnchecked', {
         get: () => (void this.zSerial, value),
      })
      return value
   }
   get value_set(): Field_choices_SetValue<T> {
      const value = new Proxy({} as any, this.makeValueProxy('set'))
      void this.zSerial
      Object.defineProperty(this, 'value_set', {
         get: () => (void this.zSerial, value),
      })
      return value
   }

   override zIsValueEqual(other: Field): boolean {
      if (!(other instanceof Field_choices)) return false
      return (
         this.hasSameActivatedBranches(other) &&
         this.zChildrenActive.every((f) => {
            const otherChild = other._[f.zMountKey]

            if (otherChild == null) return false

            return f.zIsValueEqual(otherChild)
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
               const field = this.zEnableBranch(branchName)
               if (field == null) return false
               field.zValue = value
               return true
            }
            // case when branch currently ENABLED
            else {
               subWidget.zValue = value
               return true
            }
         },
         get: (_target, prop): any => {
            if (typeof prop !== 'string') return
            const branchName = prop
            const subWidget: Maybe<Field> = this._[branchName]
            if (subWidget == null) return
            if (!(subWidget instanceof Field)) return void console.log(`[🔶] tried to access non-field`, prop)
            return subWidget.zGetValue(mode)
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
                  return subWidget.zGetValue(mode)
               },
            }
         },
      }
   }

   override zGetSetValue(): this['{setValue}'] | undefined {
      // console.log(`[💀 getSetValue] `, this.zPath)
      return this.value_set
   }

   // #region METHODS
   zDisableBranch(branch: keyof T & string): void {
      // ensure branch to disable is enabled
      if (!this._[branch]) {
         return // console.info(`❌ Branch "${branch}" not enabled`)
      }
      this.zRunInTransaction(() => {
         // remove children
         const prevChild = this._[branch]
         if (prevChild) prevChild.zDisposeTree()
         delete this._[branch]

         // WE NEED TO KEEP THIS ONE UNLESS WE WANT TO DISCARD THE DRAFT
         // we could make this opt-in via a config flag and persist in memory only via enableBranch
         // delete this.zSerial.values_[branch]

         // console.log(`[🤠] disable 3`, this.zSerial)
         this.zPatchSerial((draft) => {
            draft.y ??= {}
            if (draft.y[branch]) {
               if (this.zPreserveDisabledBranches) {
                  ;(draft.n ??= {} as any)[branch] = draft.y[branch]
               }
               delete draft.y[branch]
            }
         })
         // console.log(`[🤠] disable 4`, this.zSerial)
      })
   }

   zEnableBranch<K extends keyof T & string>(
      //
      branch: K,
      serial?: T[K]['{serial}'],
   ): Maybe<T[K]['{field}']> {
      // ensure branch to enable is disabled
      if (this.isBranchEnabled(branch)) {
         void console.info(`❌ Branch "${branch}" already enabled`)
         return this._[branch]
      }

      this.zRunInTransaction(() => {
         const schema = this.getSchemaForBranch(branch)
         if (schema == null) return null

         if (this.isSingle) {
            for (const key in this._) {
               this.zDisableBranch(key)
            }
         }
         // set the active branch as active
         this.zPatchSerial((draft) => {
            draft.y ??= {}
            if (serial) {
               draft.y[branch] = serial
               if (draft.n?.[branch]) delete draft.n[branch]
            } else if (draft.n?.[branch]) {
               draft.y[branch] = draft.n[branch]
               delete draft.n[branch]
            } else {
               draft.y[branch] = schema.generateSerial(undefined)
            }
         })

         this.zRECONCILE({
            mountKey: branch,
            correctChildSchema: schema,
            existingChild: this._[branch],
            targetChildSerial: this.zSerial.y?.[branch],
            attach: (child) => {
               this._[branch] = child
            },
         })
      })
      return this._[branch]
   }

   toggleBranch(branch: keyof T & string): void {
      // 💬 2024-03-15 rvion: no need to bumpValue in this function;
      // | it's handled by enableBranch and disableBranch themselves.
      if (this.isBranchEnabled(branch)) {
         if (this.isMulti) this.zDisableBranch(branch)
      } else {
         this.zEnableBranch(branch)
      }
   }

   isBranchDisabled(branch: keyof T & string): boolean {
      return !this.isBranchEnabled(branch)
   }

   isBranchEnabled(branch: keyof T & string): boolean {
      if (this.zSerial.y == null) return false
      return branch in this.zSerial.y
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
      value?: Maybe<T[keyof T]['{value}']>,
   ): boolean {
      // case 1. branch should be DISABLED
      if (value == null) {
         // disable branch
         if (this.isBranchEnabled(branch)) {
            this.zDisableBranch(branch)
            return true
         } else {
            return false
         }
      }

      // case 2. branch should be ENABLED
      else {
         // 2.1. enable branch if disabled
         if (this.isBranchDisabled(branch)) this.zEnableBranch(branch)

         // 2.2 then patch branch value to given value
         this._[branch]!.zValue = value!
         return true
      }
   }

   // #region Matching
   matchCase<R, DEF = null>(
      cases: {
         [K in keyof T]?: (field: T[K]['{field}']) => R
      },
      def: DEF,
   ): R | DEF {
      for (const branch of this.activeBranchesList) {
         if (branch != null && branch.zMountKey in cases) {
            return cases[branch.zMountKey]!(branch)
         }
      }
      return def
   }

   matchExhaustive<R>(cases: {
      [K in keyof T]: (field: T[K]['{field}']) => R
   }): R {
      const result = this.matchCase(cases, _NotExhaustive)
      if (result == _NotExhaustive)
         throw new Error(
            `❌ matchExhaustive did not have exhaustive cases (missing:${this.activeBranchNames})`,
         )
      return result
   }

   matchAll<R>(cases: {
      [K in keyof T]?: (field: T[K]['{field}']) => R
   }): R[] {
      const OUT: R[] = []
      for (const branch of this.activeBranchesList) {
         if (branch != null && branch.zMountKey in cases) {
            OUT.push(cases[branch.zMountKey]!(branch))
         }
      }
      return OUT
   }

   // #region SETTERS
   override zRandomize(): void {
      // pick ONE random branch
      const branches = this.allPossibleChoices
      const branch = branches[Math.floor(Math.random() * branches.length)]
      if (branch == null) return
      this.zEnableBranch(branch)
      this.zChildrenActive.forEach((f) => f.zRandomize())
   }

   // #region PATCH

   public static readonly patchedSerialPaths: readonly string[] = Object.freeze([])

   protected override zGenerateOwnPatches(referenceField: this): Field_choices_patch<T>[] {
      const patches: Field_choices_patch<T>[] = []

      Object.entries(this._)
         .filter(([name]) => !referenceField.isBranchEnabled(name))
         .forEach(([name, child]) => {
            // if the child is already the same
            const serial =
               referenceField.zSerial.n?.[name] === child.zSerial //
                  ? undefined
                  : child.zSerial

            patches.push({
               op: 'enable',
               fieldPath: this.zPath,
               fieldType: 'choices',
               branch: name,
               serial: serial,
            })
         })

      Object.entries(referenceField._)
         .filter(([name]) => !this.isBranchEnabled(name))
         .forEach(([name]) => {
            patches.push({
               op: 'disable',
               fieldPath: this.zPath,
               fieldType: 'choices',
               branch: name,
            })
         })

      return patches
   }

   protected override zApplyOwnPatches(patches: Field_choices_patch<T>[]): void {
      if (patches.length === 0) return

      this.zRunInTransaction(() => {
         patches.forEach((patch) => {
            if (isEnablePatch(patch)) {
               const activeChild = this.getChildIfActive(patch.branch)
               if (activeChild != null) {
                  activeChild.zSetSerial(patch.serial)
                  return
               }
               this.zEnableBranch(patch.branch, patch.serial)
            } else if (isDisablePatch(patch)) {
               this.zDisableBranch(patch.branch)
            } else {
               exhaust(patch)
            }
         })
      })
   }

   get zPreserveDisabledBranches(): boolean {
      return this.zConfig.preserveDisabledBranches ?? true
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
