import type { Field } from '../../csuite/model/Field'
import type { Renderer } from './Renderer'
import type { RenderProps } from './RenderProps'

/**
 * this is the final type that is given to your most of your widgets (Shell, Body, ...)
 * it contains context things like `Presenter`, `field`, and `UI catalog`
 */
export interface RenderPropsCompiled<FIELD extends Field = Z.AnyField>
/** full list of all slots when applying all the rules. */
   extends RenderProps<FIELD> {
   /** presenter */
   presenter: Renderer

   /** Field we're currently rendering */
   field: FIELD
}
//
