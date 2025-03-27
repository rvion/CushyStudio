import type { RenderPropsCompiled } from '../../../csuite-cushy/presenters/RenderPropsCompiled'
import type { Field_optional } from './FieldOptional'

import { WidgetToggleUI } from '../../form/WidgetToggleUI'
import { renderFCOrNode } from '../../utils/renderFCOrNode'

export const ShellOptionalUI = obs(function ShellOptionalUI_(p: RenderPropsCompiled<Field_optional>) {
   const field = p.field
   const extraClass = field.zIsDisabled ? 'pointer-events-none opacity-30 bg-[#00000005]' : undefined
   const child = field.child
   return (
      <child.UI //
         UpDownBtn={p.UpDownBtn}
         DeleteBtn={p.DeleteBtn}
         Toogle={<WidgetToggleUI field={child} />}
         Title={(x) => renderFCOrNode(p.Title, { field: field })}
         classNameAroundBodyAndHeader={extraClass}
      />
   )
})

export const ShellOptionalEnabledUI = obs(function ShellOptionalEnabledUI_(
   p: RenderPropsCompiled<Field_optional>,
) {
   const field = p.field
   // const extraClass = field.isDisabled ? 'pointer-events-none opacity-30 bg-[#00000005]' : undefined
   const child = field.child
   return (
      <child.UI //
         UpDownBtn={p.UpDownBtn}
         DeleteBtn={p.DeleteBtn}
         // Toogle={<child.UIToggle />}
         // Title={(x) => renderFCOrNode(p.Title, { field: field })}
      />
   )
})
