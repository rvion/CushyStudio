import type { Field } from '../model/Field'

import { defineFieldMixin } from '../model/defineFieldMixin'
import { FieldSelector } from './selector'

export type SelectorMixin = typeof SelectorMixinImpl

export const SelectorMixinImpl = defineFieldMixin({
   // extraction
   extract(selector: string): any {
      return new FieldSelector(selector).selectFrom(this).values
   },
   extractLastOrNull(selector: string): any {
      const values = new FieldSelector(selector).selectFrom(this).values
      if (values.length === 0) return null
      return values[values.length - 1]
   },
   extractLastOrThrow(selector: string): any {
      const values = new FieldSelector(selector).selectFrom(this).values
      if (values.length === 0) throw new Error('extractLastOrThrow: did not yield any value')
      return values[values.length - 1]
   },

   // selection
   select(selector: string): Field[] {
      return new FieldSelector(selector).selectFrom(this).fields
   },
   selectFirstOrNull(selector: string): Field | null {
      return new FieldSelector(selector).selectFrom(this).fields[0] ?? null
   },
   selectFirstOrThrow(selector: string): Field | null {
      const x = new FieldSelector(selector).selectFrom(this).fields[0]
      if (x == null) throw new Error('selectOneOrThrow: did not yield any Field')
      return x
   },

   // #region quick checks
   contains(selector: string): boolean {
      return this.select(selector).length > 0
   },
   matches(selector: string): boolean {
      return this.select(selector).includes(this)
   },
})

export const SelectorMixinDescriptors = Object.getOwnPropertyDescriptors(SelectorMixinImpl)
