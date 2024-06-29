import type { BaseField } from '../model/BaseField'

import { observer } from 'mobx-react-lite'

import { Button } from '../../csuite/button/Button'

export const WidgetUndoChangesButtonUI = observer(function WidgetUndoChangesButtonUI_(p: {
    //
    className?: string
    widget: BaseField
}) {
    const widget = p.widget
    return (
        <Button
            subtle
            tooltip='Reset to default values'
            borderless
            className={p.className}
            onClick={() => widget?.reset()}
            disabled={!(widget?.hasChanges ?? false)}
            icon='mdiUndoVariant'
            look='ghost'
            size='input'
            square
        />
    )
})
