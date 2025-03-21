import type { CSchema } from '../../model/CSchema'
import type { CodegenOpts, FieldConstructor } from '../../model/FieldConstructor'
import type { Patch } from '../../model/Patch'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'

import { observable, reaction } from 'mobx'

import { Field, type KeyedField } from '../../model/Field'
import { registerFieldClass } from '../WidgetUI.DI'

// #region CONFIG TYPE
type Field_link_ownConfig<A extends CSchema, B extends CSchema> = {
   // injected
   share: A

   // into
   children(child: A['$field']): B
   dynamic?(a: A['$field']): any
}

// #region SERIAL TYPE
type Field_link_ownSerial<A extends CSchema, B extends CSchema> = {
   $: 'link'
   a?: A['$serial']
   b?: B['$serial']
}

// #region VALUE TYPE
/** A value is NOT used; it may be part of B */
export type Field_link_value<A extends CSchema, B extends CSchema> = B['$value']
export type Field_link_SetValue<A extends CSchema, B extends CSchema> = B['$setValue']
export type Field_link_unchecked<A extends CSchema, B extends CSchema> = B['$unchecked']

// #region $FieldType
export interface Field_link<A extends CSchema, B extends CSchema> {
   $type: 'link'
   $ownConfig: Field_link_ownConfig<A, B>
   $ownSerial: Field_link_ownSerial<A, B>
   $value: B['$value']
   $setValue: B['$setValue']
   $unchecked: Field_link_unchecked<A, B>
   $child: B['$field']
   $opts: unknown
   $ownPatch: Patch<'link'>
}

// #region STATE
export class Field_link<A extends CSchema, B extends CSchema> extends Field {
   // #region TYPE
   static readonly type: 'link' = 'link'
   private static readonly unsetSerial: Field_link<any, any>['$serial'] = { $: 'link' }
   static readonly codeForTypescriptValue = (
      config: Field_link<CSchema, CSchema>['$config'],
      opts: CodegenOpts,
   ): string => {
      // const myIndent = opts.indent ?? 0
      // const childOpts = { ...opts, indent: myIndent + 1 }
      const childOpts = opts
      const a = config.share.create()
      const b = config.children(a)
      const aStr = config.share.codeForTypescriptValue(childOpts)
      const bStr = b.codeForTypescriptValue(childOpts)
      return `Z.Link<${aStr},${bStr}>`
   }
   static override migrateSerial(): undefined {}
   static generateSerial(): Field_link<CSchema, CSchema>['$serial'] {
      // TODO what to do here ?
      return this.unsetSerial
   }

   // #region CTOR
   constructor(
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: CSchema<Field_link<A, B>>,
      initialMountKey: string,
      serial?: Field_link<A, B>['$serial'],
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      this.init(serial)

      const dynamicFn = this.config.dynamic
      if (dynamicFn != null) {
         const cleanup = reaction(
            () => dynamicFn(this.aField),
            () => {
               this.RECONCILE({
                  mountKey: 'b',
                  existingChild: this.bField,
                  correctChildSchema: this.config.children(this.aField),
                  targetChildSerial: serial?.b,
                  attach: (child) => {
                     this.bField = child
                     this.patchSerial((draft) => void (draft.b = child.serial))
                  },
               })
            },
         )
         this.disposeFns.push(cleanup)
      }
   }

   // #region children
   /** the dict of all child widgets */
   @observable.ref accessor aField!: A['$field']
   @observable.ref accessor bField!: B['$field']

   // #region serial
   protected setOwnSerial(next: this['$serial']): void {
      this.assignNewSerial(next)

      this.RECONCILE({
         mountKey: 'a',
         existingChild: this.aField,
         correctChildSchema: this.config.share,
         targetChildSerial: next.a,
         attach: (child) => {
            this.aField = child
            this.patchSerial((draft) => void (draft.a = child.serial))
         },
      })

      this.RECONCILE({
         mountKey: 'b',
         existingChild: this.bField,
         correctChildSchema: this.config.children(this.aField),
         targetChildSerial: next.b,
         attach: (child) => {
            this.bField = child
            this.patchSerial((draft) => void (draft.b = child.serial))
         },
      })
   }

   override get actualWidgetToDisplay(): Field {
      return this.bField.actualWidgetToDisplay
   }

   // #region Validation
   get ownConfigSpecificProblems(): Problem_Ext {
      return null
   }

   get ownTypeSpecificProblems(): Problem_Ext {
      return [this.aField.ownTypeSpecificProblems, this.bField.ownTypeSpecificProblems]
   }

   get isOwnSet(): boolean {
      return this.bField.isSet
   }

   get hasChanges(): boolean {
      return this.bField.hasChanges
   }

   override reset(): void {
      this.bField.reset()
   }

   override get indentChildren(): number {
      return 0
   }

   override get summary(): string {
      return this.bField.summary
   }

   // #region children

   override _acknowledgeNewChildSerial(mountKey: string, serial: any): boolean {
      if (mountKey === 'a') {
         if (this.serial.a === serial) return false
         const didChange = this.patchSerial((draft) => void (draft.a = serial))
         return didChange
      }
      if (mountKey === 'b') {
         if (this.serial.b === serial) return false
         const didChange = this.patchSerial((draft) => void (draft.b = serial))
         return didChange
      }
      throw new Error(`[❌] invalid mountKey: ${mountKey}`)
   }

   override getChildrenSerialPath(branchName: 'a' | 'b'): string {
      return branchName
   }

   override get childrenAll(): [A['$field'], B['$field']] {
      return [this.aField, this.bField]
   }

   override get subFieldsWithKeys(): KeyedField[] {
      return [
         { key: 'a', field: this.aField },
         { key: 'b', field: this.bField },
      ]
   }

   // #region value
   get value(): Field_link_value<A, B> {
      return this.value_or_fail
   }

   override set(val: B['$setValue']): this {
      this.bField.set(val)
      return this
   }

   set value(val: Field_link_value<A, B>) {
      this.runInTransaction(() => {
         this.bField.value = val
      })
   }

   get value_or_fail(): Field_link_value<A, B> {
      return this.bField.value_or_fail
   }
   get value_or_zero(): Field_link_value<A, B> {
      return this.bField.value_or_zero
   }
   get value_unchecked(): Field_link_unchecked<A, B> {
      return this.bField.value_unchecked
   }

   override isValueEqual(other: Field): boolean {
      if (!(other instanceof Field_link)) return false
      return this.aField === other.aField && this.bField === other.bField
   }

   public static readonly patchedSerialPaths: readonly string[] = Object.freeze([])

   // Don't get patches from children
   protected override generateChildrenPatches(reference: this): Patch<'list', unknown>[] {
      return []
   }

   protected override applyChildrenPatches(patches: Patch<'list', unknown>[]): void {
      // NOOP
   }
}

// DI
registerFieldClass('link', Field_link)
Field_link satisfies FieldConstructor<Field_link<any, any>>
