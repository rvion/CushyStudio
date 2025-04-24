import type { RenderPropsCompiled } from '../../../csuite-cushy/presenters/RenderPropsCompiled'
import type { Field_shared } from './FieldShared'

import { renderFCOrNode } from '../../utils/renderFCOrNode'

export const ShellSharedUI = obs(function ShellShared(p: RenderPropsCompiled<Field_shared>) {
   const field = p.field
   const child = field.child
   return (
      <child.UI //
         UpDownBtn={p.UpDownBtn}
         DeleteBtn={p.DeleteBtn}
         Toogle={p.Toogle}
         shouldShowHiddenFields
         Title={(x) => renderFCOrNode(p.Title, { field: field })}
      />
   )
})
