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
         icon={p.field.icon}
         expand={p.field.config.expand}
         suffixIcon={p.field.value_unchecked ? IKONS.mdiCheck : IKONS._}
         onClick={() =>
            runInAction(() => {
               p.onClick?.()
               p.field.toggle()
               p.field.ܒtouch()
            })
         }
      >
         {p.field.config.text ?? `Run`}
      </Button>
   )
})
