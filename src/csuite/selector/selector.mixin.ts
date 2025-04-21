import type { FieldPattern } from '../../csuite-cushy/presenters/RenderRule'
import type { Field } from '../model/Field'

import { defineFieldMixin } from '../model/defineFieldMixin'
import { FieldSelector } from './selector'

export type SelectorMixin = typeof SelectorMixinImpl

export const SelectorMixinImpl = defineFieldMixin({
   // #region quick checks
   zContains(selector_: string | FieldSelector): boolean {
      const selector = FieldSelector.from(selector_)
      return this.zSelect(selector).length > 0
   },
   zMatches(selector_: FieldPattern<Field>, virtualParents?: Map<Field, Field>): boolean {
      return FieldSelector.match(selector_, this, virtualParents)
   },
   // selection
   zSelect(selector_: string | FieldSelector): Field[] {
      const selector = FieldSelector.from(selector_)
      return selector.runSelect(this)
   },
   zSelectFirstOrNull(selector_: string | FieldSelector): Field | null {
      const selector = FieldSelector.from(selector_)
      return selector.runSelect(this)[0] ?? null
   },
   zSelectFirstOrThrow<FIELD extends Field>(selector_: string | FieldSelector): FIELD | null {
      const selector = FieldSelector.from(selector_)
      const x = selector.runSelect(this)[0]
      if (x == null) throw new Error('selectOneOrThrow: did not yield any Field')
      return x as FIELD
   },
})

export const SelectorMixinDescriptors = Object.getOwnPropertyDescriptors(SelectorMixinImpl)
