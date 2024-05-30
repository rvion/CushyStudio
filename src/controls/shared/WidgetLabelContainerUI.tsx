import { observer } from 'mobx-react-lite'

import { BoxUI } from '../../rsuite/box/BoxUI'
import { useTheme } from '../../rsuite/theme/useTheme'

export const WidgetLabelContainerUI = observer(function WidgetLabelContainerUI_(p: { children: React.ReactNode }) {
    const theme = useTheme()
    return (
        <BoxUI tw='flex items-center' text={theme.value.labelText}>
            {p.children}
        </BoxUI>
    )
})
