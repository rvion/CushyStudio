import type { CompiledRenderProps } from '../../../csuite-cushy/presenters/RenderTypes'
import type { Field_shared } from './FieldShared'

import { observer } from 'mobx-react-lite'

import { renderFCOrNode } from '../../utils/renderFCOrNode'

export const ShellSharedUI = observer(function ShellShared(p: CompiledRenderProps<Field_shared>) {
   const field = p.field
   const child = field.config.field
   return (
      <child.UI //
         UpDownBtn={p.UpDownBtn}
         DeleteBtn={p.DeleteBtn}
         Toogle={p.Toogle}
         Title={(x) => renderFCOrNode(p.Title, { field: field })}
      />
   )
})
