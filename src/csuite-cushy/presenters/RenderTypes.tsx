import type { Field } from '../../csuite/model/Field'
import type { FieldSelector } from '../../csuite/selector/selector'
import type { CovariantFn1 } from '../../csuite/variance/BivariantHack'
import type { Presenter } from './Renderer'
import type { renderPresets } from './RenderPresets'
import type { DisplaySlots } from './RenderSlots'

// prettier-ignore
export type DisplaySlotExt<FIELD extends Field> =
   | DisplaySlotFn<FIELD>
   | DisplaySlots<FIELD> // RenderDSL<FIELD['$Child']['$Field']>

// display rule is just a function that returns a display slot, injecting the field
export type DisplaySlotFn<FIELD extends Field> = CovariantFn1<
   DisplayRuleCtx<FIELD>,
   DisplaySlots<FIELD> | undefined | void
>

export type DisplayRuleCtx<FIELD extends Field = Field> = {
   field: FIELD

   set(x: DisplaySlotExt<FIELD>): void
   set(selector: string, x: DisplaySlotExt<Field>): void
   set(selector: FieldSelector, x: DisplaySlotExt<Field>): void
   set<Sub extends Field>(field: Maybe<Sub>, x: DisplaySlotExt<Sub>): void

   presets: typeof renderPresets
}

/**
 * this is the final type that is given to your most of your widgets (Shell, Body, ...)
 * it contains context things like `Presenter`, `field`, and `UI catalog`
 */
export interface CompiledRenderProps<out FIELD extends Field = Field>
/** full list of all slots when applying all the rules. */
   extends DisplaySlots<FIELD> {
   /** presenter */
   presenter: Presenter

   /** Field we're currently rendering */
   field: FIELD

   /** catalog of widgets, to ease discoverability and make it easy to use variants. */
   UI: CATALOG.widgets
}
