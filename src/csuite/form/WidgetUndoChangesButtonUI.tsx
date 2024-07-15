import type { Field } from '../model/Field'

import { observer } from 'mobx-react-lite'

import { Button } from '../../csuite/button/Button'

export const WidgetUndoChangesButtonUI = observer(function WidgetUndoChangesButtonUI_(p: {
    //
    className?: string
    field: Field
}) {
    const field = p.field
    return (
        <Button
            subtle
            tooltip='Reset to default values'
            borderless
            className={p.className}
            onClick={() => field?.reset()}
            disabled={!(field?.hasChanges ?? false)}
            icon='mdiUndoVariant'
            look='ghost'
            size='input'
            square
        />
    )
})
