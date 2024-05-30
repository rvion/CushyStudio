import type { IWidget } from '../IWidget'

import { observer } from 'mobx-react-lite'

import { Button } from '../../rsuite/button/Button'

export const WidgetUndoChangesButtonUI = observer(function WidgetUndoChangesButtonUI_(p: { widget: IWidget }) {
    const widget = p.widget
    return (
        <Button
            onClick={() => widget?.reset()}
            disabled={!(widget?.hasChanges ?? false)}
            icon='mdiUndoVariant'
            look='ghost'
            square
            xs
        />
    )
})
