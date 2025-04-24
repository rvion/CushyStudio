import type { FrameAppearance } from '../../frame/FrameTemplates'
import type { Field_bool } from '../bool/FieldBool'

import { runInAction } from 'mobx'

import { Button } from '../../button/Button'

export const WidgetButtonUI = obs(function WidgetButtonUI_<K extends any>(p: {
   field: Field_bool
   look?: FrameAppearance
   onClick: () => void
}) {
   //    const extra = p.field.config.useContext?.() as K
   //    const context: Field_button_context<K> = { widget: p.field, context: extra }
   return (
      <Button
         look={p.look}
         className='self-start'
         icon={p.field.zIcon}
         expand={p.field.zConfig.expand}
         suffixIcon={p.field.zValueUnchecked ? IKONS.mdiCheck : IKONS._}
         onClick={() =>
            runInAction(() => {
               p.onClick?.()
               p.field.toggle()
               p.field.zTouch()
            })
         }
      >
         {p.field.zConfig.text ?? `Run`}
      </Button>
   )
})
