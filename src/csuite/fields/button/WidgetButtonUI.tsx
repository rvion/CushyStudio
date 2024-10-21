import type { Field_button, Field_button_context } from './FieldButton'

import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'

import { Button } from '../../button/Button'

export const WidgetButtonUI = observer(function WidgetButtonUI_<K extends any>(p: { field: Field_button<K> }) {
    const extra = p.field.config.useContext?.() as K
    const context: Field_button_context<K> = { widget: p.field, context: extra }
    return (
        <Button
            look={p.field.config.look}
            className='self-start'
            icon={p.field.icon}
            expand={p.field.config.expand}
            onClick={() =>
                runInAction(() => {
                    p.field.config.onClick?.(context)
                    p.field.touch()
                })
            }
        >
            {p.field.config.text ?? `Run`}
        </Button>
    )
})
