import type { IWidget } from '../IWidget'

import { observer } from 'mobx-react-lite'

import { Button } from '../../rsuite/button/Button'

export const WidgetUndoChangesButtonUI = observer(function WidgetUndoChangesButtonUI_(p: {
    //
    className?: string
    widget: IWidget
}) {
    const widget = p.widget
    return (
        <Button
            subtle
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
