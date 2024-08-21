import { observer } from 'mobx-react-lite'

import { Ikon } from '../icons/iconHelpers'

export const WidgetLabelCaretPlaceholderUI = observer(function WidgetLabelCaretPlaceholderUI_(p: { className?: string }) {
    return (
        <Ikon._
            className={p.className}
            tw={[
                //
                'UI-WidgetLabelCaret self-start minh-widget ABDDE',
                'COLLAPSE-PASSTHROUGH shrink-0',
            ]}
        />
    )
})
